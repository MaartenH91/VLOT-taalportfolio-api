import { IsDefined } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import BasisgeletterdheidLeerling from "../BasisgeletterdheidLeerling/BasisgeletterdheidLeerling.entity";

@Entity()
export default class Basisgeletterdheid extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  geletterdheid: string;

  @IsDefined({ always: true })
  @Column()
  vaardigheid: string;

  @OneToMany(
    () => BasisgeletterdheidLeerling,
    (basisgeletterdheid) => basisgeletterdheid.basisgeletterdheid
  )
  basisgeletterdheden: BasisgeletterdheidLeerling[];
}
