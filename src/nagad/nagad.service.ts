import { Injectable } from '@nestjs/common';
import NagadGateway from 'nagad-payment-gateway';

@Injectable()
export class NagadService {
  
  private nagadGateway: any;
  constructor() {
    const config = {
      apiVersion: 'v-0.2.0',
      baseURL: process.env.BASE_URL,
      callbackURL: process.env.CALLBACK_URL,
      merchantID: process.env.NAGAD_MERCHANT_ID,
      merchantNumber: process.env.NAGAD_MERCHANT_NUMBER,
      privKey:process.env.NAGAD_MERCHANT_PRIVATE_KEY,
      pubKey: process.env.NAGAD_MERCHANT_PUBLIC_KEY,
      isPath: false,
    };
    this.nagadGateway = new NagadGateway(config);
    console.log(this.nagadGateway);
    
  }

  
  async createPayment() {

    try {
      const callBackUrl = await this.nagadGateway.createPayment({amount: '100',
      ip: '10.10.0.10',
      orderId: `${Date.now()}`,
      productDetails: { a: '1', b: '2' },
      clientType: 'PC_WEB',});
      return callBackUrl;
    } catch (error) {
      throw new Error('Failed to create payment');
    }

  }


  async makePaymentRequest() {
    try {
      const callBackUrl = await this.createPayment();
      // Perform any additional logic or processing with the callBackUrl
      return callBackUrl;
    } catch (error) {
      throw new Error('Failed to make payment request');
    }
  }


}
