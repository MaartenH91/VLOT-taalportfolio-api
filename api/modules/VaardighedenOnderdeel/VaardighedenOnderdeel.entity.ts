import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaalOptions, VaardigheidOptions } from "../../constants";
import { BaseEntity } from "../BaseEntity";
import User from "../User/User.entity";
import VaardighedenEvaluatie from "../VaardighedenEvaluatie/VaardighedenEvaluatie.entity";

@Entity()
export default class VaardighedenOnderdeel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  naam: string;

  @IsDefined({ always: true })
  @Column()
  taal: TaalOptions;

  @IsDefined({ always: true })
  @Column()
  vaardigheid: VaardigheidOptions;

  @IsDefined({ always: false })
  @Column({ default: "" })
  feedback: string;

  @ManyToOne(() => User, (leerling) => leerling.vaardighedenOnderdelen)
  leerling: User;

  @OneToMany(() => VaardighedenEvaluatie, (evalutie) => evalutie.onderdeel)
  evaluaties: VaardighedenEvaluatie[];
}