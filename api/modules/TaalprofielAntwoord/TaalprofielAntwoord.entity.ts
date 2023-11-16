import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import AndereTaal from "../AndereTaal/AndereTaal.entity";
import { BaseEntity } from "../BaseEntity";
import TaalprofielVraag from "../TaalprofielVraag/TaalprofielVraag.entity";
import User from "../User/User.entity";

@Entity()
export default class TaalprofielAntwoord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  antwoord: string;

  @IsDefined({ always: true })
  @Column()
  jaar: number;

  @ManyToOne(() => TaalprofielVraag, (vraag) => vraag.taalprofielAntwoorden)
  vraag: TaalprofielVraag;

  @ManyToOne(() => User, (leerling) => leerling.taalprofielAntwoorden)
  leerling: User;

  @ManyToOne(() => AndereTaal, (andereTaal) => andereTaal.taalprofielAntwoorden)
  andereTaal: AndereTaal;
}
