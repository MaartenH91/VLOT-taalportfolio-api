import { TaalOptions } from "../../constants";
import User from "../User/User.entity";

export interface FoutenanalyseOnderdeelBody {
  id?: number;
  naam: string;
  leerling: User;
  taal: TaalOptions;
  feedback: string;
}