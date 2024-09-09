import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface IPage{
    catalog: HTMLElement[];
    basketCounter: number;
 
  }
  




 export class PageView extends Component<IPage> {
	protected _basketCounterElement: HTMLElement;
	protected _basketButtonElement: HTMLButtonElement;
	protected _catalogElement: HTMLElement;
	



	constructor(contaiter: HTMLElement, protected events: EventEmitter) {

		super(contaiter);
		this._basketCounterElement = ensureElement<HTMLElement>('.header__basket-counter',this.container);
		this._basketButtonElement = ensureElement<HTMLButtonElement>('.header__basket',this.container);
		this._catalogElement = ensureElement<HTMLElement>('.gallery',this.container);
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
	
		
	}
}