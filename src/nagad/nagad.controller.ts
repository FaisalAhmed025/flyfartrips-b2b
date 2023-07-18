import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NagadService } from './nagad.service';



@Controller('nagad')
export class NagadController {
  constructor(
  private readonly nagadService: NagadService) {}



  @Post('add')
  async createPayment() {
    try {
      const callBackUrl = await this.nagadService.makePaymentRequest();
      return { callBackUrl };
    } catch (error) {
      // Handle any errors and return an appropriate response
      return { error: error.message };
    }
  }

}
