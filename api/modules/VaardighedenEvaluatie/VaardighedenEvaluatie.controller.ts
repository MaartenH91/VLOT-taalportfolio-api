import { NextFunction, Response } from "express";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import VaardighedenEvaluatieService from "./VaardighedenEvaluatie.service";
import { VaardighedenEvaluatieBody } from "./VaardighedenEvaluatie.types";

export default class VaardighedenEvaluatieController {
  private vaardighedenEvaluatieService: VaardighedenEvaluatieService;

  constructor() {
    this.vaardighedenEvaluatieService = new VaardighedenEvaluatieService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const vaardighedenEvaluaties = await this.vaardighedenEvaluatieService.all({ ...req.body });
    return res.json(vaardighedenEvaluaties);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const vaardighedenEvaluatie = await this.vaardighedenEvaluatieService.findOne(req.params.id);

    if (!vaardighedenEvaluatie) {
      next(new NotFoundError());
    }
    return res.json(vaardighedenEvaluatie);
  };

  create = async (
    req: AuthRequest<{}, {}, VaardighedenEvaluatieBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { body } = req;

    const vaardighedenEvaluatie = await this.vaardighedenEvaluatieService.create(body);

    return res.json(vaardighedenEvaluatie);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, VaardighedenEvaluatieBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const vaardighedenEvaluatie = await this.vaardighedenEvaluatieService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!vaardighedenEvaluatie) {
        next(new NotFoundError());
      }
      return res.json(vaardighedenEvaluatie);
    } catch (e) {
      next(e);
    }
  };

  delete = async (
    req: AuthRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const vaardighedenEvaluatie = await this.vaardighedenEvaluatieService.delete(parseInt(req.params.id));
      if (!vaardighedenEvaluatie) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
