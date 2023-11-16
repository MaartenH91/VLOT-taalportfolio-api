import AndereTaal from "../AndereTaal/AndereTaal.entity";
import TaalprofielVraag from "../TaalprofielVraag/TaalprofielVraag.entity";
import User from "../User/User.entity";

export interface TaalprofielAntwoordBody {
  id?: number;
  antwoord: string;
  vraagId: number;
  vraag: TaalprofielVraag;
  leerlingId: number;
  leerling: User;
  jaar: number;
  andereTaal?: AndereTaal;
  andereTaalId?: number;
}
