import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { AmarpayService } from './amarpay.service';
import axios from 'axios';
import { Request, Response } from 'express';
import { createHash } from 'crypto';


@Controller('amarpay')
export class AmarpayController {
  constructor(private readonly amarpayService: AmarpayService) {}

  generateCustomTransactionId(): string {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
    const hash = createHash('sha256').update(`${timestamp}${randomString}`).digest('hex');
    const shortenedHash = hash.substr(0, 16).toUpperCase();
    return shortenedHash;
  }

  
  @Post('payment')
  async postPayment(@Req() req: Request, @Res() res: Response) {
    const {
      cus_name,
      cus_email,
      cus_phone,
      amount,
      desc,
      currency,
      cus_add1,
      cus_add2,
      cus_city,
      cus_country,
      tran_id,
    } = req.body;
  
    const transactionId = tran_id || this.generateCustomTransactionId();
    const requestBody = {
      cus_name: cus_name || '',
      cus_email: cus_email || '',
      cus_phone: cus_phone || '',
      amount: amount || 100,
      tran_id: transactionId,
      signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
      store_id: 'aamarpaytest',
      currency: currency || 'BDT',
      desc: desc || '',
      cus_add1: cus_add1 || '53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh',
      cus_add2: cus_add2 || 'Dhaka',
      cus_city: cus_city || 'Dhaka',
      cus_country: cus_country || 'Bangladesh',
      success_url: `http://localhost:5000/amarpay/callback/${transactionId}`,
      fail_url: 'http://localhost:5000/fail',
      cancel_url: 'http://localhost:5000/cancel',
      type: 'json',
    };

  const url ='https://sandbox.aamarpay.com/jsonpost.php'
    try {
      const { data } = await axios.post(url,requestBody);
      if (data.result !== 'true') {
        let errorMessage = '';
        for (let key in data) {
          errorMessage += data[key] + '. ';
        }
        return res.render('error', {
          title: 'Error',
          errorMessage,
        });
      }
  
      return res.status(201).json(data.payment_url);
    } catch (error) {
      console.error(error);
      return res.render('error', {
        title: 'Error',
        errorMessage: 'An error occurred during payment processing.',
      });
    }
  }
  
  @Post('callback/:tran_id')
  postCallback(
    @Param('tran_id') tran_id: string,
     @Req() req:Request, @Res() res:Response) {
    const {
      pay_status,
      cus_name,
      cus_phone,
      cus_email,
      currency,
      pay_time,
      amount,

    } = req.body;
    const responseData = {
      tran_id,
      pay_status,
      cus_name,
      cus_phone,
      cus_email,
      currency,
      pay_time,
      amount,
  
    };
    return res.json(responseData);
  }


}




