import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";



interface IBasketView{
    cards: HTMLElement[];
    total: number;
  }


export class BasketView extends Component<IBasketView>{

       protected _listElement: HTMLElement;
       protected _totalElement: HTMLElement;
       protected _buttonElement: HTMLButtonElement;



       constructor(container: HTMLElement, protected events: EventEmitter) {
          super(container);
          this._listElement = ensureElement<HTMLElement>('.basket__list', this.container);
          this._totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
          this._buttonElement = ensureElement<HTMLButtonElement>('.basket__button',this.container);
  
          this._buttonElement.addEventListener('click', () => {
              events.emit('order:open');
          });
          this.cards = [];
      }


      set cards(cardListBasket: HTMLElement[]) {
                  if (cardListBasket.length) {
                    cardListBasket.forEach((cardBasket, index) => {
                          const cardIndex = cardBasket.querySelector('.basket__item-index') as HTMLElement;
                          if (cardIndex) {
                             this.setText(cardIndex, (index + 1).toString());
                          }
                      });
                      this._listElement.replaceChildren(...cardListBasket);
                      this.setVisible(this._totalElement);
                      this.setDisabled(this._buttonElement, false);
                  } else {
                      this._listElement.replaceChildren(
                          createElement<HTMLParagraphElement>('p', {
                              textContent: 'Корзина пуста',
                          })
                      );
                      this.setHidden(this._totalElement);
                      this.setDisabled(this._buttonElement, true);
                  }
              }

      set total(value: number) {
                           this.setText(this._totalElement, `${value} синапсов`);
                       }
}
