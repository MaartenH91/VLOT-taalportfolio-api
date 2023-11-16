import Klas from "../Klas/Klas.entity";
import { UserRole } from "./User.constants";

export interface UserBody {
  id?: number;
  voornaam: string;
  achternaam: string;
  email: string;
  rol: UserRole;
  password?: string;
  klas: Klas;
  klas_id?: number;
}