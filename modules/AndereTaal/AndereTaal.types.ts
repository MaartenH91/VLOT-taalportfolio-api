import User from "../User/User.entity";

export interface AndereTaalBody {
  id?: number;
  taal: string;
  leerling: User;
  leerlingId: number;
}
