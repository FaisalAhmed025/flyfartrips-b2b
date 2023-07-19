import { type } from "os";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum PaymentStatus {
   PENDING = 'PENDING',
   APPROVED = 'APPROVED',
   REJECTED = 'REJECTED',
 }

 let depositIdCounter = 100;
@Entity()
export class Bankdeposit{
   @PrimaryGeneratedColumn()
   id:number
   @Column({type:'varchar'})
   depositid: string;
   @BeforeInsert()
   generateUserId() {
      depositIdCounter++;
    this.depositid = `FFD${depositIdCounter}`;
 }
   @Column()
   agentid: string;
   @Column()
   depositmethod:string
   @Column()
   sender:string
   @Column()
   reciever:string
   @Column()
   bankname:string
   @Column()
   paymentgateway:string
   @Column()
   transactionid:string
   @Column({type:'varchar'})
   depositname:string
   @Column({type:'varchar'})
   chequenumber:string
   @Column({type:'varchar'})
   depositby:string
   @Column({type:'varchar'})
   actionby:string
   @Column({type:'varchar'})
   rejectionreason:string
   @Column({type:'date'})
   chequeissuedate:Date
   @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
   status: PaymentStatus;
   @Column({type:'varchar'})
   transfertype: string
   @Column({type:'date'})
   transactiondate:Date
   @Column({type:'varchar'})
   attachment:string
   @Column({type:'integer'})
   amount:number
   @CreateDateColumn()
   createdAt:Date
   @UpdateDateColumn()
   updatedAt:Date
}