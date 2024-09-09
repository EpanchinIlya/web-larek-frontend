import { IOrderResult } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccessAction {
	onClick: () => void;
}

export class SuccessView extends Component<IOrderResult> {
	protected _closeButton: HTMLButtonElement;
	protected _descriptionElement: HTMLElement;

	constructor(container: HTMLElement, action: ISuccessAction) {
		super(container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (action?.onClick) {
			this._closeButton.addEventListener('click', action.onClick);
		}
	}
	set total(value: number) {
		this.setText(this._descriptionElement, `Списано ${value} синапсов`);
	}
}
