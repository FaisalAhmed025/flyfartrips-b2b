

export interface IBkashConstructor {
	baseURL: string;
	key: string;
	secret: string;
	username: string;
	password: string;
}

export interface IRefundArgs extends Record<string, string> {
	paymentID: string;
	amount: string;
	trxID: string;
	sku: string;
}
