import { TaalOptions, VaardigheidOptions } from "../../constants";
import Klas from "../Klas/Klas.entity";

export interface TaaltipBody {
  id?: number;
  tip: string;
  taal: TaalOptions;
  vaardigheid: VaardigheidOptions;
  klas: Klas;
}
