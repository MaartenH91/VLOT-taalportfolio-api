import { IsDefined } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GradeOptions, TaalOptions } from "../../constants";
import { BaseEntity } from "../BaseEntity";
import TaalprofielAntwoord from "../TaalprofielAntwoord/TaalprofielAntwoord.entity";
import { QuestionTypes } from "./TaalprofielVraag.constants";

@Entity()
export default class TaalprofielVraag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  vraag: string;

  @IsDefined({ always: true })
  @Column()
  taal: TaalOptions;

  @IsDefined({ always: true })
  @Column()
  soortVraag: QuestionTypes;

  @IsDefined({ always: true })
  @Column()
  graad: GradeOptions;

  @OneToMany(() => TaalprofielAntwoord, (antwoord) => antwoord.vraag)
  taalprofielAntwoorden: TaalprofielAntwoord[];
}
