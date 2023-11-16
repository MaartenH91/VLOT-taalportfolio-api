import FoutenanalyseOnderdeel from "../FoutenanalyseOnderdeel/FoutenanalyseOnderdeel.entity";

export interface FoutenanalyseFoutBody {
  id?: number;
  fout: string;
  onderdeelId: number;
  onderdeel: FoutenanalyseOnderdeel;
}
