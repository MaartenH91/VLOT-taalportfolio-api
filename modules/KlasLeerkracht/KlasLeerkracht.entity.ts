import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import Klas from "../Klas/Klas.entity";
import User from "../User/User.entity";

@Entity()
export default class KlasLeerkracht extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  geldigVan: Date;

  @IsDefined({ always: true })
  @Column()
  geldigTot: Date;

  @ManyToOne(() => User, (leerkracht) => leerkracht.leerkrachtKlassen)
  leerkracht: User;

  @ManyToOne(() => Klas, (klas) => klas.leerkrachtKlassen)
  klas: Klas;
}