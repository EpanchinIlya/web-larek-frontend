# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
-------------------------------------------------------------------------------

## Общее описание реализации

При разработке проекта используется архитектурный паттерн MVP (Model-View-Presenter).
Слой Model содержит данные с которыми работает приложение. Занимается получением, преобразованием, передачей данных.
Слой View реализует отображение данных, поступающих из модели (сам не содержит никаких данных). Занимается отприсовкой данных,
согласно полученным шаблонам из html. 
Слой Presenter связывает два предыдущих слоя между собой, запуская методы объектов из слоев Model и View.
Код Presenter-а реализован непосредственно в файле index.ts, без написания отдельного класса для него.
В приложении реализован событийно - ориентированный подход с использованием брокера событий.


Слой модели реализуется с помощью классов: card, cardList,  basket, Order
Слой представления реализуется с помощью классов:  Modal, Form, CardView, CardModalView, BasketView, OrderDeliveryView, OrderContactView, SuccessView, PageView
Так же в проекте используются следующие модули:
                    api.ts - класс для получения данных с сервера
                    events.ts - класс брокера событий, для реализации событийно -ориентированного подхода. 
                    components.ts - базовый класс для элементов представления.
---------------------------------------------------------------------------------

## Базовые компоненты

Базовый компонент - abstract class Component<T>

От него наследуются все классы представления. Имеет метод render(data?: Partial<T>): HTMLElement  
На вход получает объект, состоящий из некоторого кол-ва полей представленных в типе Т, и возвращающий HTMLElement "наполненный"
данными из этих полей.


----------------------------------

Базовый компонент - class Api - обеспечивает взаимодействие с сервером, предоставляя методы:
get(uri: string)  - запрашивает данные с сервера с запросом GET, параметром принимает endpoint.
post(uri: string, data: object, method: ApiPostMethods = 'POST') - метод, позволяющий делать POST, PUT, DELETE запросы.
В параметры  метода передаются: endpoint, тело запроса (body), метод запроса.

-----------------------------------

Базовый компонент - class EventEmitter реализует интерфейс IEvents.

 interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
Класс содержит струтуру, представляющую собой коллекцию, ключом элемента коллекции является строка с именем события, значением - массив коллбеков, 
которые должны выполниться при возникновании события с названием из ключа.

метод on(name, callback) - установка обработчика: принимает имя события и callback функцию, которая выполнится при наступлении данного события.
метод emit(name, data?) - вызывает событие с именем, установленным в name, при наличии передает в callback данные  data.
--------------------------------------------------------------------------------

## Компоненты модели данных (Model)


Тип для описания способа оплаты товара



Класс списка карточек: содержит массив карточек типа card, и методы для работы с этим массивом

CardList{

 protected cardList:ICard[];// массив карточек
 protected bigCard:ICard;   // будет хранить карточку, которую кликнул пользователь 

 constructor(protected events: IEvents )  - принимает экземляр брокера событий для генерации событий изменения данных

 initList():void;           // метод заполняющий массив карточек. Метод получает данные с сервера, заполняет ими массив и передает
                            // экземпляру брокера событий events событие "cardList:updated"   
 addBigCard(card)           // метод для добавления каточки в качестве bigCard 
                            // Получает карточку, заполняет ею поле bigCard, передает брокеру событий "bigCard:changed" 
 removeBigCard(card)        // метод для удаления каточки в качестве bigCard
                            // чистит поле bigCard, передает брокеру событий "bigCard:changed" 

}
-------------------------------------------------------------------------------
 Корзина: хранит данные о товарах. 

 Basket{
    protected cardListBasket:ICard[]; // массив карточек, добавленных в корзину
    constructor(protected events: IEvents )  - принимает экземляр брокера событий для генерации событий изменения данных
   
    remove(id:string):void; // метод удаляющий товар из корзины.
    add(id:string):void; // метод добавляющий товар в корзину.
    clear():void; // метод очищает корзину.
    getCardListBasket():ICard[] - возвращает cardListBasket 
    getCardListBasketId():string[] - возвращает массив id товаров в корзине
    getTotalPrise() - возвращает общую сумму покупок
    isAddedToBasket(id: string): boolean - проверяет наличие карточки в корзине по id
    getItemsId(): string[] - возвращает массив id карточек в массиве 
    Методы add, remove, clear передают в брокер событий событие "basket::changed"  
    
} 

----------------------------------------------------------------------------

Классы для хранения данных покупателя и валидации данных в формах. Реализует интерфейс IOrderAllData

 type Method =  'online' | 'uponReceipt' |"";

interface IContact {
	phone: string;
	email: string;
}

interface IDelivery {
	deliveryAddress: string;
	paymentMethod: Method ;
}

type IOrderAllData = Partial<IContact> & Partial<IDelivery>;

