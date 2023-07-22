import { Body, Injectable, Req } from '@nestjs/common';
import { CreateBkashDto } from './dto/create-bkash.dto';
import { UpdateBkashDto } from './dto/update-bkash.dto';
import { BkashException } from './bkashException';
import { IBkashCreatePaymentResponse, IBkashTokenResponse } from './entities/bkashresponse.interface';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IHeaders } from './entities/headers.interface';
import { diffSeconds } from './diffSeconds';
import { ICreatePayment } from './entities/createPayment.interface';





@Injectable()
export class BkashService {
  private readonly baseURL = 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized';
  private readonly key = 'gswy5A2C7tHMZCOdoJWEIA5Ntc';
  private readonly secret = 'WSRHWksUVGTiZHDefwmznOWIr9TNGu7VfkkHWV7NCMfvbRClWO5g';
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenIssueTime: number = 0;
  private readonly headers = {
    username: '01325087966',
    password: '+RMPR@ug#4['
  };

    

  
  async getInitialToken(): Promise<IBkashTokenResponse> {
    try {
      const requestConfig: AxiosRequestConfig = {
        method: 'POST',
        url: `${this.baseURL}/checkout/token/grant`,
        data: {
          app_key: this.key,
          app_secret: this.secret,
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
      return response.data;
    } catch (error) {
      // Handle any other potential errors here
      // For example, if the API call itself fails or other unexpected errors occur
      // You can throw a custom exception for other specific errors if needed
      throw new BkashException('An error occurred while fetching the token');
    }
  }

 async newToken(refresh: string): Promise<IBkashTokenResponse> {
    const requestconfig: AxiosRequestConfig ={
      method: 'POST',
      url:`${this.baseURL}/checkout/token/refresh`,
      data:{
        app_key: this.key,
        app_secret: this.secret,
        refresh_token: refresh,
      },
      headers:this.headers
    };

    try {
      const response: AxiosResponse<IBkashTokenResponse> = await axios(requestconfig)
      return response.data
    } catch (error) {
      
    }
  }

  async createTokenHeader(): Promise<IHeaders> {
    const token = await this.getToken();
    return {
      authorization: token,
      'x-app-key': this.key,
    };
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      const { id_token, refresh_token, msg, status } = await this.getInitialToken();

      // Throw an error if bkash sends status [only happens when the request fails]
      if (status && msg) throw new BkashException(msg);
      this.token = id_token;
      this.refreshToken = refresh_token;
      this.tokenIssueTime = Date.now();
      return this.token;
    }

    const diff = diffSeconds(this.tokenIssueTime);

    if (diff < 3500) {
      return this.token;
    }

    // The token is expired, refresh it
    const { id_token, refresh_token, msg, status } = await this.newToken(this.refreshToken);

    // Throw an error if bkash sends status [only happens when the request fails]
    if (status && msg) throw new BkashException(msg);

    this.token = id_token;
    this.refreshToken = refresh_token;
    this.tokenIssueTime = Date.now();
    return this.token;
  }

  // Helper function to calculate the difference in seconds (if not already implemented)
  private diffSeconds(previousTime: number): number {
    const currentTime = Date.now();
    return Math.floor((currentTime - previousTime) / 1000);
  }


  // async createPayment(@Req() req: Request, @Body() ): Promise<IBkashCreatePaymentResponse> {
  //   const { amount, intent, orderID, merchantAssociationInfo, mode, payerReference, callbackURL} = req.body;
  //   const payload = {
  //     mode,
  //     payerReference,
  //     callbackURL,
  //     amount,
  //     intent,
  //     currency: 'BDT',
  //     merchantInvoiceNumber: orderID,
  //     merchantAssociationInfo: merchantAssociationInfo ?? '',
  //   }

  //   const token = await this.getToken();
  //   const url ='https://api.bkash.com/checkout/payment/create',
  //   const headers = {
  //     authorization: token,
  //     'x-app-key': this.key,
  //   };
  // }
  
 
}
