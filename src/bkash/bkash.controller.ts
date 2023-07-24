import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res,  } from '@nestjs/common';
import { BkashService } from './bkash.service';
import { CreateBkashDto } from './dto/create-bkash.dto';
import { UpdateBkashDto } from './dto/update-bkash.dto';
import { BkashException } from './bkashException';
import { IBkashCreatePaymentResponse, IBkashExecutePaymentResponse, IBkashTokenResponse } from './entities/bkashresponse.interface';
import { ICreatePayment } from './entities/createPayment.interface';
import { log } from 'console';
import { Request, Response } from 'express';
import { createHash } from 'crypto';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { diffSeconds } from './diffSeconds';
import { HttpService } from '@nestjs/axios';


@Controller('bkash')
export class BkashController {
  private readonly baseURL = 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized';
  private readonly app_key = 'gswy5A2C7tHMZCOdoJWEIA5Ntc';
  private readonly app_secret = 'WSRHWksUVGTiZHDefwmznOWIr9TNGu7VfkkHWV7NCMfvbRClWO5g';
  private token: string;
  private refreshToken: string;
  private tokenIssueTime: number = 0;
  private readonly headers = {
    username: '01325087966',
    password: '+RMPR@ug#4[',
    'Content-Type':"application/json",
    accept: 'application/json'
  };
  constructor(
    private readonly bkashService: BkashService,
    private readonly httpService: HttpService,
    ) {}
  
  generateCustomTransactionId(): string {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
    const hash = createHash('sha256').update(`TX${timestamp}${randomString}`).digest('hex');
    const shortenedHash = hash.substr(0, 16).toUpperCase();
    return shortenedHash;
  }

  generateCustomorderId(): string {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
    const hash = createHash('sha256').update(`OI${timestamp}${randomString}`).digest('hex');
    const shortenedHash = hash.substr(0, 12).toUpperCase();
    return shortenedHash;
  }

  @Get('token')
  async getInitialToken(): Promise<any> {
    try {
      const requestConfig: AxiosRequestConfig = {
        method: 'POST',
        url: `${this.baseURL}/checkout/token/grant`,
        data: {
          app_key: this.app_key,
          app_secret: this.app_secret,
        },
        headers: this.headers,
      };
  
      // Make the POST request using 'axios'
      const response: AxiosResponse<IBkashTokenResponse> = await axios(requestConfig);
  
      // Check if the response indicates failure
      if (response.data.status === 'fail') {
        // Throw a custom exception indicating that invalid API credentials were provided
        throw new BkashException('Invalid API Credentials Provided');
      }
      // If everything is successful, return the response containing the token
      return response.data.id_token
    } catch (error) {
      // Handle any other potential errors here
      // For example, if the API call itself fails or other unexpected errors occur
      // You can throw a custom exception for other specific errors if needed
      throw new BkashException('An error occurred while fetching the token');
    }
  }


  // async newToken(refresh: string): Promise<any> {
  //   const requestconfig: AxiosRequestConfig ={
  //     method: 'POST',
  //     url:`${this.baseURL}/checkout/token/refresh`,
  //     data:{
  //       app_key: this.key,
  //       app_secret: this.secret,
  //       refresh_token: refresh,
  //     },
  //     headers:this.headers
  //   };
  //   try {
  //     const response: AxiosResponse<IBkashTokenResponse> = await axios(requestconfig)
  //     return response.data.id_token
  //   } catch (error) {
      
  //   }
  // }

  // async getToken(): Promise<string> {
  //   if (!this.token) {
  //     const { id_token, refresh_token, msg, status } = await this.getInitialToken();

  //     // Throw an error if bkash sends status [only happens when the request fails]
  //     if (status && msg) throw new BkashException(msg);
  //     this.token = id_token;
  //     this.refreshToken = refresh_token;
  //     this.tokenIssueTime = Date.now();
  //     return this.token;
  //   }
  //   const diff = diffSeconds(this.tokenIssueTime);

  //   if (diff < 3500) {
  //     return this.token;
  //   }

  //   // The token is expired, refresh it
  //   const { id_token, refresh_token, msg, status } = await this.newToken(this.refreshToken);

  //   // Throw an error if bkash sends status [only happens when the request fails]
  //   if (status && msg) throw new BkashException(msg);
  //   this.token = id_token;
  //   this.refreshToken = refresh_token;
  //   this.tokenIssueTime = Date.now();
  //   return this.token;
  // }

  
  // async createTokenHeader(){
  //   const token = await this.getToken();
  //   const header = {
  //     authorization: token,
  //     accept:'*/*',
  //     'x-app-key': this.key,
  //   };
  //   return header;
  // }


  @Post('createPayment')
  async createPayment( @Req() req: Request, @Res() res: Response) {
    const { amount, merchantAssociationInfo, mode,tran_id, payerReference} = req.body;
    const token = await this.getInitialToken()
    const headers = {
      'Content-Type':'application/json',
      'Authorization': token,
      'x-app-key': this.app_key
    }
    const paymentID = tran_id || this.generateCustomTransactionId();
    const orderID =  this.generateCustomorderId();

    const payload = {
      mode:mode || '',
      payerReference: payerReference || '' ,
      paymentID:paymentID || '',
      callbackURL:"https://flyfarladies.com",
      amount: amount || 0,
      intent:'sale',
      currency: 'BDT',
      merchantInvoiceNumber: orderID, 
      merchantAssociationInfo: merchantAssociationInfo || '',
    }
      const url = `https://tokenized.pay.bka.sh/tokenized/checkout/create`
      console.log(url);
      console.log(payload);
      const x= await this.httpService.post(url, payload, {headers})
      console.log(x);
      return res.json(x);
     
  }

@Post('execute/:paymentID')
async executePayemnt( @Req() req: Request, @Param('paymentID') paymentID :string){
  const {customerMsisdn, payerReference, paymentExecuteTime,
     trxID,transactionStatus,amount,currency, intent,merchantInvoiceNumber,
     statusCode,
     statusMessage,
    } = req.body

    const requestdata ={customerMsisdn, payerReference, paymentExecuteTime,
      trxID,transactionStatus,amount,currency, intent,merchantInvoiceNumber,
      statusCode,
      statusMessage,
      paymentID
     }
     return requestdata;
}

}

  