interface IOrder extends IOrderAllData  {
	total: number;
	items: string[];
}

    Order 
{
     constructor(protected events: IEvents )  - принимает экземляр брокера событий для генерации событий изменения данных
    
    paymentMethod:Method; //  содержит метод оплаты
    deliveryAddress:string; // содержит адрес доставки
    email:string; // содержит e-mail    
    phone:string;  // содержит телефон
    formErrors: string[] = []; // массив ошибок форм

   
    //  метод внесения данных адреса доставки с последующей валидацией
    setDeliveryField(fieldName: keyof IOrderAllData, value: IOrderAllData[keyof IOrderAllData]):void;
    // метод внесения контактов с последующей валидацией
    setContactsField(fieldName: keyof IOrderAllData, value: IOrderAllData[keyof IOrderAllData]):void; 

    // Функции валидации полей форм
	validateDelivery():void 
    validateContacts():void 
		
	
    clearOrder() - очистка переменных модели

}

   
-------------------------------------------------------------------------------

##  Компоненты представления

Общий класс отображения модального окна. Наследует класс Component параметризованный интерфейсом IModalContent

interface IModalContent {
    content: HTMLElement;
}

  class  Modal extends Component<IModalData> { 
        protected _closeButton: HTMLButtonElement;  //переменная для хранения элемента кнопки закрытия модального окна
        protected _content: HTMLElement;        // переменная куда будет помещено внутренее содержимое модального окна
        constructor(container: HTMLElement, events: EventEmitter)  // получает элемент модального окна на странице, чтобы туда поместить содержимое
        Получает экземпляр брокера событий

        set content(value: HTMLElement)  - сеттер для установки внутреннего содержиого _content
		        
        open();  // открытие модального окна
        close(); // закрытие модального окна
        render(data:IModalContent); // перерисовка внутреннего содержимого (content) через set content(), и возвращает весь container

    }
---------------------------------------------------

Общий класс формы. Наследует класс  Component параметризованный интерфейсом IFormState


interface IFormState {
    valid: boolean;
    errors: string[];
}


 class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement; //  элемент, хронящий кнопку подтверждения формы  
	protected _errors: HTMLElement; // элемент, хранящий ошибки валидации

	constructor(protected container: HTMLFormElement, protected events: IEvents) {}
		// конструктор принимает контейнер формы и EventEmitter.


    set errors(value: string) - сеттер для внесения текста ошибки в  _errors	
    set valid(value: boolean) - сеттер для установки состояния доступности кнопки в  _submit. 


    protected onInputChange(nameOfEvent:string, field: keyof T, value: string) { }
   
    //функция для генерации события 'change' изменения input-а формы, в котором передается: nameOfEvent - название события, название 
    измененного поля и его значение. (может быть переопределено в классе наследнике).

}
------------------------------------------------------

Класс отображения карточки, наследует  Component<ICard>


class CardView extends Component<ICard>{

    // защищенные поля для хранения ссылок на элементы разметки

    protected _titleElement: HTMLElement;
    protected _priceElement: HTMLElement;
    protected _buttonElement: HTMLButtonElement;
    protected _descriptionElement: HTMLElement;
    protected _imageElement: HTMLImageElement;
    protected _categoryElement: HTMLElement;

    // конструктор принимает: общую часть css классов,  контейнер разметки для заполнения, обработчик нажатия кнопки
    constructor(protected blockName: string, container: HTMLElement,   action?: ICardActions ) 
   
    // сеттеры  для данных( в том числе  для работы render родителя)
    set id(value: string)  
    set title(value: string) 
	set description(value: string)
    set image(src: string) 
    set category(category: Category) 
	set price(value: number) 
	
    convertCategoryToColor(category: Category) - преобразует название категории товара
    в соответствующий css класс
	
}

------------------------------------------------

Класс отображения карточки  в модальном окне наследует класс CardView

 class CardModalView extends CardView {



// конструктор принимает: общую часть css классов,  контейнер разметки для заполнения, обработчик нажатия кнопки
    constructor(blockName: string, container: HTMLElement, action?: ICardActions) 

// метод для замены надписи на кнопке: "Добавить в корзину"
    toggleButtonBusket(status: boolean): void
	
// сеттер для переключения состояния кнопки через рендер родителя
   	set isAddedToBasket(value: boolean) 

   
}

---------------------------------------------------

Класс для отображения корзины в модальном окне, наследует класс Component, параметризированный интерфейсом IBasketView

interface IBasketView{
  cards: HTMLElement[];
  totalAmount: number;
}

 class BasketView extends Component<IBasketView> {

    // поля для хранения элементов разметки

	protected _listElement: HTMLElement;
	protected _totalAmountElement: HTMLElement;
	protected _buttonElement: HTMLButtonElement;


    // конструктор принимает контейнер и экземпляр EventEmitter
	constructor(container: HTMLElement, protected events: IEvents) 

    // сеттер заносит список карточек в разметку корзины
	set cards(products: HTMLElement[]) 
    // сеттер вносит в разметку общую сумму покупок
	set totalAmount(value: number) 
}

