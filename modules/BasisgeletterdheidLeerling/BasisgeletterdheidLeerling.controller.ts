import { NextFunction, Response } from "express";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import { CheckTeacherClasses } from "../../utils";
import KlasService from "../Klas/Klas.service";
import UserService from "../User/User.service";
import BasisgeletterdheidLeerlingService from "./BasisgeletterdheidLeerling.service";
import { BasisgeletterdheidLeerlingBody } from "./BasisgeletterdheidLeerling.types";

export default class BasisgeletterdheidLeerlingController {
  private basisgeletterdheidLeerlingService: BasisgeletterdheidLeerlingService;
  private userService: UserService;
  private klasService: KlasService;

  constructor() {
    this.basisgeletterdheidLeerlingService =
      new BasisgeletterdheidLeerlingService();
    this.userService = new UserService();
    this.klasService = new KlasService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const basisgeletterdheidLeerlingen =
      await this.basisgeletterdheidLeerlingService.all({ ...req.body });
    return res.json(basisgeletterdheidLeerlingen);
  };

  byStudent = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      req.params.id = req.user.id;
    }

    const leerling = await this.userService.findOne(req.params.id);

    if (req.user.isTeacher()) {
      const valid = await CheckTeacherClasses(req.user.id, leerling.klas.id);
      if (!valid) {
        return new ForbiddenError();
      }
    }

    const basisgeletterdheidLeerlingen =
      await this.basisgeletterdheidLeerlingService.byStudent(req.params.id);
    return res.json(basisgeletterdheidLeerlingen);
  };

  byClass = async (
    req: AuthRequest<{ klas: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const klas = await this.klasService.findOneBy({ klas: req.params.klas });

    const basisgeletterdheidLeerlingen =
      await this.basisgeletterdheidLeerlingService.byClass(klas.id);
    return res.json(basisgeletterdheidLeerlingen);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const basisgeletterdheidLeerling =
      await this.basisgeletterdheidLeerlingService.findOne(req.params.id);

    if (!basisgeletterdheidLeerling) {
      next(new NotFoundError());
    }
    return res.json(basisgeletterdheidLeerling);
  };

  create = async (
    req: AuthRequest<{}, {}, BasisgeletterdheidLeerlingBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const { body } = req;

    const basisgeletterdheidLeerling =
      await this.basisgeletterdheidLeerlingService.create(body);
    return res.json(basisgeletterdheidLeerling);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, BasisgeletterdheidLeerlingBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const basisgeletterdheidLeerling =
        await this.basisgeletterdheidLeerlingService.update(
          parseInt(req.params.id),
          req.body
        );
      if (!basisgeletterdheidLeerling) {
        next(new NotFoundError());
      }
      return res.json(basisgeletterdheidLeerling);
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
      const basisgeletterdheidLeerling =
        await this.basisgeletterdheidLeerlingService.delete(
          parseInt(req.params.id)
        );
      if (!basisgeletterdheidLeerling) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
