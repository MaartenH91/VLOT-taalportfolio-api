import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import VaardighedenCriteria from "../VaardighedenCriteria/VaardighedenCriteria.entity";
import VaardighedenOnderdeel from "../VaardighedenOnderdeel/VaardighedenOnderdeel.entity";

@Entity()
export default class VaardighedenEvaluatie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  antwoord: string;

  @ManyToOne(() => VaardighedenOnderdeel, (onderdeel) => onderdeel.evaluaties)
  onderdeel: VaardighedenOnderdeel;

  @ManyToOne(() => VaardighedenCriteria, (criteria) => criteria.evaluaties)
  criteria: VaardighedenCriteria;
}