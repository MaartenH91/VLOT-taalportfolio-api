import { NextFunction, Response } from "express";
import { TaalOptions } from "../../constants";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import TaalprofielAntwoordService from "../TaalprofielAntwoord/TaalprofielAntwoord.service";
import TaalprofielVraagService from "../TaalprofielVraag/TaalprofielVraag.service";
import UserService from "../User/User.service";
import AndereTaalService from "./AndereTaal.service";
import { AndereTaalBody } from "./AndereTaal.types";

export default class AndereTaalController {
  private andereTaalService: AndereTaalService;
  private userService: UserService;
  private taalprofielAntwoordService: TaalprofielAntwoordService;
  private taalprofielVraagService: TaalprofielVraagService;

  constructor() {
    this.andereTaalService = new AndereTaalService();
    this.userService = new UserService();
    this.taalprofielAntwoordService = new TaalprofielAntwoordService();
    this.taalprofielVraagService = new TaalprofielVraagService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const andereTalen = await this.andereTaalService.all({ ...req.body });
    return res.json(andereTalen);
  };

  byStudent = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      req.params.id = req.user.id;
    }

    const andereTalen = await this.andereTaalService.byStudent(req.params.id);
    return res.json(andereTalen);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const andereTaal = await this.andereTaalService.findOne(req.params.id);

    if (!andereTaal) {
      next(new NotFoundError());
    }
    return res.json(andereTaal);
  };

  create = async (
    req: AuthRequest<{}, {}, AndereTaalBody>,
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

    const andereTaal = await this.andereTaalService.create(body);

    const taalprofielVragen = await this.taalprofielVraagService.byLanguage(
      TaalOptions.Other
    );

    taalprofielVragen.forEach(async (vraag) => {
      for (let jaar = 1; jaar < 3; jaar++) {
        await this.taalprofielAntwoordService.create({
          antwoord: "",
          vraagId: vraag.id,
          vraag: vraag,
          leerlingId: req.user.id,
          leerling: req.user,
          jaar,
          andereTaalId: andereTaal.id,
          andereTaal,
        });
      }
    });

    return res.json(andereTaal);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, AndereTaalBody>,
    res: Response,
    next: NextFunction
  ) => {
    let { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const andereTaal = await this.andereTaalService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!andereTaal) {
        next(new NotFoundError());
      }
      return res.json(andereTaal);
    } catch (e) {
      next(e);
    }
  };

  delete = async (
    req: AuthRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    let studentId: number;
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    if (req.user.isStudent()) {
      studentId = req.user.id;
    }

    let andereTaal = await this.andereTaalService.findOne(
      parseInt(req.params.id)
    );

    try {
      const taalprofielAntwoorden =
        await this.taalprofielAntwoordService.byOtherLanguage(
          studentId,
          andereTaal.taal
        );
      taalprofielAntwoorden.forEach(async (element) => {
        await this.taalprofielAntwoordService.delete(element.id);
      });

      andereTaal = await this.andereTaalService.delete(parseInt(req.params.id));
      if (!andereTaal) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
