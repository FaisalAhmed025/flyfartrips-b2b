import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


const crypto = require('crypto');
const secretKey = 'my-secret-key';
const maxValue = 10000;



@Entity()
export class Traveller {
   @PrimaryGeneratedColumn()
   id:number
   @Column()
   travellerid:string
   @Column()
   agentid:string
   @BeforeInsert()
   async generateUniqueRandomNumber() {
     const timestamp = new Date().toISOString();
     const data = `${timestamp}-${secretKey}`;
     const hash = crypto.createHash('sha256').update(data).digest('hex');
     const randomNumber = parseInt(hash, 16) % (maxValue - 1) + 1; // Subtract 1 from maxValue and add 1 to the random number
     this.travellerid = `FFT${randomNumber.toString().padStart(4, '0')}`;
   }
   @Column()
   knownName:string
   @Column()
   fullName:string
   @Column()
   gender:string
   @Column()
   type:string
   @Column()
   dateOfBirth:string
   @Column()
   passportPhoto:string
   @Column()
   visaCopy:string
   @Column()
   passportExpireDate:Date
   @Column()
   Nationality:string
   @Column()
   email:string
   @Column()
   phone:string
   @CreateDateColumn()
   createdAt:Date
   @UpdateDateColumn()
   updatedAt:Date
}
