

import { IBasket, ICard, ICardList } from "../types";
import { EventEmitter, IEvents } from "./base/events";


   export class CardList implements ICardList  {
	
    bigCard:ICard;
    cardList: ICard[] = [];
    protected events: EventEmitter;
   

    constructor(events: EventEmitter) {
       this.events = events;
    }


    initList(list:ICard[]){
        this.cardList = list.map((item) => ({
			...item,
			isAddedToBasket: false
		}));
		this.events.emit('cardList:updated', this.cardList );

    }

    addBigCard(card:ICard){
            this.bigCard = card;
            this.events.emit('cardList:addBigCard', card);

    }

    removeBigCard(){
        this.bigCard = undefined;
    }
        
}



export class Basket implements IBasket {

    cardListBasket:ICard[]=[];
    constructor(protected events: EventEmitter ){;}       
    

    remove(id:string){

       
       this.cardListBasket = this.cardListBasket.filter((card) => {
         			return card.id !== id;
         		});

        this.events.emit('basket:changed', this.cardListBasket);
    } 
    
    
    add(card:ICard){
      
        const cardIndex = this.cardListBasket.findIndex((x) => x.id === card.id);
         		if (cardIndex === -1) {
         			this.cardListBasket.push(card);
                     this.events.emit('basket:changed', this.cardListBasket);
         		}   
    }

    clear(){
        this.cardListBasket = [];
    }

    getCardListBasket(){
        return this.cardListBasket;
    }

    getTotalPrise(){
        
        return this.cardListBasket.reduce((total, card) => {
             			return total + card.price;
             		}, 0);

    }
    
}






