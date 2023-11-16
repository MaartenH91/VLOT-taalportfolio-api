import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { compare, hash } from "bcrypt";
import { IsDefined, IsEmail } from "class-validator";
import { BaseEntity } from "../BaseEntity";
import { UserRole } from "./User.constants";
import Klas from "../Klas/Klas.entity";
import TaaltipLeerling from "../TaaltipLeerling/TaaltipLeerling.entity";
import KlasLeerkracht from "../KlasLeerkracht/KlasLeerkracht.entity";
import TaalprofielAntwoord from "../TaalprofielAntwoord/TaalprofielAntwoord.entity";
import FoutenanalyseOnderdeel from "../FoutenanalyseOnderdeel/FoutenanalyseOnderdeel.entity";
import WoordenschatOnderdeel from "../WoordenschatOnderdeel/WoordenschatOnderdeel.entity";
import VaardighedenOnderdeel from "../VaardighedenOnderdeel/VaardighedenOnderdeel.entity";
import AndereTaal from "../AndereTaal/AndereTaal.entity";
import BasisgeletterdheidLeerling from "../BasisgeletterdheidLeerling/BasisgeletterdheidLeerling.entity";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined({ always: true })
  @Column()
  voornaam: string;

  @IsDefined({ always: true })
  @Column()
  achternaam: string;

  @IsDefined({ always: true })
  @IsEmail(undefined, { always: true })
  @Column({ unique: true })
  email: string;

  @IsDefined({ groups: ["create"] })
  @Column({ select: false })
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  rol: UserRole;

  @ManyToOne(() => Klas, (klas) => klas.leerlingen)
  klas: Klas;

  @OneToMany(() => TaaltipLeerling, (antwoord) => antwoord.leerling)
  taaltipsAntwoorden: TaaltipLeerling[];

  @OneToMany(() => KlasLeerkracht, (klas) => klas.leerkracht)
  leerkrachtKlassen: KlasLeerkracht[];

  @OneToMany(() => TaalprofielAntwoord, (antwoord) => antwoord.leerling)
  taalprofielAntwoorden: TaalprofielAntwoord[];

  @OneToMany(() => FoutenanalyseOnderdeel, (onderdeel) => onderdeel.leerling)
  foutenanalyseOnderdelen: FoutenanalyseOnderdeel[];

  @OneToMany(() => WoordenschatOnderdeel, (onderdeel) => onderdeel.leerling)
  woordenschatOnderdelen: WoordenschatOnderdeel[];

  @OneToMany(() => VaardighedenOnderdeel, (onderdeel) => onderdeel.leerling)
  vaardighedenOnderdelen: VaardighedenOnderdeel[];

  @OneToMany(() => AndereTaal, (taal) => taal.leerling)
  andereTalen: AndereTaal[];

  @OneToMany(
    () => BasisgeletterdheidLeerling,
    (basisgeletterdheid) => basisgeletterdheid.leerling
  )
  basisgeletterdheden: BasisgeletterdheidLeerling[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }

  async checkPassword(password: string) {
    return await compare(password, this.password);
  }

  isAdmin() {
    return this.rol === UserRole.Admin;
  }

  isStudent() {
    return this.rol === UserRole.Student;
  }

  isTeacher() {
    return this.rol === UserRole.Teacher;
  }
}