-----------------------------------------------------

Класс для отображения формы "способ оплаты"
// интерфейсы для парамитризации  родителей форм

interface IContact {

	phone: string;
	email: string;
}

interface IDelivery {

	address: string;
	payment: Method;
}

class OrderDeliveryView extends Form<IDelivery> {
    // массив с кнопками выбора оплаты на форме,
    // переменная для хранения dom элемента для ввода адреса доставки

	paymentButtons: HTMLButtonElement[];
    protected _input: HTMLInputElement;

    // конструктор принимает контейнер и экземляр  EventEmitter
	constructor(container: HTMLFormElement, events: IEvents) 

    // сброс кнопок выбора способа оплаты в неактивное состояние
    resetButtonStatus()

    // выставление активности  кнопки выбора способа оплаты
    setPayment(method: Method) 

    //сеттер для способа оплаты
    set payment(method: Method)


	// сеттер для адреса
    set address(value: string) 

    
	
}
--------------------------------------------------

Класс для отображения формы контактов, наследует класс Form параметризованный IContact 


 class OrderContactView extends Form<IContact> {
// поля для хранения dom элементов полей ввода формы
        _phoneInput: HTMLInputElement;
	    _emailInput: HTMLInputElement;


// конструктор принимает контейнер и  экземпляр EventEmitter
	constructor(container: HTMLFormElement, events: IEvents) 
		
	
    сеттеры для обновления  данных в шаблоне
    set phone(value: string) 
    set email(value: string) 	
	
}

-------------------------------------------------------
Класс для отображения модального окна удачной покупки  наследует класс Component параметризованный IOrderResult


interface IOrderResult {
	total: number;
}

class SuccessView extends Component<IOrderResult> {

     // поля для хранения элементов разметки
	closeButton: HTMLButtonElement;
	descriptionElement: HTMLElement;


    // конструктор принимает контейнер и  экземпляр EventEmitter
    constructor(container: HTMLElement, events: IEvents) 

   // сеттер для общей суммы
	set total(value: number) 
	
}

-----------------------------------------------------------

Класс для отображения всей страницы в целом

interface IPage{
  catalog: HTMLElement[];
  basketCounter: number;
 
}

class PageView extends Component<IPage> {

    //поля для хранения элементов разметки
	protected _basketCounterElement: HTMLElement;  // счетчик на корзине
	protected _basketButtonElement: HTMLButtonElement; // кнопка корзины 
	protected _catalogElement: HTMLElement; // контейнер для каталога 
    protected _wrapper: HTMLElement; // контейнер всей страницы для блокировки
	
 // конструктор принимает контейнер и  экземпляр EventEmitter
	constructor(contaiter: HTMLElement, protected events: IEvents)


    // сеттеры для внесения данных в разметку
	set catalog(cards: HTMLElement[])
	set basketNumber(value: number) 
    set locked(value: boolean)  // установка состояния блокировки основного экрана
	
}

------------------------------------------------------------------------------
## Слой presenter 
выделять в отдельный класс не планируется, состыковка модели и предтавления будет
происходить в основном файле index.ts


-------------------------------------------------------------------------------
## Описание событий 
События будут обрабатываться через брокер событий.

События генерируемые из представления:

1. Нажатие на одну из карточек (view карточки генерирует событие "card:select") и передает его в презентер -> Обработчик события в презентере запускает метод генерирующий представление данной карточки через    конструктор CardModalView и выводит его на экран. 

2. Нажатие на купить в карточке товара:                                 card:add
3. Нажатие на "убрать из корзины" в карточке товара или в корзине:      card:remove
4. Нажатие по корзине :                                                 basket:open
5. Закрытие корзины и любого модального окна:                           modal:close 
6. Нажатие на оформить в корзине                                        order:open
7. Событие изменения данных в модальном окне доставки                   order.delivery:change
8. Событие нажатия кнопки далее в модальном окне доставки               order.delivery:next 
9. Событие изменения данных в модальном окне контактов                  order.contact:change
10: Событие нажатия кнопки оплатить в модальном окне доставки           order.contact:next
11. Событие нажатия кнопки "за новыми покупками"                        success:close

События генерируемые моделью
12. Событие изменения списка карточек                                   cardList:updated
13. Событие изменения состава корзины                                   basket:changed    
14. Событие генерируемое моделью после валидации формы delivery         formErrors:change:delivery
15. Событие генерируемое моделью после валидации формы contact          formErrors:change:contacts 
-------------------------------------------------------------------------------
