import Basisgeletterdheid from "../Basisgeletterdheid/Basisgeletterdheid.entity";
import User from "../User/User.entity";

export interface BasisgeletterdheidLeerlingBody {
  id?: number;
  basisgeletterdheid: Basisgeletterdheid;
  basisgeletterdheidId: number;
  leerling: User;
  leerlingId: number;
  status: boolean;
}
