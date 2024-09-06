import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface IPage{
    catalog: HTMLElement[];
    basketCounter: number;
    // pageLock: boolean;
  }
  




 export class PageView extends Component<IPage> {
	protected _basketCounterElement: HTMLElement;
	protected _basketButtonElement: HTMLButtonElement;
	protected _catalogElement: HTMLElement;
	//protected _pageWrapperElement: HTMLElement;



	constructor(contaiter: HTMLElement, protected events: EventEmitter) {

		super(contaiter);
		this._basketCounterElement = ensureElement<HTMLElement>('.header__basket-counter',this.container);
		this._basketButtonElement = ensureElement<HTMLButtonElement>('.header__basket',this.container);
		this._catalogElement = ensureElement<HTMLElement>('.gallery',this.container);
		// this._pageWrapperElement = ensureElement<HTMLElement>('.page__wrapper',this.container);
		this._basketButtonElement.addEventListener('click', () => {	this.events.emit('basket:open');});

		this.basketCounter = 0;
	}



	set catalog(products: HTMLElement[]) {
		this._catalogElement.replaceChildren(...products);
	}



	set basketCounter(value: number) {
		this.setText(this._basketCounterElement, value);
	}


	get basketCounter() {
		return parseInt(this._basketCounterElement.textContent);
		//this.setText(this._basketCounterElement, value);
		
	}






	// set pageLock(value: boolean) {
	// 	if (value) {
	// 		this.toggleClass(this.pageWrapperElement, 'page__wrapper_locked', true);
			
	// 	} else {
	// 		this.toggleClass(this.pageWrapperElement, 'page__wrapper_locked', false);
	// 	}
	// }




}