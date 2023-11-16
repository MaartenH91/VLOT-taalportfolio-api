import { NextFunction, Response } from "express";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import { CheckTeacherClasses } from "../../utils";
import UserService from "../User/User.service";
import VaardighedenEvaluatieService from "../VaardighedenEvaluatie/VaardighedenEvaluatie.service";
import VaardighedenOnderdeelService from "./VaardighedenOnderdeel.service";
import { VaardighedenOnderdeelBody } from "./VaardighedenOnderdeel.types";

export default class VaardighedenOnderdeelController {
  private vaardighedenOnderdeelService: VaardighedenOnderdeelService;
  private userService: UserService;
  private vaardighedenEvaluatieService: VaardighedenEvaluatieService;

  constructor() {
    this.vaardighedenOnderdeelService = new VaardighedenOnderdeelService();
    this.vaardighedenEvaluatieService = new VaardighedenEvaluatieService();
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

    const vaardighedenOnderdelen = await this.vaardighedenOnderdeelService.all({ ...req.body });
    return res.json(vaardighedenOnderdelen);
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

    const vaardighedenOnderdelen =
      await this.vaardighedenOnderdeelService.byStudent(req.params.id);
    return res.json(vaardighedenOnderdelen);
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

    const vaardighedenOnderdelen =
      await this.vaardighedenOnderdeelService.byClass(req.params.id);
    return res.json(vaardighedenOnderdelen);
  };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const vaardighedenOnderdeel = await this.vaardighedenOnderdeelService.findOne(req.params.id);

    if (!vaardighedenOnderdeel) {
      next(new NotFoundError());
    }
    return res.json(vaardighedenOnderdeel);
  };

  create = async (
    req: AuthRequest<{}, {}, VaardighedenOnderdeelBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user.isTeacher()) {
      return new ForbiddenError();
    }

    const { body } = req;

    const vaardighedenOnderdeel = await this.vaardighedenOnderdeelService.create(body);

    return res.json(vaardighedenOnderdeel);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, VaardighedenOnderdeelBody>,
    res: Response,
    next: NextFunction
  ) => {
    let { body } = req;
    body.id = parseInt(req.params.id);

    
    if (req.user.isTeacher()) {
      const vaardighedenOnderdeel =
        await this.vaardighedenOnderdeelService.findOne(
          parseInt(req.params.id)
        );
      body = { ...vaardighedenOnderdeel, feedback: body.feedback };
    }

    if (req.user.isStudent()) {
      const vaardighedenOnderdeel =
        await this.vaardighedenOnderdeelService.findOne(
          parseInt(req.params.id)
        );
      body.feedback = vaardighedenOnderdeel.feedback;
    }

    try {
      const vaardighedenOnderdeel = await this.vaardighedenOnderdeelService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!vaardighedenOnderdeel) {
        next(new NotFoundError());
      }
      return res.json(vaardighedenOnderdeel);
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
      const evaluaties = await this.vaardighedenEvaluatieService.byOnderdeel(parseInt(req.params.id));
      evaluaties.forEach(async (evaluatie) => {
        await this.vaardighedenEvaluatieService.delete(evaluatie.id);
      });

      const vaardighedenOnderdeel = await this.vaardighedenOnderdeelService.delete(parseInt(req.params.id));
      if (!vaardighedenOnderdeel) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };
}
