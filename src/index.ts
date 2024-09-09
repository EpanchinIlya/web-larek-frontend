import './scss/styles.scss';
import { Basket, CardList, Order } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { CardApi } from './components/CardApi';

import { API_URL, CDN_URL } from './utils/constants';
import { PageView } from './components/Page';
import { ICard, IOrderAllData } from './types';
import { CardModalView, CardView } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { BasketView } from './components/Basket';
import { OrderContactView, OrderDeliveryView } from './components/Order';
import { SuccessView } from './components/Successed';

const cardListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBigViewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderDeliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successedTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new CardApi(CDN_URL, API_URL);
const eventEmmiter = new EventEmitter();
const cardList = new CardList(eventEmmiter);
const page = new PageView(document.body, eventEmmiter);
const modal = new Modal(modalContainer, eventEmmiter);
const basket = new Basket(eventEmmiter);
const basketView = new BasketView(cloneTemplate(basketTemplate), eventEmmiter);
const orderDeliveryView = new OrderDeliveryView(
	cloneTemplate(orderDeliveryTemplate),
	eventEmmiter
);
const orderContactView = new OrderContactView(
	cloneTemplate(orderContactemplate),
	eventEmmiter
);
const successed = new SuccessView(cloneTemplate(successedTemplate), {
	onClick: () => modal.close(),
});

const order = new Order(eventEmmiter);

//page.basketCounter = 3;

// получили данные с сервера
api
	.getCardList()
	.then((data) => {
		cardList.initList(data);
		console.log(cardList.cardList);
	})
	.catch((error) => {
		console.log(error);
	});

// Обновили список карточек
eventEmmiter.on('cardList:updated', (data: ICard[]) => {
	const list = data.map((card) => {
		const listCard = new CardView('card', cloneTemplate(cardListTemplate), {
			onClick: () => eventEmmiter.emit('card:select', card),
		});
		return listCard.render({
			id: card.id,
			title: card.title,
			price: card.price,
			image: card.image,
			category: card.category,
		});
	});
	page.catalog = list;
});

// открываем карточку
eventEmmiter.on('card:select', (card: ICard) => {
	cardList.addBigCard(card);
});

eventEmmiter.on('cardList:addBigCard', (card: ICard) => {
	const cardBigView = new CardModalView(
		'card',
		cloneTemplate(cardBigViewTemplate),
		{
			onClick: () => {
				card.isAddedToBasket = !card.isAddedToBasket;
				if (card.isAddedToBasket) eventEmmiter.emit('card:add', card);
				else eventEmmiter.emit('card:remove', card);
			},
		}
	);

	const cardRender = {
		content: cardBigView.render({
			id: card.id,
			title: card.title,
			price: card.price,
			image: card.image,
			description: card.description,
			category: card.category,
			isAddedToBasket: card.isAddedToBasket,
		}),
	};
	modal.render(cardRender);
});

//Добавление карточки в корзину
eventEmmiter.on('card:add', (card: ICard) => {
	basket.add(card);
	modal.close();
});
// Удаление карточки из корзины
eventEmmiter.on('card:remove', (card: ICard) => {
	basket.remove(card.id);
	modal.close();
});

// содержание корзины изменено
eventEmmiter.on('basket:changed', (basket: ICard[]) => {
	page.basketCounter = basket.length;
});

eventEmmiter.on('basket:open', () => {
	const cardListBasketView = basket.cardListBasket.map((card) => {
		const cardBasket = new CardView('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				card.isAddedToBasket = !card.isAddedToBasket;

				basket.remove(card.id);
				eventEmmiter.emit('basket:open');
			},
		});
		return cardBasket.render({
			id: card.id,
			title: card.title,
			price: card.price,
		});
	});

	const basketRender = basketView.render({
		cards: cardListBasketView,
		total: basket.getTotalPrise(),
	});
	order.total = basket.getTotalPrise();
	order.items = basket.getItems();
	modal.render({ content: basketRender });
});

// открываем форму доставки

eventEmmiter.on('order:open', () => {
	orderDeliveryView.resetButtonStatus();
	const orderDeliveryRender = orderDeliveryView.render({
		address: '',
		formValid: false,
		formErrors: [],
	});
	modal.render({ content: orderDeliveryRender });
});

// отработка  изменений формы доставки

eventEmmiter.on(
	'order.delivery:change',
	(data: {
		field: keyof IOrderAllData;
		value: IOrderAllData[keyof IOrderAllData];
	}) => {
		order.setValidateField(data.field, data.value);

		if (order.validateDelivery()) {
			orderDeliveryView.formValid = true;
		} else {
			orderDeliveryView.formValid = false;
		}

		eventEmmiter.emit('errors:change:delivery', order.formErrors);
	}
);

eventEmmiter.on('errors:change:delivery', (data: string[]) => {
	var str = '';
	if (data.length > 0) {
		data.forEach((item) => {
			str = str + item + '  ';
		});
	}

	orderDeliveryView.formErrors = str;
});

eventEmmiter.on('order.delivery:next', () => {
	const orderContactRender = orderContactView.render({
		email: '',
		phone: '',
		formValid: false,
		formErrors: [],
	});
	modal.render({ content: orderContactRender });
});

// отработка  изменений формы контактов

eventEmmiter.on(
	'order.contact:change',
	(data: {
		field: keyof IOrderAllData;
		value: IOrderAllData[keyof IOrderAllData];
	}) => {
		order.setValidateField(data.field, data.value);

		if (order.validateContact()) {
			orderContactView.formValid = true;
		} else {
			orderContactView.formValid = false;
		}

		eventEmmiter.emit('errors:change:contact', order.formErrors);
	}
);

eventEmmiter.on('errors:change:contact', (data: string[]) => {
	var str = '';
	if (data.length > 0) {
		data.forEach((item) => {
			str = str + item + '  ';
		});
	}

	orderContactView.formErrors = str;
});

eventEmmiter.on('order.contact:next', () => {
	api
		.postOrder({
			payment: order.payment,
			address: order.address,
			phone: order.phone,
			email: order.email,
			total: order.total,
			items: order.items,
		})
		.then((data) => {
			page.basketCounter = 0;
			basket.clear();
			modal.render({ content: successed.render({ total: data.total }) });
		})
		.catch((error) => {
			console.log(error);
		});

	modal.render({
		content: successed.render({ total: basket.getTotalPrise() }),
	});
});
