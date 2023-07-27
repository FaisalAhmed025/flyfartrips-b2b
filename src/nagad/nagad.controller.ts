
// import { async, retry } from 'rxjs';
// import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, HttpException, HttpStatus, Res } from '@nestjs/common';
// import { NagadService } from './nagad.service';
// import { CreateNagadDto } from './dto/create-nagad.dto';
// import { UpdateNagadDto } from './dto/update-nagad.dto';
// import * as crypto from 'crypto';
// import { HttpService } from '@nestjs/axios/dist/http.service';

// import axios from 'axios';
// import { Request, Response } from 'express';
// import { createHash } from 'crypto';

// import * as fs from 'fs';
// import dayjs from 'dayjs';
// import timezone from 'dayjs/plugin/timezone';
// import utc from 'dayjs/plugin/utc';
// import { IHeaders } from './entities/headers.interface';
// import { log } from 'console';
// import { INagadCreatePaymentResponse } from './entities/nagadResponse.interface';
// // import { IClientType, IHeaders } from './entities/headers.interface';
// // import { IConfirmPaymentArgs, ICreatePaymentArgs, INagadConstructor, INagadCreatePaymentBody, INagadSensitiveData } from './entities/main.interface';
// // import { INagadCreatePaymentDecryptedResponse, INagadCreatePaymentResponse, INagadPaymentURL, INagadPaymentVerificationResponse } from './entities/nagadResponse.interface';
// // import { post } from './request';
// var base64 = require('base-64');

// export type IClientType = 'PC_WEB' | 'MOBILE_WEB' | 'MOBILE_APP' | 'WALLET_WEB_VIEW' | 'BILL_KEY';



// @Controller('nagad')
// export class NagadController {
//   ip: string;
// 	private readonly baseURL: 'http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0';
//   private  merchantNumber:"01400001104"
//   private  privKey: 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
//   private  pubKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjBH1pFNSSRKPuMcNxmU5jZ1x8K9LPFM4XSu11m7uCfLUSE4SEjL30w3ockFvwAcuJffCUwtSpbjr34cSTD7EFG1Jqk9Gg0fQCKvPaU54jjMJoP2toR9fGmQV7y9fz31UVxSk97AqWZZLJBT2lmv76AgpVV0k0xtb/0VIv8pd/j6TIz9SFfsTQOugHkhyRzzhvZisiKzOAAWNX8RMpG+iqQi4p9W9VrmmiCfFDmLFnMrwhncnMsvlXB8QSJCq2irrx3HG0SJJCbS5+atz+E1iqO8QaPJ05snxv82Mf4NlZ4gZK0Pq/VvJ20lSkR+0nk+s/v3BgIyle78wjZP1vWLU4wIDAQAB'
// 	private headers:{
//   'X-KM-Api-Version':'v-0.2.0';
// 	'X-KM-Client-Type'?: IClientType;
// 	'X-KM-IP-V4'?: string;
//   }



//   constructor(
//     private readonly  nagadService:NagadService,
//     private readonly HttpService:HttpService
     
//      ) {
//     //   const { baseURL, callbackURL, merchantID, merchantNumber, privKey, pubKey, apiVersion, isPath } = config;
//     //   this.baseURL = baseURL;
//     //   this.merchantID = merchantID;
//     //   this.merchantNumber = merchantNumber;
//     //   this.headers = {
//     //     'X-KM-Api-Version': apiVersion,
//     //   };
//     //   this.callbackURL = callbackURL;
//     //   // const { privateKey, publicKey } = this.genKeys(privKey, pubKey, isPath);
//     //   // this.privKey = privateKey;
//     //   // this.pubKey = publicKey;
  
//     //   dayjs.extend(utc);
//     //   dayjs.extend(timezone);
//     // }
//   }

//   // @Get('make-payment')
//   // async makePayment(@Res() res) {
//   //   try {
//   //     const paymentData = {
//   //       amount: '100',
//   //       ip: ' 192.168.1.108',
//   //       orderId: `${Date.now()}`,
//   //       productDetails: { a: '1', b: '2' },
//   //       clientType: 'PC_WEB',
//   //     };

