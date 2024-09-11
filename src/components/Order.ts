import { IContact, IDelivery, Method } from '../types';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { Form } from './Form';

interface IForm {
	formValid: boolean;
	formErrors: string[];
}

export class OrderDeliveryView extends Form<IDelivery> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _input: HTMLInputElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(container, events);

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

	setPayment(method: Method) {
		this.resetButtonStatus();
		if (method === 'online')
			this.toggleClass(this._paymentButtons[0], 'button_alt-active', true);
		if (method === 'uponReceipt')
			this.toggleClass(this._paymentButtons[1], 'button_alt-active', true);
	}

	set payment(method: Method) {
		this.setPayment(method);
	}

	set address(value: string) {
		this._input.value = value;
	}
}

export class OrderContactView extends Form<IContact> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(container, events);

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
}
