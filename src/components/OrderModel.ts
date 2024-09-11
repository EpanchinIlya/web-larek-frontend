import { IOrder, IOrderAllData, Method } from "../types";
import { IEvents } from "./base/events";

export class Order implements IOrderAllData {
	
	phone?: string;
	email?: string;
	address?: string;
	payment?: Method;
	formErrors: string[] = [];

	constructor(events: IEvents) {}

	setValidateField(
		field: keyof IOrderAllData,
		value: IOrderAllData[keyof IOrderAllData]
	) {
		if (field === 'payment') this.payment = value as Method;
		if (field === 'address') this.address = value;
		if (field === 'email') this.email = value;
		if (field === 'phone') this.phone = value;
	}

	validateDelivery(): boolean {
		this.formErrors = [];
		if (!this.payment) {
			this.formErrors.push('Необходимо выбрать способ оплаты.');
		}

		if (this.address === undefined || this.address.length === 0) {
			this.formErrors.push('Необходимо указать адрес доставки.');
		}

		if (this.formErrors.length > 0) {
			return false;
		} else {
			return true;
		}
	}

	validateContact(): boolean {
		this.formErrors = [];
		if (!this.email) {
			this.formErrors.push('Необходимо указать адрес электронной почты.');
		}

		if (!this.phone) {
			this.formErrors.push('Необходимо указать номер телефона.');
		}

		if (this.formErrors.length > 0) return false;
		else return true;
	}

	clearOrder(){

		
		this.phone = '';
		this.email = '';
		this.address = '';
		this.payment = '';
		this.formErrors  = [];


	}



}