//   //     const nagadURL = await this.nagadService.createPayment(paymentData);
//   //     console.log(nagadURL);
      
//   //     // Redirect the user to the Nagad URL
//   //     return res.redirect(nagadURL);
//   //   } catch (err) {
//   //     // Handle any errors and send an error response to the user
//   //     console.log(err);
//   //     return res.status(500).json({ error: 'Something went wrong' });
//   //   }
//   // }

//   generateCustomTransactionId(): string {
//     const timestamp = Date.now().toString();
//     const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
//     const hash = createHash('sha256').update(`${timestamp}${randomString}`).digest('hex');
//     const shortenedHash = hash.substr(0, 16).toUpperCase();
//     return shortenedHash;
//   }

//   @Post('createPayment')
//   async createPayment(@Req() req: Request, @Res() res:Response) {
   
//       // Step 2: Extract required properties from createPaymentConfig
//       const orderId =this.generateCustomTransactionId()
//       const merchantID= '683002007104225'
//       const merchantNumber ='01400001104'

//       const endpoint = `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/${merchantID}/${orderId}`;
//       const timestamp = `${Date.now()}`
  
//       // Step 4: Prepare the sensitive data object and payload
      
//       const sensitive= {
//         merchantId: merchantID,
//         datetime: timestamp,
//         orderId:orderId,
//         challenge: this.createHash(orderId),
//       };
      
//       const requestbody={
//         accountNumber:merchantNumber,
//         dateTime: timestamp,
//         sensitiveData: this.encrypt(sensitive),
//         signature: this.sign(sensitive),
//       };
 
    
  
//       // Step 5: Modify the IP if it's localhost
//       // const newIP = ip === '::1' || ip === '127.0.0.1' ? '103.100.200.100' : ip;

//       // Step 6: Make a POST request to the endpoint

//       const customHeaders = {
//         'X-KM-Api-Version': 'v-0.2.0',
//         'X-KM-Client-Type': 'PC_WEB',
//         'X-KM-IP-V4': '192.168.1.108', // Replace 'your_ip_here' with the actual IP if available, or remove this line if not needed.
//       };

//       console.log(customHeaders)
      
  
//        const response = await this.HttpService.post(endpoint, requestbody, { headers: customHeaders })
//        console.log(response);
       
//        const decryptedData = await this.decrypt(JSON.stringify(response));
//        const decryptedResponse = JSON.parse(decryptedData);
//        console.log(decryptedResponse);

//        const { paymentReferenceId, challenge } = decryptedResponse;
        
//         const confirmArgs = {
//           paymentReferenceId, // Assuming you have the paymentReferenceId from previous steps
//           challenge, // Assuming you have the challenge from previous steps
//           orderId:"ccdcdhniocd",
//           amount:"100",
//           productDetails:"hncchbiic",
//           ip: '192.168.1.108'
//         };
//         const callback = await axios.post('https://localhost:5000/nagad/payment/confirmPayment', confirmArgs, {
       
//         });
//         return callback;
    
       
    


      
   
//   }


// 	// // async verifyPayment(paymentRefID: string): Promise<INagadPaymentVerificationResponse> {
// 	// // 	return await get<INagadPaymentVerificationResponse>(
// 	// // 		`${this.baseURL}/api/dfs/verify/payment/${paymentRefID}`,
// 	// // 		this.headers
// 	// // 	);
// 	// // }
//   @Post('payment/confirmPayment')
//   async confirmPayment(@Req() req: Request) {
//     const data = req.body;
//     const { amount, challenge, orderId, paymentReferenceId, productDetails } = data;
//     console.log(data);
    
//     const merchantID= '683002007104225'
//     const merchantNumber ='01400001104'
//     const sensitiveData = {
//       merchantId: merchantID,
//       orderId,
//       amount,
//       currencyCode: '050',
//       challenge,
//     };

