import { NextFunction, Response } from "express";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import { CheckTeacherClasses } from "../../utils";
import UserService from "../User/User.service";
import WoordenschatWoordService from "../WoordenschatWoord/WoordenschatWoord.service";
import WoordenschatOnderdeelService from "./WoordenschatOnderdeel.service";
import { WoordenschatOnderdeelBody } from "./WoordenschatOnderdeel.types";

export default class WoordenschatOnderdeelController {
  private woordenschatOnderdeelService: WoordenschatOnderdeelService;
  private woordenschatWoordService: WoordenschatWoordService;
  private userService: UserService;

  constructor() {
    this.woordenschatOnderdeelService = new WoordenschatOnderdeelService();
    this.woordenschatWoordService = new WoordenschatWoordService();
    this.userService = new UserService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const woordenschatOnderdelen = await this.woordenschatOnderdeelService.all({
      ...req.body,
    });
    return res.json(woordenschatOnderdelen);
  };

  byStudent = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      req.params.id = req.user.id;
    }

    if (req.user.isTeacher()) {
      const klasId = (await this.userService.findOne(req.params.id)).klas.id;
      if (!(await CheckTeacherClasses(req.user.id, klasId))) {
        next(new ForbiddenError());
      }
    }

    const woordenschatOnderdelen =
      await this.woordenschatOnderdeelService.byStudent(req.params.id);
    return res.json(woordenschatOnderdelen);
  };

  byClass = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    if (req.user.isTeacher()) {
      if (!(await CheckTeacherClasses(req.user.id, req.params.id))) {
        next(new ForbiddenError());
      }
    }

    const woordenschatOnderdelen =
      await this.woordenschatOnderdeelService.byClass(req.params.id);
    return res.json(woordenschatOnderdelen);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const woordenschatOnderdeel =
      await this.woordenschatOnderdeelService.findOne(req.params.id);

    if (!woordenschatOnderdeel) {
      next(new NotFoundError());
    }
    return res.json(woordenschatOnderdeel);
  };

  create = async (
    req: AuthRequest<{}, {}, WoordenschatOnderdeelBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    const { body } = req;

    const woordenschatOnderdeel =
      await this.woordenschatOnderdeelService.create(body);

    return res.json(woordenschatOnderdeel);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, WoordenschatOnderdeelBody>,
    res: Response,
    next: NextFunction
  ) => {
    let { body } = req;
    body.id = parseInt(req.params.id);

    if (req.user.isTeacher()) {
      const woordenschatOnderdeel =
        await this.woordenschatOnderdeelService.findOne(
          parseInt(req.params.id)
        );
      body = { ...woordenschatOnderdeel, feedback: body.feedback };
    }

    if (req.user.isStudent()) {
      const woordenschatOnderdeel =
        await this.woordenschatOnderdeelService.findOne(
          parseInt(req.params.id)
        );
      body.feedback = woordenschatOnderdeel.feedback;
    }

    try {
      const woordenschatOnderdeel =
        await this.woordenschatOnderdeelService.update(
          parseInt(req.params.id),
          req.body
        );
      if (!woordenschatOnderdeel) {
        next(new NotFoundError());
      }
      return res.json(woordenschatOnderdeel);
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
      const woorden = await this.woordenschatWoordService.byOnderdeel(parseInt(req.params.id));
      woorden.forEach(async woord => {
        await this.woordenschatWoordService.delete(woord.id);
      });

      const woordenschatOnderdeel =
        await this.woordenschatOnderdeelService.delete(parseInt(req.params.id));
      if (!woordenschatOnderdeel) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
