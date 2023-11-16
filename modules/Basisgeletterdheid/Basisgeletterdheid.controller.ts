import { NextFunction, Response } from "express";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import BasisgeletterdheidLeerlingService from "../BasisgeletterdheidLeerling/BasisgeletterdheidLeerling.service";
import UserService from "../User/User.service";
import BasisgeletterdheidService from "./Basisgeletterdheid.service";
import { BasisgeletterdheidBody } from "./Basisgeletterdheid.types";

export default class BasisgeletterdheidController {
  private basisgeletterdheidService: BasisgeletterdheidService;
  private basisgeletterdheidLeerlingService: BasisgeletterdheidLeerlingService;
  private userService: UserService;

  constructor() {
    this.basisgeletterdheidService = new BasisgeletterdheidService();
    this.basisgeletterdheidLeerlingService =
      new BasisgeletterdheidLeerlingService();
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

    const basisgeletterdheden = await this.basisgeletterdheidService.all({
      ...req.body,
    });
    return res.json(basisgeletterdheden);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const basisgeletterdheid = await this.basisgeletterdheidService.findOne(
      req.params.id
    );

    if (!basisgeletterdheid) {
      next(new NotFoundError());
    }
    return res.json(basisgeletterdheid);
  };

  create = async (
    req: AuthRequest<{}, {}, BasisgeletterdheidBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const { body } = req;

    const basisgeletterdheid = await this.basisgeletterdheidService.create(
      body
    );

    const leerlingen = await this.userService.students();

    this.fillInBasisgeletterdheden(leerlingen, basisgeletterdheid);

    return res.json(basisgeletterdheid);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, BasisgeletterdheidBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const basisgeletterdheid = await this.basisgeletterdheidService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!basisgeletterdheid) {
        next(new NotFoundError());
      }
      return res.json(basisgeletterdheid);
    } catch (e) {
      next(e);
    }
  };

  delete = async (
    req: AuthRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const basisgeletterdheidleerlingen =
      await this.basisgeletterdheidLeerlingService.byBasisgeletterdheid(
        parseInt(req.params.id)
      );

    try {
      basisgeletterdheidleerlingen.forEach(
        async (basisgeletterdheidleerling) => {
          await this.basisgeletterdheidLeerlingService.delete(
            basisgeletterdheidleerling.id
          );
        }
      );
      const basisgeletterdheid = await this.basisgeletterdheidService.delete(
        parseInt(req.params.id)
      );
      if (!basisgeletterdheid) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };

  fillInBasisgeletterdheden = async (leerlingen, basisgeletterdheid) => {
    // If there is new basisgeletterdheid,
    // insert an empty answer to all the students who are in the class with the new basisgeletterdheid
    leerlingen.forEach(async (leerling) => {
      await this.basisgeletterdheidLeerlingService.create({
        basisgeletterdheid,
        leerling,
        basisgeletterdheidId: basisgeletterdheid.id,
        leerlingId: leerling.id,
        status: false,
      });
    });
  };
}
