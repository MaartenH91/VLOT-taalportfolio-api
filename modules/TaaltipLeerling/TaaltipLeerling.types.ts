import Taaltip from "../Taaltip/Taaltip.entity";
import User from "../User/User.entity";

export interface TaaltipLeerlingBody {
  id?: number;
  taaltip: Taaltip;
  taaltipId: number;
  leerling: User;
  leerlingId: number;
  // TODO Create static answers with an enum once the answers are determined
  antwoord: string;
}