//     const payload = {
//       paymentRefId: paymentReferenceId,
//       sensitiveData: this.encrypt(sensitiveData),
//       signature: this.sign(sensitiveData),
//       merchantCallbackURL:'https://flyfarladies.com/',
//       additionalMerchantInfo: {
//         ...productDetails,
//       },
//     };

    
//     const customHeaders = {
//       'X-KM-Api-Version': 'v-0.2.0',
//       'X-KM-Client-Type': 'PC_WEB',
//       'X-KM-IP-V4': '192.168.1.108', // Replace 'your_ip_here' with the actual IP if available, or remove this line if not needed.
//     };
//     const endpoint = `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/complete/${paymentReferenceId}`
//    const paymentURL = await this.HttpService.post(endpoint, payload, {headers:customHeaders})
//    return paymentURL;
    
//   }

// 	private encrypt<T>(data: T): string {
//     const pgPublicKey =
//     'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiCWvxDZZesS1g1lQfilVt8l3X5aMbXg5WOCYdG7q5C+Qevw0upm3tyYiKIwzXbqexnPNTHwRU7Ul7t8jP6nNVS/jLm35WFy6G9qRyXqMc1dHlwjpYwRNovLc12iTn1C5lCqIfiT+B/O/py1eIwNXgqQf39GDMJ3SesonowWioMJNXm3o80wscLMwjeezYGsyHcrnyYI2LnwfIMTSVN4T92Yy77SmE8xPydcdkgUaFxhK16qCGXMV3mF/VFx67LpZm8Sw3v135hxYX8wG1tCBKlL4psJF4+9vSy4W+8R5ieeqhrvRH+2MKLiKbDnewzKonFLbn2aKNrJefXYY7klaawIDAQAB';
//   const public_key = `-----BEGIN PUBLIC KEY-----\n${pgPublicKey}\n-----END PUBLIC KEY-----`;
// 		const signerObject = crypto.publicEncrypt(
// 			{ key:public_key, padding: crypto.constants.RSA_PKCS1_PADDING },
// 			Buffer.from(JSON.stringify(data))
// 		);
// 		return signerObject.toString('base64');
// 	}

// 	async decrypt(data:string) {
//     const pgprivateKey ='MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
//     const mar_pri_key =`-----BEGIN PRIVATE KEY-----\n${pgprivateKey}\n-----END PRIVATE KEY-----`;
//     const decrypted = crypto. privateDecrypt({ key: mar_pri_key, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(JSON.stringify(data) ,'base64'));
//     return decrypted.toString("utf8");
// 	}

// 	private sign(data: string | Record<string, string>) {
//     const pgprivateKey =' MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
//     const mar_pri_key =`-----BEGIN PRIVATE KEY-----\n${pgprivateKey}\n-----END PRIVATE KEY-----`;
// 		const signerObject = crypto.createSign('SHA256');
// 		signerObject.update(JSON.stringify(data));
// 		signerObject.end();
// 		return signerObject.sign(mar_pri_key, 'base64');
// 	}

// 	private getTimeStamp() {
// 		const timestamp = dayjs().tz('Asia/Dhaka').format('YYYYMMDDHHmmss');

// 		return timestamp;
// 	}

// 	private createHash(string: string): string {
// 		return crypto.createHash('sha1').update(string).digest('hex').toUpperCase();
// 	}

// 	private genKeys(privKeyPath: string, pubKeyPath: string, isPath: boolean): { publicKey: string; privateKey: string } {
// 		if (!isPath) {
// 			return {
// 				privateKey: this.formatKey(privKeyPath, 'PRIVATE'),
// 				publicKey: this.formatKey(pubKeyPath, 'PUBLIC'),
// 			};
// 		}

// 		const fsPrivKey = fs.readFileSync(privKeyPath, { encoding: 'utf-8' });
// 		const fsPubKey = fs.readFileSync(pubKeyPath, { encoding: 'utf-8' });
// 		return { publicKey: this.formatKey(fsPubKey, 'PUBLIC'), privateKey: this.formatKey(fsPrivKey, 'PRIVATE') };
// 	}

// 	private formatKey(key: string, type: 'PUBLIC' | 'PRIVATE') {
// 		return /begin/i.test(key) ? key.trim() : `-----BEGIN ${type} KEY-----\n${key.trim()}\n-----END ${type} KEY-----`;
// 	}


// }

  

















