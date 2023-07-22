export type Intent = 'sale' | 'authorization';
export interface ICreatePayment {
   mode:string;
   payerReference:string;
   callbackURL:string;
	amount: number;
   currency:string;
	orderID: string;
	intent: Intent;
	merchantAssociationInfo?: string;
}
