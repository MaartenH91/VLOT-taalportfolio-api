import { IsDefined } from "class-validator";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "../BaseEntity";
import TaalprofielAntwoord from "../TaalprofielAntwoord/TaalprofielAntwoord.entity";
import User from "../User/User.entity";

@Entity()
export default class AndereTaal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  taal: string;

  @ManyToOne(() => User, (leerling) => leerling.andereTalen)
  leerling: User;

  @OneToMany(
    () => TaalprofielAntwoord,
    (taalprofielAntwoord) => taalprofielAntwoord.andereTaal
  )
  taalprofielAntwoorden: TaalprofielAntwoord[];
}
