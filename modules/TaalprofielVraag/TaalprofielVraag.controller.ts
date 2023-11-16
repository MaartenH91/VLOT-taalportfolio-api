import { isArray, isNotEmpty } from "class-validator";
import { NextFunction, Response } from "express";
import { GradeOptions, TaalOptions } from "../../constants";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import TaalprofielAntwoordService from "../TaalprofielAntwoord/TaalprofielAntwoord.service";
import UserService from "../User/User.service";
import TaalprofielVraagService from "./TaalprofielVraag.service";
import { TaalprofielVraagBody } from "./TaalprofielVraag.types";

export default class TaalprofielVraagController {
  private taalprofielVraagService: TaalprofielVraagService;
  private taalprofielAntwoordService: TaalprofielAntwoordService;
  private userService: UserService;

  constructor() {
    this.taalprofielVraagService = new TaalprofielVraagService();
    this.taalprofielAntwoordService = new TaalprofielAntwoordService();
    this.userService = new UserService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const taalprofielVragen = await this.taalprofielVraagService.all({
      ...req.body,
    });
    return res.json(taalprofielVragen);
  };

  allByGrade = async (
    req: AuthRequest<{ grade: GradeOptions }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const taalprofielVragen = await this.taalprofielVraagService.byGrade(
      req.params.grade
    );
    return res.json(taalprofielVragen);
  };

  allByLanguage = async (
    req: AuthRequest<{ language: TaalOptions }>,
    res: Response,
    next: NextFunction
  ) => {
    const taalprofielVragen = await this.taalprofielVraagService.byLanguage(
      req.params.language
    );
    return res.json(taalprofielVragen);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const taalprofielVraag = await this.taalprofielVraagService.findOne(
      req.params.id
    );

    if (!taalprofielVraag) {
      next(new NotFoundError());
    }
    return res.json(taalprofielVraag);
  };

  create = async (
    req: AuthRequest<{}, {}, TaalprofielVraagBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const { body } = req;

    const taalprofielVraag = await this.taalprofielVraagService.create(body);
    let leerlingen;

    if (taalprofielVraag.taal === TaalOptions.Other) {
      leerlingen = await this.userService.all({
        andereTalen: isNotEmpty,
      });
    } else {
      leerlingen = await this.userService.students();
    }

    await this.fillInTaalprofielVragen(leerlingen, taalprofielVraag);

    return res.json(taalprofielVraag);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, TaalprofielVraagBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const taalprofielVraag = await this.taalprofielVraagService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!taalprofielVraag) {
        next(new NotFoundError());
      }
      return res.json(taalprofielVraag);
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
      const antwoorden = await this.taalprofielAntwoordService.byQuestion(
        parseInt(req.params.id)
      );
      antwoorden.forEach(async (antwoord) => {
        await this.taalprofielAntwoordService.delete(antwoord.id);
      });

      const taalprofielVraag = await this.taalprofielVraagService.delete(
        parseInt(req.params.id)
      );
      if (!taalprofielVraag) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };

  fillInTaalprofielVragen = async (leerlingen, taalprofielVraag) => {
    leerlingen.forEach(async (leerling) => {
      if (leerling.andereTalen?.length > 0) {
        for (let index = 0; index < leerling.andereTalen.length; index++) {
          for (let jaar = 1; jaar < 3; jaar++) {
            await this.taalprofielAntwoordService.create({
              antwoord: "",
              vraagId: taalprofielVraag.id,
              vraag: taalprofielVraag,
              leerlingId: leerling.id,
              leerling,
              jaar,
              andereTaal: leerling.andereTalen[index],
              andereTaalId: leerling.andereTalen[index].id,
            });
          }
        }
      } else {
        for (let jaar = 1; jaar < 3; jaar++) {
          await this.taalprofielAntwoordService.create({
            antwoord: "",
            vraagId: taalprofielVraag.id,
            vraag: taalprofielVraag,
            leerlingId: leerling.id,
            leerling,
            jaar,
          });
        }
      }
    });
  };
}
