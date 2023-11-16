import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import Basisgeletterdheid from "../Basisgeletterdheid/Basisgeletterdheid.entity";
import User from "../User/User.entity";

@Entity()
export default class BasisgeletterdheidLeerling extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column({ default: false })
  status: boolean;

  @ManyToOne(() => User, (leerling) => leerling.basisgeletterdheden)
  leerling: User;

  @ManyToOne(
    () => Basisgeletterdheid,
    (basisgeletterdheid) => basisgeletterdheid.basisgeletterdheden
  )
  basisgeletterdheid: Basisgeletterdheid;
}
