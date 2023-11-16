import WoordenschatOnderdeel from "../WoordenschatOnderdeel/WoordenschatOnderdeel.entity";

export interface WoordenschatWoordBody {
  id?: number;
  woord: string;
  betekenis: string;
  onderdeelId: number;
  onderdeel: WoordenschatOnderdeel;
}
