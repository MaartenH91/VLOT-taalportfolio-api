import { NextFunction, Response } from "express";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import WoordenschatWoordService from "./WoordenschatWoord.service";
import { WoordenschatWoordBody } from "./WoordenschatWoord.types";

export default class WoordenschatWoordController {
  private woordenschatWoordService: WoordenschatWoordService;

  constructor() {
    this.woordenschatWoordService = new WoordenschatWoordService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const woordenschatWoorden = await this.woordenschatWoordService.all({
      ...req.body,
    });
    return res.json(woordenschatWoorden);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const woordenschatWoord = await this.woordenschatWoordService.findOne(
      req.params.id
    );

    if (!woordenschatWoord) {
      next(new NotFoundError());
    }
    return res.json(woordenschatWoord);
  };

  create = async (
    req: AuthRequest<{}, {}, WoordenschatWoordBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    const { body } = req;

    const woordenschatWoord = await this.woordenschatWoordService.create(body);

    return res.json(woordenschatWoord);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, WoordenschatWoordBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const woordenschatWoord = await this.woordenschatWoordService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!woordenschatWoord) {
        next(new NotFoundError());
      }
      return res.json(woordenschatWoord);
    } catch (e) {
      next(e);
    }
  };

  delete = async (
    req: AuthRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    try {
      const woordenschatWoord = await this.woordenschatWoordService.delete(
        parseInt(req.params.id)
      );
      if (!woordenschatWoord) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
