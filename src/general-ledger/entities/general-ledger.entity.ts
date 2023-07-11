import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum PaymentStatus {
   PENDING = 'PENDING',
   APPROVED = 'APPROVED',
   REJECTED = 'REJECTED',
 }


@Entity()
export class GeneralLedger {
   @PrimaryGeneratedColumn()
   id:number
   @Column()
   agentid: string;
   @Column()
   depositid: string;
   @Column()
   depositmethod:string
   @Column()
   sender:string
   @Column()
   lastBalance:string
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
   @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   createdAt:Date
   @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
   updatedAt:Date
}
