import { NextFunction, Response } from "express";
import { TaalOptions, VaardigheidOptions } from "../../constants";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import KlasService from "../Klas/Klas.service";
import TaaltipLeerlingService from "../TaaltipLeerling/TaaltipLeerling.service";
import TaaltipService from "./Taaltip.service";
import { TaaltipBody } from "./Taaltip.types";

export default class TaaltipController {
  private taaltipService: TaaltipService;
  private klasService: KlasService;
  private TaaltipsLeerlingService: TaaltipLeerlingService;

  constructor() {
    this.taaltipService = new TaaltipService();
    this.klasService = new KlasService();
    this.TaaltipsLeerlingService = new TaaltipLeerlingService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const taaltips = await this.taaltipService.all({ ...req.body });
    return res.json(taaltips);
  };

  allByClass = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const taaltips = await this.taaltipService.byClass(req.params.id);
    return res.json(taaltips);
  };

  allByLanguage = async (
    req: AuthRequest<{ language: TaalOptions }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const taaltips = await this.taaltipService.byLanguage(req.params.language);
    return res.json(taaltips);
  };

  allBySkill = async (
    req: AuthRequest<{ skill: VaardigheidOptions }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const taaltips = await this.taaltipService.bySkill(req.params.skill);
    return res.json(taaltips);
  };

  allByClassLanguageSkill = async (
    req: AuthRequest<{
      id: number;
      language: TaalOptions;
      skill: VaardigheidOptions;
    }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const { id, language, skill } = req.params;
    const taaltips = await this.taaltipService.byClassLanguageSkill(
      id,
      language,
      skill
    );
    return res.json(taaltips);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const taaltip = await this.taaltipService.findOne(req.params.id);

    if (!taaltip) {
      next(new NotFoundError());
    }
    return res.json(taaltip);
  };

  create = async (
    req: AuthRequest<{}, {}, TaaltipBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const { body } = req;
    let taaltip: TaaltipBody;

    // This is only if 1 class is given.
    if (body.klas) {
      const leerlingen = (await this.klasService.findOne(body.klas.id))
        .leerlingen;
      taaltip = await this.taaltipService.create(body);
      await this.fillInTaaltips(leerlingen, taaltip);
      // This is only if more than 1 class is given.
    } else {
      const klassen = await this.klasService.byTeacher(req.user.id);
      klassen.forEach(async (klas) => {
        body.klas = klas;
        taaltip = await this.taaltipService.create(body);
        const leerlingen = (await this.klasService.findOne(klas.id)).leerlingen;
        await this.fillInTaaltips(leerlingen, taaltip);
      });
    }

    return res.json(taaltip);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, TaaltipBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const taaltip = await this.taaltipService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!taaltip) {
        next(new NotFoundError());
      }
      return res.json(taaltip);
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

    try {
      const taaltip = await this.taaltipService.delete(parseInt(req.params.id));
      if (!taaltip) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };

  fillInTaaltips = async (leerlingen, taaltip) => {
    // If there is new taaltip,
    // insert an empty answer to all the students who are in the class with the new taaltip
    leerlingen.forEach(async (leerling) => {
      await this.TaaltipsLeerlingService.create({
        taaltip,
        leerling,
        taaltipId: taaltip.id,
        leerlingId: leerling.id,
        antwoord: "-",
      });
    });
  };
}
