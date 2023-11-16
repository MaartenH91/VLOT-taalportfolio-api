import VaardighedenCriteria from "../VaardighedenCriteria/VaardighedenCriteria.entity";
import VaardighedenOnderdeel from "../VaardighedenOnderdeel/VaardighedenOnderdeel.entity";

export interface VaardighedenEvaluatieBody {
  id?: number;
  antwoord: string;
  criteria: VaardighedenCriteria;
  onderdeel: VaardighedenOnderdeel;
}
