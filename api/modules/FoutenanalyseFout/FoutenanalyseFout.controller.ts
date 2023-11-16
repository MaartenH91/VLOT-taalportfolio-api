import { NextFunction, Response } from "express";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import FoutenanalyseFoutService from "./FoutenanalyseFout.service";
import { FoutenanalyseFoutBody } from "./FoutenanalyseFout.types";

export default class FoutenanalyseFoutenController {
  private foutenanalyseFoutService: FoutenanalyseFoutService;

  constructor() {
    this.foutenanalyseFoutService = new FoutenanalyseFoutService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const foutenanalyseFouten = await this.foutenanalyseFoutService.all({
      ...req.body,
    });
    return res.json(foutenanalyseFouten);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const foutenanalyseFout = await this.foutenanalyseFoutService.findOne(
      req.params.id
    );

    if (!foutenanalyseFout) {
      next(new NotFoundError());
    }
    return res.json(foutenanalyseFout);
  };

  create = async (
    req: AuthRequest<{}, {}, FoutenanalyseFoutBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    const { body } = req;

    const foutenanalyseFout = await this.foutenanalyseFoutService.create(body);

    return res.json(foutenanalyseFout);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, FoutenanalyseFoutBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const foutenanalyseFout = await this.foutenanalyseFoutService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!foutenanalyseFout) {
        next(new NotFoundError());
      }
      return res.json(foutenanalyseFout);
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
      const foutenanalyseFout = await this.foutenanalyseFoutService.delete(
        parseInt(req.params.id)
      );
      if (!foutenanalyseFout) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
