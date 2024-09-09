import { ICard, IOrder, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";



export class CardApi extends Api{


    readonly cdn: string;
    protected options: RequestInit;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product/').then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
           
        );
    }

    postOrder(order:IOrder):Promise<IOrderResult>{
        return this.post('/order/',order).then((data:IOrderResult)=>data);
    }

}