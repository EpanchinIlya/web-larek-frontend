import { IContact, IDelivery, Method } from '../types';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';

interface IForm {
	formValid: boolean;
	formErrors: string[];
}

export class OrderDeliveryView extends Component<
	Partial<IForm> & Partial<IDelivery>
> {
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _paymentButtons: HTMLButtonElement[];
	protected _input: HTMLInputElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(container);

		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this._paymentButtons = ensureAllElements(
			'.order__buttons button',
			container
		);
		this._input = container.elements.namedItem('address') as HTMLInputElement;

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit('order.delivery:next');
		});

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', (event) => {
				this.resetButtonStatus();
				this.toggleClass(button, 'button_alt-active', true);
				const paymentMethod = (event.target as HTMLButtonElement).name;

				this.events.emit('order.delivery:change', {
					field: 'payment',
					value: paymentMethod,
				});
			});
		});

		this._input.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit('order.delivery:change', {
				field,
				value,
			});
		});
	}

	resetButtonStatus() {
		if (this._paymentButtons) {
			this._paymentButtons.forEach((button) => {
				this.toggleClass(button, 'button_alt-active', false);
			});
		}
	}

	set address(value: string) {
		this._input.value = value;
	}

	set formValid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}

	set formErrors(value: string) {
		this.setText(this._errors, value);
	}


}

export class OrderContactView extends Component<
	Partial<IForm> & Partial<IContact>
> {
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(container);

		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this._emailInput = container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this._phoneInput = container.elements.namedItem(
			'phone'
		) as HTMLInputElement;

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit('order.contact:next');
		});

		this._emailInput.addEventListener('input', (e: Event) => {
			this.inputEvent(e);
		});

		this._phoneInput.addEventListener('input', (e: Event) => {
			this.inputEvent(e);
		});
	}

	inputEvent(e: Event) {
		const target = e.target as HTMLInputElement;
		const field = target.name;
		const value = target.value;
		this.events.emit('order.contact:change', {
			field,
			value,
		});
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	set formValid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}

	set formErrors(value: string) {
		this.setText(this._errors, value);
	}
}
