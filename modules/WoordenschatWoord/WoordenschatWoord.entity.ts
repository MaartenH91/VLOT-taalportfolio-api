import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import WoordenschatOnderdeel from "../WoordenschatOnderdeel/WoordenschatOnderdeel.entity";

@Entity()
export default class WoordenschatWoord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  woord: string;

  @IsDefined({ always: true })
  @Column()
  betekenis: string;

  @ManyToOne(() => WoordenschatOnderdeel, (onderdeel) => onderdeel.woorden)
  onderdeel: WoordenschatOnderdeel;
}