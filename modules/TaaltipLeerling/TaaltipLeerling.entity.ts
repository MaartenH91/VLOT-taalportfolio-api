import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import Taaltip from "../Taaltip/Taaltip.entity";
import User from "../User/User.entity";

@Entity()
export default class TaaltipLeerling extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column({ default: "-" })
  // TODO Change the type to an enum once you get the determined answers
  antwoord: string;

  @ManyToOne(() => User, (leerling) => leerling.taaltipsAntwoorden)
  leerling: User;

  @ManyToOne(() => Taaltip, (taaltip) => taaltip.taaltipsAntwoorden)
  taaltip: Taaltip;
}
