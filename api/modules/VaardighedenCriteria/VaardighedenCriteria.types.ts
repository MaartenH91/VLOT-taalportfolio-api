import { GradeOptions, TaalOptions, VaardigheidOptions } from "../../constants";

export interface VaardighedenCriteriaBody {
  id?: number;
  criteria: string;
  vaardigheid: VaardigheidOptions;
  taal: TaalOptions;
  graad: GradeOptions;
}
