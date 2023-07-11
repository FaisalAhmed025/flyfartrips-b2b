import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



 let userCount =0
@Entity()
export class Staff {
   @PrimaryGeneratedColumn()
   id:number
   @Column()
   name:string
   @Column()
   staffid:string
   @BeforeInsert()
   generateUserId() {
    userCount++;
    this.staffid = `FFS${100 + userCount}`;
 }
   @Column()
   agentid:string
   @Column()
   email:string
   @Column()
   phoneNumber:string
   @Column()
   password:string
   @Column()
   role:string
   @Column()
   designation:string
   @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   createdAt:Date
   @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   updatedAt:Date
}
