import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import FoutenanalyseOnderdeel from "../FoutenanalyseOnderdeel/FoutenanalyseOnderdeel.entity";

@Entity()
export default class FoutenanalyseFout extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  fout: string;

  @ManyToOne(() => FoutenanalyseOnderdeel, (onderdeel) => onderdeel.fouten)
  onderdeel: FoutenanalyseOnderdeel;
}