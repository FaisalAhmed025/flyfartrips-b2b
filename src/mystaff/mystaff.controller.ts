import { agent } from 'supertest';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, HttpException } from '@nestjs/common';
import { MystaffService } from './mystaff.service';
import { CreateMystaffDto } from './dto/create-mystaff.dto';
import { UpdateMystaffDto } from './dto/update-mystaff.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Staff } from './entities/mystaff.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Agent } from 'src/agent/entities/agent.entity';
import * as bcrypt from 'bcrypt'
import { agentService } from 'src/agent/agent.service';


@ApiTags('Staff module')
@Controller('mystaff')
export class MystaffController {
  constructor(
    @InjectRepository(Staff) private staffRepository:Repository<Staff>,
    @InjectRepository(Agent) private agentRepository:Repository<Agent>,
    private readonly agentService: agentService,
    private readonly mystaffService: MystaffService) {}
    

    @ApiBearerAuth()
    @Post('add')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string'},
          email: { type: 'string' },
          fullName: { type: 'string'},
          role: { type: 'string'},
          designation: { type: 'string'},
          phoneNumber:{type: 'string'},
          password:{type: 'string'}
        }
      },
    })
  async createstaff(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createMystaffDto: CreateMystaffDto) {
      const jwttoken = req.headers['authorization'];
      const decodedtoken = await this.agentService.verifyToken(jwttoken)
      const agentid =decodedtoken.agentid
      const agent =  await this.agentRepository.findOne({where:{agentid}})
      if(!agent){
        throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
      }
      createMystaffDto.agentid = agentid
      await this.mystaffService.Addstaff(createMystaffDto);
      return res
      .status(HttpStatus.CREATED)
      .json({ status: 'success', message: 'staff addd successful'});
    }


    @Post('login')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string'},
         
        }
      },
    })
  
  async staffLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body('email') email:string,
    @Body('password') password:string,
    ) {
    await this.mystaffService.staffLogin(email,password);
    return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', message: 'staff login successful'});
    }
   
   @ApiBearerAuth()
   @Get('all')
   async findAll(
    @Req() req: Request,
     
    ) {
      const jwttoken = req.headers['authorization'];
      const decodedtoken = await this.agentService.verifyToken(jwttoken)
      const agentid =decodedtoken.agentid
      const agent = await this.agentRepository.findOne({where:{agentid}})
      if (!agent) {
        throw new HttpException("agent not found", HttpStatus.NOT_FOUND)
      }
      const staff = await this.staffRepository.find({order:{createdAt:'DESC'}});
      if (!staff) {
        throw new HttpException("you dont any staff", HttpStatus.NOT_FOUND)
      }
      return staff;
    }


    @ApiBearerAuth()
    @Patch('update')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          staffid:{ type:'string'},
          name: { type: 'string'},
          email: { type: 'string' },
          fullName: { type: 'string'},
          role: { type: 'string'},
          designation: { type: 'string'},
          phoneNumber:{type: 'string'},
          password:{type: 'string'}
        }
      },
    })
  async updatestaff(
    @Body('staffid') staffid:string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateMystaffDto: UpdateMystaffDto) {
    const token = req.headers['authorization']
    const decodedToken = await this.agentService.verifyToken(token)
    const agentid = decodedToken.agentid;

    const agent =  await this.agentRepository.findOne({where:{agentid}})
    if(!agent){
      throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
    }
    const staff= await this.staffRepository.findOne({where:{staffid}})

    if(!staff){
      throw new HttpException('staff not found', HttpStatus.NOT_FOUND)
    }

    if (updateMystaffDto.name !== undefined) {
      staff.name = updateMystaffDto.name;
    }
    if (updateMystaffDto.email !== undefined) {
      staff.email = updateMystaffDto.email;
    }
    if (updateMystaffDto.designation !== undefined) {
      staff.designation = updateMystaffDto.designation;
    }
    if (updateMystaffDto.password !== undefined) {
      staff.password =  await bcrypt.hash(updateMystaffDto.password,10)
    }
    if (updateMystaffDto.phoneNumber !== undefined) {
      staff.phoneNumber = updateMystaffDto.phoneNumber;
    }

    if (updateMystaffDto.role !== undefined) {
      staff.role = updateMystaffDto.role;
    }
    await this.staffRepository.save(staff);
    return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', message: 'staff update successful'});
    }

    @Get('staffprofile/:staffid')
    findOne(
      @Param('staffid') staffid: string) {
      return this.mystaffService.findOne(staffid);
    }

    // delete a staff
    @ApiBearerAuth()
    @Delete(':staffid')
    async deleteStaff(
      @Res() res: Response,
      @Req() req:Request,
      @Param('staffid') staffid: string
      ) {
      const token = req.headers['authorization']
      const decodedToken = await this.agentService.verifyToken(token)// Implement the logic to decode the token
      const agentid = decodedToken.agentid;
      const agent = await this.agentRepository.findOne({where:{agentid}})
      if (!agent){
      throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
      }
      await this.staffRepository.delete({staffid})
      return res
      .status(HttpStatus.CREATED)
      .json({ status: 'success', message: 'staff deleted'});
      }
    }


