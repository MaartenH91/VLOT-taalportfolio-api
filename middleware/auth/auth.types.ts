import { Request } from "express";
import User from "../../modules/User/User.entity";

// Interface for the request object
export interface AuthRequest<
  P = void,
  ResBody = void,
  ReqBody = void,
  ReqQuery = void,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: User;
  params: any;
  body: any;
}
