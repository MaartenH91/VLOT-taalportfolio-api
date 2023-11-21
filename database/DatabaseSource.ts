import "reflect-metadata";
import { DataSource } from "typeorm";
import AndereTaal from "../modules/AndereTaal/AndereTaal.entity";
import Basisgeletterdheid from "../modules/Basisgeletterdheid/Basisgeletterdheid.entity";
import BasisgeletterdheidLeerling from "../modules/BasisgeletterdheidLeerling/BasisgeletterdheidLeerling.entity";
import FoutenanalyseFout from "../modules/FoutenanalyseFout/FoutenanalyseFout.entity";
import FoutenanalyseOnderdeel from "../modules/FoutenanalyseOnderdeel/FoutenanalyseOnderdeel.entity";
import Klas from "../modules/Klas/Klas.entity";
import KlasLeerkracht from "../modules/KlasLeerkracht/KlasLeerkracht.entity";
import TaalprofielAntwoord from "../modules/TaalprofielAntwoord/TaalprofielAntwoord.entity";
import TaalprofielVraag from "../modules/TaalprofielVraag/TaalprofielVraag.entity";
import Taaltip from "../modules/Taaltip/Taaltip.entity";
import TaaltipLeerling from "../modules/TaaltipLeerling/TaaltipLeerling.entity";
import User from "../modules/User/User.entity";
import VaardighedenCriteria from "../modules/VaardighedenCriteria/VaardighedenCriteria.entity";
import VaardighedenEvaluatie from "../modules/VaardighedenEvaluatie/VaardighedenEvaluatie.entity";
import VaardighedenOnderdeel from "../modules/VaardighedenOnderdeel/VaardighedenOnderdeel.entity";
import WoordenschatOnderdeel from "../modules/WoordenschatOnderdeel/WoordenschatOnderdeel.entity";
import WoordenschatWoord from "../modules/WoordenschatWoord/WoordenschatWoord.entity";

// config for the database
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Klas,
    Taaltip,
    TaaltipLeerling,
    KlasLeerkracht,
    TaalprofielVraag,
    TaalprofielAntwoord,
    FoutenanalyseOnderdeel,
    FoutenanalyseFout,
    WoordenschatOnderdeel,
    WoordenschatWoord,
    VaardighedenCriteria,
    VaardighedenOnderdeel,
    VaardighedenEvaluatie,
    AndereTaal,
    Basisgeletterdheid,
    BasisgeletterdheidLeerling,
  ],
  migrations: [],
  subscribers: [],
  ssl:
    process.env.ENV === "PRODUCTION"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});
