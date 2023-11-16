import { NextFunction, Response } from "express";
import { GradeOptions } from "../../constants";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import { CheckTeacherClasses } from "../../utils";
import KlasLeerkrachtService from "../KlasLeerkracht/KlasLeerkracht.service";
import TaaltipService from "../Taaltip/Taaltip.service";
import UserService from "../User/User.service";
import KlasService from "./Klas.service";
import { KlasBody } from "./Klas.types";

export default class KlasController {
  private klasService: KlasService;
  private klasLeerkrachtService: KlasLeerkrachtService;
  private taaltipsService: TaaltipService;
  private userService: UserService;

  constructor() {
    this.klasService = new KlasService();
    this.klasLeerkrachtService = new KlasLeerkrachtService();
    this.taaltipsService = new TaaltipService();
    this.userService = new UserService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const klassen = await this.klasService.all({ ...req.body });
    return res.json(klassen);
  };

  allByGrade = async (
    req: AuthRequest<{ grade: GradeOptions }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const klassen = await this.klasService.byGrade(req.params.grade);
    return res.json(klassen);
  };

  allByTeacher = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    if (req.user.isTeacher()) {
      req.params.id = req.user.id;
    }

    const klassen = await this.klasService.byTeacher(req.params.id);
    return res.json(klassen);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    // Students cannot see info of other classes
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    if (req.user.isTeacher()) {
      if(!await CheckTeacherClasses(req.user.id, req.params.id)) {
        next(new ForbiddenError());
      }
    }

    const klas = await this.klasService.findOne(req.params.id);

    if (!klas) {
      next(new NotFoundError());
    }
    return res.json(klas);
  };

  create = async (
    req: AuthRequest<{}, {}, KlasBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const { body } = req;

    const klas = await this.klasService.create(body);
    return res.json(klas);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, KlasBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const klas = await this.klasService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!klas) {
        next(new NotFoundError());
      }
      return res.json(klas);
    } catch (e) {
      next(e);
    }
  };

  delete = async (
    req: AuthRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    try {
      const klasLeerkracht = await this.klasLeerkrachtService.byClass(parseInt(req.params.id));
      klasLeerkracht.forEach(async (klasLeerkracht) => {
        await this.klasLeerkrachtService.delete(klasLeerkracht.id);
      });

      const taaltips = await this.taaltipsService.byClass(parseInt(req.params.id));
      taaltips.forEach(async (taaltip) => {
        await this.taaltipsService.delete(taaltip.id);
      });

      const leerlingen = await this.userService.studentsByClass(parseInt(req.params.id));
      leerlingen.forEach(async (leerling) => {
        await this.userService.update(leerling.id ,{ ...leerling, klas: null });
      });

      const klas = await this.klasService.delete(parseInt(req.params.id));
      if (!klas) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
