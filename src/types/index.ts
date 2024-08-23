export type method =  'online' | 'uponReceipt';



export interface ICard {

    id: string;
    description: string;
    image:string;
    title:string;
    category:string;    
    price:number;
}


export interface ICardList{

 bigCard:ICard;   
 cardList:ICard[];
 initList():void;    

}



export interface IBuyer 
{
    paymentMethod:method;
    deliveryAddress:string;
    email:string;
    telephone:string;
}


export interface IBasket{

    items:Map<string,number>;
    remove(id:string):void;

}

