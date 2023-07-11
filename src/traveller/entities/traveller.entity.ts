import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


const crypto = require('crypto');
const secretKey = 'my-secret-key';
const maxValue = 10000;

let userCount = 0;
 
@Entity()
export class Traveller {
   @PrimaryGeneratedColumn()
   id:number
   @Column()
   travellerid:string
   @Column()
   agentid:string
   @BeforeInsert()
   generateUserId() {
    userCount++;
    this.travellerid = `FFA${100 + userCount}`;
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
