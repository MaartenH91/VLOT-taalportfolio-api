import { NextFunction, Response } from "express";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import { CheckTeacherClasses } from "../../utils";
import FoutenanalyseFoutService from "../FoutenanalyseFout/FoutenanalyseFout.service";
import UserService from "../User/User.service";
import FoutenanalyseOnderdeelService from "./FoutenanalyseOnderdeel.service";
import { FoutenanalyseOnderdeelBody } from "./FoutenanalyseOnderdeel.types";

export default class FoutenanalyseOnderdeelController {
  private foutenanalyseOnderdeelService: FoutenanalyseOnderdeelService;
  private foutenanalyseFoutService: FoutenanalyseFoutService;
  private userService: UserService;

  constructor() {
    this.foutenanalyseOnderdeelService = new FoutenanalyseOnderdeelService();
    this.foutenanalyseFoutService = new FoutenanalyseFoutService();
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

    const foutenanalyseOnderdelen =
      await this.foutenanalyseOnderdeelService.all({ ...req.body });
    return res.json(foutenanalyseOnderdelen);
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

    const foutenanalyseOnderdelen =
      await this.foutenanalyseOnderdeelService.byStudent(req.params.id);
    return res.json(foutenanalyseOnderdelen);
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

    const foutenanalyseOnderdelen =
      await this.foutenanalyseOnderdeelService.byClass(req.params.id);
    return res.json(foutenanalyseOnderdelen);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const foutenanalyseOnderdeel =
      await this.foutenanalyseOnderdeelService.findOne(req.params.id);

    if (!foutenanalyseOnderdeel) {
      next(new NotFoundError());
    }
    return res.json(foutenanalyseOnderdeel);
  };

  create = async (
    req: AuthRequest<{}, {}, FoutenanalyseOnderdeelBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    const { body } = req;

    if (req.user.isStudent()) {
      body.leerling = req.user;
    }

    const foutenanalyseOnderdeel =
      await this.foutenanalyseOnderdeelService.create(body);

    return res.json(foutenanalyseOnderdeel);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, FoutenanalyseOnderdeelBody>,
    res: Response,
    next: NextFunction
  ) => {
    let { body } = req;
    body.id = parseInt(req.params.id);

    if (req.user.isTeacher()) {
      const foutenanalyseOnderdeel =
        await this.foutenanalyseOnderdeelService.findOne(
          parseInt(req.params.id)
        );
      body = { ...foutenanalyseOnderdeel, feedback: body.feedback };
    }

    if (req.user.isStudent()) {
      const foutenanalyseOnderdeel =
        await this.foutenanalyseOnderdeelService.findOne(
          parseInt(req.params.id)
        );
      body.feedback = foutenanalyseOnderdeel.feedback;
    }

    try {
      const foutenanalyseOnderdeel =
        await this.foutenanalyseOnderdeelService.update(
          parseInt(req.params.id),
          req.body
        );
      if (!foutenanalyseOnderdeel) {
        next(new NotFoundError());
      }
      return res.json(foutenanalyseOnderdeel);
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
      const foutenanalyseFouten = await this.foutenanalyseFoutService.byOnderdeel(parseInt(req.params.id));
      foutenanalyseFouten.forEach((element) => {
        this.foutenanalyseFoutService.delete(element.id);
      });

      const foutenanalyseOnderdeel =
        await this.foutenanalyseOnderdeelService.delete(
          parseInt(req.params.id)
        );
      if (!foutenanalyseOnderdeel) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
