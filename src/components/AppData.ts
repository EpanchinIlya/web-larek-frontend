import {
	IBasket,
	ICard,
	ICardList,
	IDelivery,
	IOrder,
	IOrderAllData,
	Method,
} from '../types';
import { EventEmitter, IEvents } from './base/events';

export class CardList implements ICardList {
	bigCard: ICard;
	cardList: ICard[] = [];
	protected events: EventEmitter;

	constructor(events: EventEmitter) {
		this.events = events;
	}

	initList(list: ICard[]) {
		this.cardList = list.map((item) => ({
			...item,
			isAddedToBasket: false,
		}));
		this.events.emit('cardList:updated', this.cardList);
	}

	addBigCard(card: ICard) {
		this.bigCard = card;
		this.events.emit('cardList:addBigCard', card);
	}

	removeBigCard() {
		this.bigCard = undefined;
	}
}

export class Basket implements IBasket {
	cardListBasket: ICard[] = [];
	constructor(protected events: EventEmitter) {}

	remove(id: string) {
		this.cardListBasket = this.cardListBasket.filter((card) => {
			return card.id !== id;
		});

		this.events.emit('basket:changed', this.cardListBasket);
	}

	add(card: ICard) {
		const cardIndex = this.cardListBasket.findIndex((x) => x.id === card.id);
		if (cardIndex === -1) {
			this.cardListBasket.push(card);
			this.events.emit('basket:changed', this.cardListBasket);
		}
	}

	clear() {
		this.cardListBasket = [];
	}

	getCardListBasket() {
		return this.cardListBasket;
	}

	getTotalPrise() {
		return this.cardListBasket.reduce((total, card) => {
			return total + card.price;
		}, 0);
	}

	getItems() {
		return this.cardListBasket.map((item) => item.id);
	}
}

export class Order implements IOrder {
	total: number;
	items: string[];
	phone?: string;
	email?: string;
	address?: string;
	payment?: Method;
	formErrors: string[] = [];

	constructor(events: IEvents) {}

	setValidateField(
		field: keyof IOrderAllData,
		value: IOrderAllData[keyof IOrderAllData]
	) {
		if (field === 'payment') this.payment = value as Method;
		if (field === 'address') this.address = value;
		if (field === 'email') this.email = value;
		if (field === 'phone') this.phone = value;
	}

	validateDelivery(): boolean {
		this.formErrors = [];
		if (!this.payment) {
			this.formErrors.push('Необходимо выбрать способ доставки.');
		}

		if (this.address === undefined || this.address.length === 0) {
			this.formErrors.push('Необходимо указать адрес доставки.');
		}

		if (this.formErrors.length > 0) {
			return false;
		} else {
			return true;
		}
	}

	validateContact(): boolean {
		this.formErrors = [];
		if (!this.email) {
			this.formErrors.push('Необходимо указать адрес электронной почты.');
		}

		if (!this.phone) {
			this.formErrors.push('Необходимо указать номер телефона.');
		}

		if (this.formErrors.length > 0) return false;
		else return true;
	}
}
