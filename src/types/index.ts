export type Method =  'online' | 'uponReceipt' |"";
export type Category = 'софт-скил'| 'хард-скил'	| 'другое'	| 'дополнительное'	| 'кнопка';



export interface ICard {

    id: string;
    title: string;
    description: string;
    image: string;
    category: Category;
    price: number;
    isAddedToBasket: boolean;
}


export interface ICardList{

 bigCard:ICard;   
 cardList:ICard[];
 initList():void; 
 addBigCard(card:ICard):void;
 removeBigCard(card:ICard):void;


}

export interface IBasket
{
    cardListBasket:ICard[];
    remove(id:string):void;  
    add(id:string):void;
    clear():void; 
    getCardListBasket():ICard[]
    getTotalPrise():number; 

}


export interface IContact {
	phone: string;
	email: string;
}

export interface IDelivery {
	address: string;
	payment: Method ;
}

export type IOrderAllData = Partial<IContact> & Partial<IDelivery>;



export interface IOrder extends IOrderAllData  {
	total: number;
	items: string[];
}


export interface IOrderResult {
	
	total: number;
}


