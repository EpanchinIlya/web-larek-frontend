import { IBasket, ICard } from '../types';
import { EventEmitter } from './base/events';

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

	

	isAddedToBasket(id: string): boolean {
		const fil = this.cardListBasket.filter((card) => {
			return card.id === id;
		});

		return (fil.length>0);
		
	}

	getItemsId(): string[] {
		return this.cardListBasket.map((item) => {
			return item.id;
		});
	}
}
