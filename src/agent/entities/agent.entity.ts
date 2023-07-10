import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsEmail } from "class-validator"



const crypto = require('crypto');
const secretKey = 'my-secret-key';
const maxValue = 10000;


@Entity()
export class Agent {
   @PrimaryGeneratedColumn()
   id:number
   @Column({type: "varchar"})
   agentid:string
   @BeforeInsert()
   async generateUniqueRandomNumber() {
     const timestamp = new Date().toISOString();
     const data = `${timestamp}-${secretKey}`;
     const hash = crypto.createHash('sha256').update(data).digest('hex');
     const randomNumber = parseInt(hash, 16) % (maxValue - 1) + 1; // Subtract 1 from maxValue and add 1 to the random number
     this.agentid = `FFA${randomNumber.toString().padStart(4, '0')}`;
   }
   @Column({type: "varchar"})
   firstName:string
   @Column({type: "varchar"})
   lastName:string
   @Column({type: "varchar"})
   companyName:string
   @Column({type: "varchar"})
   companyAddress:string
   @IsEmail({}, { message: 'Incorrect email' })
   @Column({type: "varchar"})
   email:string
   @Column({type: "varchar"})
   password:string
   @Column({type: "varchar"})
   walletbalance:number
   @Column({type: "varchar"})
   access_token:string
   @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   created_At: Date;
   @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
   updated_At: Date;
   @Column()
   ipAddress: string;
   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   loginTime: Date;
   @Column()
   browserName: string;
   @Column()
   activeStatus: boolean;
   @Column({ default: 0 })
   loginAttempts: number;
   @Column({ default: false })
   isLocked: boolean;
   @Column({type: "varchar"})
   nidcopy:string
   @Column({type: "varchar"})
   tradelicensecopy:string
   @Column({type: "varchar"})
   toabcertificationcopy:string
   @Column({type: "varchar"})
   atabcertificationcopy:string
   @Column({type: "varchar"})
   tinFile:string
   @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   join_At: Date;

}
