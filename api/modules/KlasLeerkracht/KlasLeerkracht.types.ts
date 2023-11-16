import Klas from "../Klas/Klas.entity";
import User from "../User/User.entity";

export interface KlasLeerkrachtBody {
  id?: number;
  klasId: number;
  klas: Klas;
  leerkrachtId: number;
  leerkracht: User;
  geldigVan: Date;
  geldigTot: Date;
}
