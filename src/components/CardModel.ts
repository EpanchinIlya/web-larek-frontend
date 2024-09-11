import { ICard, ICardList } from '../types';
import { EventEmitter } from './base/events';

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
