
// // import { IHeaders } from './entities/headers.interface';
// import { NagadException } from './NagadException';
// const node_fetch_1 = require("node-fetch");
// interface IPayload {
// 	[key: string]: unknown;
// }

// export async function get<T>(url: string, additionalHeaders: IHeaders): Promise<any> {
// 	const r = await node_fetch_1.default(url, {
// 		method: 'GET',
// 		headers: {
// 			'content-type': 'application/json',
// 			Accept: 'application/json',
// 			...additionalHeaders,
// 		},
// 	});

// 	const data = await r.json();
// 	return data;
// }

// export async function post<T>(url: string, payload: IPayload = {}, additionalHeaders: IHeaders): Promise<any> {
// 	const r = await await node_fetch_1.defaul(url, {
// 		headers: {
// 			'content-type': 'application/json',
// 			Accept: 'application/json',
// 			...additionalHeaders,
// 		},
// 		body: JSON.stringify(payload),
// 		method: 'POST',
// 	});

// 	const data = await r.json();

// 	// if (data.devMessage) {
// 	// 	throw new NagadException(data.devMessage, data.reason);
// 	// }

// 	// if (data.reason) {
// 	// 	throw new NagadException(data.message, data.reason);
// 	// }

//  return data;
// }
