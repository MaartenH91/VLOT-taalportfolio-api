import { GradeOptions, TaalOptions } from "../../constants";
import { QuestionTypes } from "./TaalprofielVraag.constants";

export interface TaalprofielVraagBody {
  id?: number;
  vraag: string;
  taal: TaalOptions;
  soortVraag: QuestionTypes;
  graad: GradeOptions;
}
