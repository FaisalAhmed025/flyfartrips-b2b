import { ApiProperty, ApiBody } from "@nestjs/swagger"


export class CreateAuthDto {
   @ApiProperty()
   firstName:string
   @ApiProperty()
   agentid:string
   @ApiProperty()
   lastName:string
   @ApiProperty()
   companyName:string
   @ApiProperty()
   companyAddress:string
   @ApiProperty()
   email:string
   @ApiProperty()
   password:string
   @ApiProperty()
   tinFile:string
   @ApiProperty()
   access_token:string
   @ApiProperty()
   created_At:Date
   @ApiProperty()
   updated_At:Date
}

