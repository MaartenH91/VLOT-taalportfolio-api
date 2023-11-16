import { IsDefined } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GradeOptions } from "../../constants";
import { BaseEntity } from "../BaseEntity";
import KlasLeerkracht from "../KlasLeerkracht/KlasLeerkracht.entity";
import Taaltip from "../Taaltip/Taaltip.entity";
import User from "../User/User.entity";

@Entity()
export default class Klas extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column({ unique: true })
  klas: string;

  @IsDefined({ always: true })
  @Column()
  graad: GradeOptions;

  @OneToMany(() => User, (user) => user.klas)
  leerlingen: User[];

  @OneToMany(() => Taaltip, (taaltip) => taaltip.klas)
  taaltips: Taaltip[];

  @OneToMany(() => KlasLeerkracht, (klas) => klas.klas)
  leerkrachtKlassen: KlasLeerkracht[];
}
