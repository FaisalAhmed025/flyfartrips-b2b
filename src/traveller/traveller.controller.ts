import { AuthService } from 'src/auth/auth.service';
import { CreateAuthDto } from './../auth/dto/create-auth.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Req, Res, HttpStatus, HttpException } from '@nestjs/common';
import { TravellerService } from './traveller.service';
import { CreateTravellerDto } from './dto/create-traveller.dto';
import { UpdateTravellerDto } from './dto/update-traveller.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GCSStorageService } from 'src/s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Traveller } from './entities/traveller.entity';



@ApiTags('traveller module')
@Controller('traveller')
export class TravellerController {
  constructor(
    @InjectRepository(Auth) private agentpository: Repository<Auth>,
    @InjectRepository(Traveller) private travllerRepository:Repository<Traveller>,
    private readonly travellerService: TravellerService,
    private s3service: GCSStorageService,
    private readonly authService: AuthService,
    ) {}

  @ApiBearerAuth()
  @Post('add/:agentid')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'passportPhoto', maxCount: 2 },
    { name: 'visaCopy', maxCount: 2 }
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        knownName: { type: 'string' },
        fullName: { type: 'string' },
        gender: { type: 'string',},
        type: { type: 'string' },
        dateOfBirth: { type: 'date' },
        phone: { type: 'string'},
        email: { type: 'string'},
        Nationality:{type:'string'},
        passportExpireDate:{type:'date'},
        passportPhoto: { type: 'string', format:'binary'},
        visaCopy: { type: 'string', format:'binary'},
      }
    },
  })
 async createtraveller(
  @UploadedFiles()
  file: {
    passportPhoto?: Express.Multer.File[],
    visaCopy?: Express.Multer.File[]
  },
  @Param('agentid') agentid:string,
  @Req() req: Request,
  @Res() res: Response,
  @Body() createTravellerDto: CreateTravellerDto) {
    const token = req.headers['authorization']
    await this.authService.verifyToken(token)
    const agent = await this.agentpository.findOne({where:{agentid:agentid}})
    if (!agent) {
      throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
    }
    createTravellerDto.agentid =agentid
    let passportPhoto;
    if (file.passportPhoto && file.passportPhoto.length > 0) {
      passportPhoto = await this.s3service.Addimage(file.passportPhoto[0]);
      createTravellerDto.passportPhoto =passportPhoto;
    }
    let visaCopy;
    if (file.visaCopy && file.visaCopy.length > 0) {
      visaCopy = await this.s3service.Addimage(file.visaCopy[0]);
      createTravellerDto.visaCopy =visaCopy;
    }

    await this.travellerService.addtraveller(createTravellerDto);
    return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', message: 'traveller addd successful'});

  }

  @Get('/agent/travellerlist/:agentid')
  async findAll(@Param('agentid') agentid:string) {
    const agent = await this.agentpository.findOne({ where:{agentid}});
    if (!agent) {
      throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
    }
    const alltraveller = await this.travllerRepository.find({where:{agentid}, order:{createdAt:'DESC'}})
    if (!alltraveller) {
      throw new HttpException('tarveller not found', HttpStatus.NOT_FOUND)
    }
    return alltraveller;
  }

  @Get(':travellerid')
  findOne(@Param('travellerid') travellerid: string) {
    return this.travellerService.findOne(travellerid);
  }

  @Get('all/traveller')
  async alltraveller() {
    return await this.travellerService.findAll();
  }


  @ApiBearerAuth()
  @Patch('update/:agentid')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'passportPhoto', maxCount: 2 },
  { name: 'visaCopy', maxCount: 2 }
]))
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      travellerid: { type: 'string'},
      knownName: { type: 'string' },
      fullName: { type: 'string' },
      gender: { type: 'string' },
      type: { type: 'string' },
      dateOfBirth: { type: 'date' },
      phone: { type: 'string' },
      email: { type: 'string' },
      Nationality: { type: 'string' },
      passportExpireDate: { type: 'date' },
      passportPhoto: { type: 'string', format: 'binary' },
      visaCopy: { type: 'string', format: 'binary' },
    },
  },
})
async updateTraveller(
  @UploadedFiles()
  file: {
    passportPhoto?: Express.Multer.File[],
    visaCopy?: Express.Multer.File[]
  },
  @Body('travellerid') travellerid: string,
  @Param('agentid') agentid: string,
  @Req() req: Request,
  @Res() res: Response,
  @Body() updateTravellerDto: UpdateTravellerDto
) {
  const token = req.headers['authorization']
  await this.authService.verifyToken(token)
  const agent = await this.agentpository.findOne({ where:{agentid}});
  if (!agent) {
    throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
  }
  const traveller = await this.travellerService.findOne(travellerid);
  if (!traveller) {
    throw new HttpException('Traveller not found', HttpStatus.NOT_FOUND);
  }

  let passportPhoto;
  if (file.passportPhoto && file.passportPhoto.length > 0) {
    passportPhoto = await this.s3service.Addimage(file.passportPhoto[0]);
    traveller.passportPhoto = passportPhoto;
  }

  let visaCopy;
  if (file.visaCopy && file.visaCopy.length > 0) {
    visaCopy = await this.s3service.Addimage(file.visaCopy[0]);
    traveller.visaCopy = visaCopy;
  }


  // Update other properties if provided
  if (updateTravellerDto.knownName !== undefined) {
    traveller.knownName = updateTravellerDto.knownName;
  }

  if (updateTravellerDto.fullName !== undefined) {
    traveller.fullName = updateTravellerDto.fullName;
  }

  if (updateTravellerDto.gender !== undefined) {
    traveller.gender = updateTravellerDto.gender;
  }

  if (updateTravellerDto.type !== undefined) {
    traveller.type = updateTravellerDto.type;
  }

  if (updateTravellerDto.dateOfBirth !== undefined) {
    traveller.dateOfBirth = updateTravellerDto.dateOfBirth;
  }

  if (updateTravellerDto.phone !== undefined) {
    traveller.phone = updateTravellerDto.phone;
  }

  if (updateTravellerDto.email !== undefined) {
    traveller.email = updateTravellerDto.email;
  }

  if (updateTravellerDto.Nationality !== undefined) {
    traveller.Nationality = updateTravellerDto.Nationality;
  }

  if (updateTravellerDto.passportExpireDate !== undefined) {
    traveller.passportExpireDate = updateTravellerDto.passportExpireDate;
  }

  await this.travllerRepository.save(traveller);

  return res.status(HttpStatus.OK).json({
    status: 'success',
    message: 'Traveller updated successfully',
  });
}

@ApiBearerAuth()
@Delete(':travellerid')
 async deletetraveller( 
  @Res() res: Response,
  @Req() req: Request,
  @Param('travellerid') travellerid: string,) {

    const token = req.headers['authorization']
    await this.authService.verifyToken(token)
    await this.travellerService.remove(travellerid)
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Traveller has deleted successfully',
    });
  }
}
