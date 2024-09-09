





// class CardView extends Component<ICard>{

import { Category, ICard } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";



interface ICardActions {
    onClick: () => void;
}

export class CardView extends Component<ICard>{

    protected _titleElement: HTMLElement;
    protected _priceElement: HTMLElement;
    protected _buttonElement: HTMLButtonElement;
    protected _descriptionElement: HTMLElement;
    protected _imageElement: HTMLImageElement;
    protected _categoryElement: HTMLElement;


    constructor(protected blockName: string, container: HTMLElement,  action?: ICardActions) {
        super(container);


        this._titleElement = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._priceElement = ensureElement<HTMLElement>( `.${blockName}__price`, container);


        this._descriptionElement = container.querySelector(`.${blockName}__text`);
        this._imageElement = container.querySelector(`.${blockName}__image`);
        this._categoryElement = container.querySelector(`.${blockName}__category`);
        this._buttonElement = container.querySelector(`.${blockName}__button`);


        if (action?.onClick) {
                    if (this._buttonElement) {
                         this._buttonElement.addEventListener('click', action.onClick);
                     } else {
                         this.container.addEventListener('click', action.onClick);
                     }
                 }
           }

       
         set title(value: string) {
             this.setText(this._titleElement, value);
         }

         get title(): string {
             return this._titleElement.textContent;
         }

         set price(value: number) {
             if (value>0) {
                 this.setText(this._priceElement, `${value} синапсов`);
             } else {
                 this.setText(this._priceElement, 'Бесценно');
                this.setDisabled(this._buttonElement, true);
             }
         }

         set image(src: string) {
             this.setImage(this._imageElement, src, this.title);
         }

         set description(value: string) {
            this.setText(this._descriptionElement, value);
        }

        set category(category: Category) {
            this.toggleClass(this._categoryElement, this.convertCategoryToColor(category));
            this.setText(this._categoryElement, category);
        }

         convertCategoryToColor(category: Category): string {
     
             switch (category) {
                case 'софт-скил':
                     return 'card__category_soft';
                case 'хард-скил':
                     return 'card__category_hard';
                case 'дополнительное':
                    return 'card__category_additional';
                case 'другое':
                    return 'card__category_other';
                case 'кнопка':
                    return 'card__category_button';
                default:
                    return 'card__category_other';
            }
        }           
}



export class CardModalView extends CardView {
	private _isAddedToBasket: boolean;

    constructor(blockName: string, container: HTMLElement, action?: ICardActions) {
		super(blockName, container, action);

		if (this._buttonElement) {
			this._buttonElement.addEventListener('click', () => {
				this._isAddedToBasket = !this._isAddedToBasket;
			});
		}
	}

    toggleButtonStatus(status: boolean): void {
		if (status) {
			this.setText(this._buttonElement, 'Убрать из корзины');
		} else {
			this.setText(this._buttonElement, 'В корзину');
		}
	}

    get isAddedToBasket(): boolean {
		return this._isAddedToBasket;
	}

    set isAddedToBasket(value: boolean) {
		this.toggleButtonStatus(value);
		this._isAddedToBasket = value;
	}

    
}







