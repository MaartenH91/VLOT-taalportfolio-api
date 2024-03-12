import { NextFunction, Response } from "express";
import ForbiddenError from "../../errors/ForbiddenError";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import { CheckTeacherClasses } from "../../utils";
import BasisgeletterdheidService from "../Basisgeletterdheid/Basisgeletterdheid.service";
import BasisgeletterdheidLeerlingService from "../BasisgeletterdheidLeerling/BasisgeletterdheidLeerling.service";
import KlasService from "../Klas/Klas.service";
import TaalprofielAntwoordService from "../TaalprofielAntwoord/TaalprofielAntwoord.service";
import TaalprofielVraagService from "../TaalprofielVraag/TaalprofielVraag.service";
import { UserRole } from "./User.constants";
import UserService from "./User.service";
import { UserBody } from "./User.types";

export default class UserController {
  private userService: UserService;
  private taalprofielVraagService: TaalprofielVraagService;
  private taalprofielAntwoordService: TaalprofielAntwoordService;
  private basisgeletterdheidLeerlingService: BasisgeletterdheidLeerlingService;
  private basisgeletterdheidService: BasisgeletterdheidService;
  private klasService: KlasService;

  constructor() {
    this.userService = new UserService();
    this.taalprofielVraagService = new TaalprofielVraagService();
    this.taalprofielAntwoordService = new TaalprofielAntwoordService();
    this.basisgeletterdheidLeerlingService =
      new BasisgeletterdheidLeerlingService();
    this.basisgeletterdheidService = new BasisgeletterdheidService();
    this.klasService = new KlasService();
  }

  all = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("before check")
    if (!req.user.isAdmin()) {
      console.log("check failed")
      return new ForbiddenError();
    }
    const users = await this.userService.all({ ...req.body });
    console.log(users)
    return res.json(users);
  };

  allTeachers = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }
    const teachers = await this.userService.teachers();
    return res.json(teachers);
  };

  allStudents = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }
    const students = await this.userService.students();
    return res.json(students);
  };

  allStudentsByClass = async (
    req: AuthRequest<{ id: number }, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const { params } = req;

    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    if (req.user.isTeacher()) {
      if (!(await CheckTeacherClasses(req.user.id, req.params.id))) {
        next(new ForbiddenError());
      }
    }

    const students = await this.userService.studentsByClass(params.id);
    return res.json(students);
  };

  allStudentsByClassName = async (
    req: AuthRequest<{ klas: string }, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const { params } = req;

    if (req.user.isStudent()) {
      return new ForbiddenError();
    }

    const klas = await this.klasService.findOneBy({ klas: params.klas });

    if (req.user.isTeacher()) {
      if (!(await CheckTeacherClasses(req.user.id, klas.id))) {
        next(new ForbiddenError());
      }
    }

    const students = await this.userService.studentsByClassName(params.klas);
    return res.json(students);
  };

  // byStudentName = async (
  //   req: AuthRequest<{ student: string }, {}, {}>,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const { params } = req;

  //   if (req.user.isStudent()) {
  //     return new ForbiddenError();
  //   }

  //   // const firstName = params.student.split(" ")[0];
  //   // const lastName = params.student.split(" ")[1];

  //   // console.log(firstName);
  //   // console.log(lastName);

  //   const students = await this.userService.byStudentName(student);
  //   return res.json(students);
  // };

  find = async (
    req: AuthRequest<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    // Students cannot see info of other users
    if (req.user.isStudent()) {
      req.params.id = req.user.id;
    }

    let user: UserBody;
    user = await this.userService.findOne(req.params.id);

    // If the user is a teacher and the found user is also a teacher or an admin
    // than forbid them from viewing the info
    if (req.user.isTeacher) {
      if (user.rol === UserRole.Teacher || user.rol === UserRole.Admin) {
        req.params.id = req.user.id;
        user = await this.userService.findOne(req.params.id);
      }
    }

    if (!user) {
      next(new NotFoundError());
    }
    return res.json(user);
  };

  create = async (
    req: AuthRequest<{}, {}, UserBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.rol = body.rol;

    const user = await this.userService.create(body);

    if (user.rol === UserRole.Student) {
      //create a empty answer for every question for the student
      const questions = await this.taalprofielVraagService.all({});
      const basisgeletterdheden = await this.basisgeletterdheidService.all({});
      this.fillInTaalprofielAntwoorden(questions, user);
      this.fillInBasisgeletterdheidLeerlingen(basisgeletterdheden, user);
    }
    return res.json(user);
  };

  update = async (
    req: AuthRequest<{ id: string }, {}, UserBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user.isAdmin()) {
      return new ForbiddenError();
    }

    const { body } = req;
    body.id = parseInt(req.params.id);

    try {
      const user = await this.userService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!user) {
        next(new NotFoundError());
      }
      return res.json(user);
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
      const user = await this.userService.delete(parseInt(req.params.id));
      if (!user) {
        next(new NotFoundError());
      }
      return res.json({});
    } catch (e) {
      next(e);
    }
  };

  fillInTaalprofielAntwoorden = (questions, leerling) => {
    questions.forEach(async (question) => {
      for (let jaar = 0; jaar < 3; jaar++) {
        await this.taalprofielAntwoordService.create({
          antwoord: "",
          vraagId: question.id,
          vraag: question,
          leerlingId: leerling.id,
          leerling,
          jaar,
        });
      }
    });
  };

  fillInBasisgeletterdheidLeerlingen = (basisgeletterdheden, leerling) => {
    basisgeletterdheden.forEach(async (basisgeletterdheid) => {
      await this.basisgeletterdheidLeerlingService.create({
        status: false,
        basisgeletterdheidId: basisgeletterdheid.id,
        basisgeletterdheid,
        leerlingId: leerling.id,
        leerling,
      });
    });
  };
}
