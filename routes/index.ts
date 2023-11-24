import { NextFunction, Request, Response, Router } from "express";
import * as express from "express";
import * as path from "path";
import NotFoundError from "../errors/NotFoundError";
import { authJwt, authLocal, withRole } from "../middleware/auth";
import AndereTaalController from "../modules/AndereTaal/AndereTaal.controller";
import BasisgeletterdheidController from "../modules/Basisgeletterdheid/Basisgeletterdheid.controller";
import BasisgeletterdheidLeerlingController from "../modules/BasisgeletterdheidLeerling/BasisgeletterdheidLeerling.controller";
import FoutenanalyseFoutenController from "../modules/FoutenanalyseFout/FoutenanalyseFout.controller";
import FoutenanalyseOnderdeelController from "../modules/FoutenanalyseOnderdeel/FoutenanalyseOnderdeel.controller";
import KlasController from "../modules/Klas/Klas.controller";
import KlasLeerkrachtController from "../modules/KlasLeerkracht/KlasLeerkracht.controller";
import TaalprofielAntwoordController from "../modules/TaalprofielAntwoord/TaalprofielAntwoord.controller";
import TaalprofielVraagController from "../modules/TaalprofielVraag/TaalprofielVraag.controller";
import TaaltipController from "../modules/Taaltip/Taaltip.controller";
import TaaltipLeerlingController from "../modules/TaaltipLeerling/TaaltipLeerling.controller";
import AuthController from "../modules/User/Auth.controller";
import { UserRole } from "../modules/User/User.constants";
import UserController from "../modules/User/User.controller";
import VaardighedenCriteriaController from "../modules/VaardighedenCriteria/VaardighedenCriteria.controller";
import VaardighedenEvaluatieController from "../modules/VaardighedenEvaluatie/VaardighedenEvaluatie.controller";
import VaardighedenOnderdeelController from "../modules/VaardighedenOnderdeel/VaardighedenOnderdeel.controller";
import WoordenschatOnderdeelController from "../modules/WoordenschatOnderdeel/WoordenschatOnderdeel.controller";
import WoordenschatWoordController from "../modules/WoordenschatWoord/WoordenschatWoord.controller";

// wrapper for error handling
const useMethod =
  (func: (req: any, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("try?")
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };

// Routes that are not protected by authJWT
const registerOnboardingRoutes = (router: Router) => {
  // Register onboarding routes
  const authController = new AuthController();
  router.post("/login", authLocal, useMethod(authController.login));
};

const registerAuthenticatedRoutes = (router: Router) => {
  const authRouter = Router();

  // Teacher routes
  registerTeacherRoutes(authRouter);

  // Student routes
  registerStudentRoutes(authRouter);

  // Admin routes
  registerAdminRoutes(authRouter);

  // Authenticated routes use authJWT
  router.use(authJwt, authRouter);
};

const registerAdminRoutes = (router: Router) => {
  const adminRouter = Router();

  // Register admin routes
  const userController = new UserController();
  adminRouter.get("/users", useMethod(userController.all));
  adminRouter.get("/teachers", useMethod(userController.allTeachers));
  adminRouter.get("/students", useMethod(userController.allStudents));
  adminRouter.get(
    "/students/klas/:id",
    useMethod(userController.allStudentsByClass)
  );
  adminRouter.get("/user/:id", useMethod(userController.find));
  adminRouter.post("/register", useMethod(userController.create));
  adminRouter.patch("/users/:id", useMethod(userController.update));
  adminRouter.delete("/users/:id", useMethod(userController.delete));

  const klasController = new KlasController();
  adminRouter.get("/klassen", useMethod(klasController.all));
  adminRouter.get("/graad/:grade", useMethod(klasController.allByGrade));
  adminRouter.get("/klas/:id", useMethod(klasController.find));
  adminRouter.post("/klas", useMethod(klasController.create));
  adminRouter.patch("/klas/:id", useMethod(klasController.update));
  adminRouter.delete("/klas/:id", useMethod(klasController.delete));

  const taaltipController = new TaaltipController();
  adminRouter.get("/taaltips", useMethod(taaltipController.all));
  adminRouter.get(
    "/taaltips/klas/:id",
    useMethod(taaltipController.allByClass)
  );
  adminRouter.get(
    "/taaltips/vaardigheid/:skill",
    useMethod(taaltipController.allBySkill)
  );
  adminRouter.get(
    "/taaltips/taal/:language",
    useMethod(taaltipController.allByLanguage)
  );
  adminRouter.get(
    "/taaltips/klas/:id/:language/:skill",
    useMethod(taaltipController.allByClassLanguageSkill)
  );
  adminRouter.get("/taaltip/:id", useMethod(taaltipController.find));
  adminRouter.post("/taaltip", useMethod(taaltipController.create));
  adminRouter.patch("/taaltip/:id", useMethod(taaltipController.update));
  adminRouter.delete("/taaltip/:id", useMethod(taaltipController.delete));

  const basisgeletterdheidController = new BasisgeletterdheidController();
  adminRouter.get(
    "/basisgeletterdheden",
    useMethod(basisgeletterdheidController.all)
  );
  adminRouter.post(
    "/basisgeletterdheid",
    useMethod(basisgeletterdheidController.create)
  );
  adminRouter.patch(
    "/basisgeletterdheid/:id",
    useMethod(basisgeletterdheidController.update)
  );
  adminRouter.delete(
    "/basisgeletterdheid/:id",
    useMethod(basisgeletterdheidController.delete)
  );

  const basisgeletterdheidLeerlingController =
    new BasisgeletterdheidLeerlingController();
  adminRouter.get(
    "/basisgeletterdheid/leerlingen",
    useMethod(basisgeletterdheidLeerlingController.all)
  );

  const klasLeerkrachtController = new KlasLeerkrachtController();
  adminRouter.get(
    "/leerkracht/klassen",
    useMethod(klasLeerkrachtController.all)
  );
  adminRouter.get(
    "/leerkracht/klassen/:id",
    useMethod(klasLeerkrachtController.allByClass)
  );
  adminRouter.get(
    "/leerkracht/:id/klassen",
    useMethod(klasLeerkrachtController.allByTeacher)
  );
  adminRouter.get(
    "/leerkracht/klas/:id",
    useMethod(klasLeerkrachtController.find)
  );
  adminRouter.post(
    "/leerkracht/klas",
    useMethod(klasLeerkrachtController.create)
  );
  adminRouter.patch(
    "/leerkracht/klas/:id",
    useMethod(klasLeerkrachtController.update)
  );
  adminRouter.delete(
    "/leerkracht/klas/:id",
    useMethod(klasLeerkrachtController.delete)
  );

  const taalprofielVragenController = new TaalprofielVraagController();
  adminRouter.get(
    "/taalprofiel/vragen",
    useMethod(taalprofielVragenController.all)
  );
  adminRouter.get(
    "/taalprofiel/vragen/graad/:grade",
    useMethod(taalprofielVragenController.allByGrade)
  );
  adminRouter.get(
    "/taalprofiel/vragen/taal/:language",
    useMethod(taalprofielVragenController.allByLanguage)
  );
  adminRouter.get(
    "/taalprofiel/vragen/:id",
    useMethod(taalprofielVragenController.find)
  );
  adminRouter.post(
    "/taalprofiel/vragen",
    useMethod(taalprofielVragenController.create)
  );
  adminRouter.patch(
    "/taalprofiel/vragen/:id",
    useMethod(taalprofielVragenController.update)
  );
  adminRouter.delete(
    "/taalprofiel/vragen/:id",
    useMethod(taalprofielVragenController.delete)
  );

  const taalprofielAntwoordenController = new TaalprofielAntwoordController();
  adminRouter.get(
    "/taalprofiel/antwoorden",
    useMethod(taalprofielAntwoordenController.all)
  );
  adminRouter.get(
    "/taalprofiel/antwoorden/:id",
    useMethod(taalprofielAntwoordenController.find)
  );
  adminRouter.post(
    "/taalprofiel/antwoord",
    useMethod(taalprofielAntwoordenController.create)
  );
  adminRouter.patch(
    "/taalprofiel/antwoorden/:id",
    useMethod(taalprofielAntwoordenController.update)
  );
  adminRouter.delete(
    "/taalprofiel/antwoorden/:id",
    useMethod(taalprofielAntwoordenController.delete)
  );

  const foutenanalyseOnderdeelController =
    new FoutenanalyseOnderdeelController();
  adminRouter.get(
    "/foutenanalyse/onderdelen",
    useMethod(foutenanalyseOnderdeelController.all)
  );
  adminRouter.get(
    "/foutenanalyse/onderdelen/:id",
    useMethod(foutenanalyseOnderdeelController.find)
  );
  adminRouter.post(
    "/foutenanalyse/onderdeel",
    useMethod(foutenanalyseOnderdeelController.create)
  );
  adminRouter.patch(
    "/foutenanalyse/onderdelen/:id",
    useMethod(foutenanalyseOnderdeelController.update)
  );
  adminRouter.delete(
    "/foutenanalyse/onderdelen/:id",
    useMethod(foutenanalyseOnderdeelController.delete)
  );

  const foutenanalyseFoutenController = new FoutenanalyseFoutenController();
  adminRouter.get(
    "/foutenanalyse/fouten",
    useMethod(foutenanalyseFoutenController.all)
  );
  adminRouter.get(
    "/foutenanalyse/fouten/:id",
    useMethod(foutenanalyseFoutenController.find)
  );
  adminRouter.post(
    "/foutenanalyse/fouten",
    useMethod(foutenanalyseFoutenController.create)
  );
  adminRouter.patch(
    "/foutenanalyse/fouten/:id",
    useMethod(foutenanalyseFoutenController.update)
  );
  adminRouter.delete(
    "/foutenanalyse/fouten/:id",
    useMethod(foutenanalyseFoutenController.delete)
  );

  const woordenschatOnderdeelController = new WoordenschatOnderdeelController();
  adminRouter.get(
    "/woordenschat/onderdelen",
    useMethod(woordenschatOnderdeelController.all)
  );
  adminRouter.get(
    "/woordenschat/onderdelen/:id",
    useMethod(woordenschatOnderdeelController.find)
  );
  adminRouter.post(
    "/woordenschat/onderdelen",
    useMethod(woordenschatOnderdeelController.create)
  );
  adminRouter.patch(
    "/woordenschat/onderdelen/:id",
    useMethod(woordenschatOnderdeelController.update)
  );
  adminRouter.delete(
    "/woordenschat/onderdelen/:id",
    useMethod(woordenschatOnderdeelController.delete)
  );

  const woordenschatWoordController = new WoordenschatWoordController();
  adminRouter.get(
    "/woordenschat/woorden",
    useMethod(woordenschatWoordController.all)
  );
  adminRouter.get(
    "/woordenschat/woorden/:id",
    useMethod(woordenschatWoordController.find)
  );
  adminRouter.post(
    "/woordenschat/woorden",
    useMethod(woordenschatWoordController.create)
  );
  adminRouter.patch(
    "/woordenschat/woorden/:id",
    useMethod(woordenschatWoordController.update)
  );
  adminRouter.delete(
    "/woordenschat/woorden/:id",
    useMethod(woordenschatWoordController.delete)
  );

  const vaardighedenCriteriaController = new VaardighedenCriteriaController();
  adminRouter.get(
    "/vaardigheden/criteria",
    useMethod(vaardighedenCriteriaController.all)
  );
  adminRouter.get(
    "/vaardigheden/criteria/:id",
    useMethod(vaardighedenCriteriaController.find)
  );
  adminRouter.post(
    "/vaardigheden/criteria",
    useMethod(vaardighedenCriteriaController.create)
  );
  adminRouter.patch(
    "/vaardigheden/criteria/:id",
    useMethod(vaardighedenCriteriaController.update)
  );
  adminRouter.delete(
    "/vaardigheden/criteria/:id",
    useMethod(vaardighedenCriteriaController.delete)
  );

  const vaardighedenOnderdeelController = new VaardighedenOnderdeelController();
  adminRouter.get(
    "/vaardigheden/onderdelen",
    useMethod(vaardighedenOnderdeelController.all)
  );
  adminRouter.get(
    "/vaardigheden/onderdelen/:id",
    useMethod(vaardighedenOnderdeelController.find)
  );
  adminRouter.post(
    "/vaardigheden/onderdelen",
    useMethod(vaardighedenOnderdeelController.create)
  );
  adminRouter.patch(
    "/vaardigheden/onderdelen/:id",
    useMethod(vaardighedenOnderdeelController.update)
  );
  adminRouter.delete(
    "/vaardigheden/onderdelen/:id",
    useMethod(vaardighedenOnderdeelController.delete)
  );

  const vaardighedenEvaluatieController = new VaardighedenEvaluatieController();
  adminRouter.get(
    "/vaardigheden/evaluaties",
    useMethod(vaardighedenEvaluatieController.all)
  );
  adminRouter.get(
    "/vaardigheden/evaluaties/:id",
    useMethod(vaardighedenEvaluatieController.find)
  );
  adminRouter.post(
    "/vaardigheden/evaluaties",
    useMethod(vaardighedenEvaluatieController.create)
  );
  adminRouter.patch(
    "/vaardigheden/evaluaties/:id",
    useMethod(vaardighedenEvaluatieController.update)
  );
  adminRouter.delete(
    "/vaardigheden/evaluaties/:id",
    useMethod(vaardighedenEvaluatieController.delete)
  );

  router.use(withRole(UserRole.Admin), adminRouter);
};

const registerTeacherRoutes = (router: Router) => {
  const teacherRouter = Router();

  // Register teacher routes
  const userController = new UserController();
  teacherRouter.get("/user/:id", useMethod(userController.find));
  teacherRouter.get(
    "/students/klas/:id",
    useMethod(userController.allStudentsByClass)
  );
  // teacherRouter.get(
  //   "/students/name/:student",
  //   useMethod(userController.byStudentName)
  // );
  teacherRouter.get(
    "/students/klas/name/:klas",
    useMethod(userController.allStudentsByClassName)
  );

  const klasLeerkrachtController = new KlasLeerkrachtController();
  teacherRouter.get(
    "/leerkracht/:id/klassen/:year",
    useMethod(klasLeerkrachtController.allByTeacherYear)
  );

  const andereTaalController = new AndereTaalController();
  teacherRouter.get(
    "/andere-taal/leerling/:id",
    useMethod(andereTaalController.byStudent)
  );

  const basisgeletterdheidLeerlingController =
    new BasisgeletterdheidLeerlingController();
  teacherRouter.get(
    "/basisgeletterdheid/leerling/:id",
    useMethod(basisgeletterdheidLeerlingController.byStudent)
  );
  teacherRouter.get(
    "/basisgeletterdheid/klas/:klas",
    useMethod(basisgeletterdheidLeerlingController.byClass)
  );
  teacherRouter.patch(
    "/basisgeletterdheid/leerling/:id",
    useMethod(basisgeletterdheidLeerlingController.update)
  );

  const klasController = new KlasController();
  teacherRouter.get(
    "/klassen/leerkracht/:id",
    useMethod(klasController.allByTeacher)
  );
  teacherRouter.get("/klas/:id", useMethod(klasController.find));

  const taalprofielAntwoordController = new TaalprofielAntwoordController();
  teacherRouter.get(
    "/taalprofiel/antwoorden/leerling/:id",
    useMethod(taalprofielAntwoordController.byStudent)
  );
  teacherRouter.get(
    "/taalprofiel/antwoorden/klas/:name/:language/:year",
    useMethod(taalprofielAntwoordController.byClass)
  );
  teacherRouter.get(
    "/taalprofiel/antwoorden/leerling/:id/:language/:year",
    useMethod(taalprofielAntwoordController.byStudentId)
  );

  const foutenanalyseOnderdeelController =
    new FoutenanalyseOnderdeelController();
  teacherRouter.get(
    "/foutenanalyse/onderdelen/leerling/:id",
    useMethod(foutenanalyseOnderdeelController.byStudent)
  );
  teacherRouter.get(
    "/foutenanalyse/onderdelen/klas/:id",
    useMethod(foutenanalyseOnderdeelController.byClass)
  );
  teacherRouter.patch(
    "/foutenanalyse/onderdelen/:id",
    useMethod(foutenanalyseOnderdeelController.update)
  );

  const woordenschatOnderdeelController = new WoordenschatOnderdeelController();
  teacherRouter.get(
    "/woordenschat/onderdelen/leerling/:id",
    useMethod(woordenschatOnderdeelController.byStudent)
  );
  teacherRouter.get(
    "/woordenschat/onderdelen/klas/:id",
    useMethod(woordenschatOnderdeelController.byClass)
  );
  teacherRouter.patch(
    "/woordenschat/onderdelen/:id",
    useMethod(woordenschatOnderdeelController.update)
  );

  const taaltipController = new TaaltipController();
  teacherRouter.get(
    "/taaltips/klas/:id",
    useMethod(taaltipController.allByClass)
  );
  teacherRouter.post("/taaltips", useMethod(taaltipController.create));
  teacherRouter.patch("/taaltips/:id", useMethod(taaltipController.update));
  teacherRouter.delete("/taaltips/:id", useMethod(taaltipController.delete));

  const taaltipLeerlingController = new TaaltipLeerlingController();
  teacherRouter.get(
    "/taaltips/antwoorden/leerling/:id",
    useMethod(taaltipLeerlingController.allByStudent)
  );
  teacherRouter.get(
    "/taaltips/antwoorden/klas/:id",
    useMethod(taaltipLeerlingController.allByClass)
  );

  const vaardighedenOnderdeelController = new VaardighedenOnderdeelController();
  teacherRouter.get(
    "/vaardigheden/onderdelen/leerling/:id",
    useMethod(vaardighedenOnderdeelController.byStudent)
  );
  teacherRouter.post(
    "/vaardigheden/onderdeel/klas/:id",
    useMethod(vaardighedenOnderdeelController.byClass)
  );
  teacherRouter.patch(
    "/vaardigheden/onderdelen/:id",
    useMethod(vaardighedenOnderdeelController.update)
  );

  router.use(teacherRouter);
};

const registerStudentRoutes = (router: Router) => {
  const studentRouter = Router();

  // Register student routes
  const andereTaalController = new AndereTaalController();
  studentRouter.get(
    "/andere-talen/leerling/:id",
    useMethod(andereTaalController.byStudent)
  );
  studentRouter.post("/andere-talen", useMethod(andereTaalController.create));
  studentRouter.patch(
    "/andere-talen/:id",
    useMethod(andereTaalController.update)
  );
  studentRouter.delete(
    "/andere-talen/:id",
    useMethod(andereTaalController.delete)
  );

  const userController = new UserController();
  studentRouter.get("/user/:id", useMethod(userController.find));

  const taalprofielVragenController = new TaalprofielVraagController();
  studentRouter.get(
    "/taalprofiel/vragen",
    useMethod(taalprofielVragenController.all)
  );
  studentRouter.get(
    "/taalprofiel/vragen/graad/:grade",
    useMethod(taalprofielVragenController.allByGrade)
  );
  studentRouter.get(
    "/taalprofiel/vragen/taal/:language",
    useMethod(taalprofielVragenController.allByLanguage)
  );

  const basisgeletterdheidLeerlingController =
    new BasisgeletterdheidLeerlingController();
  studentRouter.get(
    "/basisgeletterdheid/leerling/:id",
    useMethod(basisgeletterdheidLeerlingController.byStudent)
  );

  const taalprofielAntwoordController = new TaalprofielAntwoordController();
  studentRouter.get(
    "/taalprofiel/antwoorden/leerling/:id",
    useMethod(taalprofielAntwoordController.byStudent)
  );
  studentRouter.get(
    "/taalprofiel/antwoorden/leerling/:id/taal/:language/:selectedYear",
    useMethod(taalprofielAntwoordController.byStudentLanguage)
  );
  studentRouter.patch(
    "/taalprofiel/antwoorden/:id",
    useMethod(taalprofielAntwoordController.update)
  );

  const foutenanalyseOnderdeelController =
    new FoutenanalyseOnderdeelController();
  studentRouter.get(
    "/foutenanalyse/onderdelen/leerling/:id",
    useMethod(foutenanalyseOnderdeelController.byStudent)
  );
  studentRouter.post(
    "/foutenanalyse/onderdeel",
    useMethod(foutenanalyseOnderdeelController.create)
  );
  studentRouter.patch(
    "/foutenanalyse/onderdelen/:id",
    useMethod(foutenanalyseOnderdeelController.update)
  );
  studentRouter.delete(
    "/foutenanalyse/onderdelen/:id",
    useMethod(foutenanalyseOnderdeelController.delete)
  );

  const foutenanalyseFoutController = new FoutenanalyseFoutenController();
  studentRouter.post(
    "/foutenanalyse/fouten",
    useMethod(foutenanalyseFoutController.create)
  );
  studentRouter.patch(
    "/foutenanalyse/fouten/:id",
    useMethod(foutenanalyseFoutController.update)
  );
  studentRouter.delete(
    "/foutenanalyse/fouten/:id",
    useMethod(foutenanalyseFoutController.delete)
  );

  const woordenschatOnderdeelController = new WoordenschatOnderdeelController();
  studentRouter.get(
    "/woordenschat/onderdelen/leerling/:id",
    useMethod(woordenschatOnderdeelController.byStudent)
  );
  studentRouter.post(
    "/woordenschat/onderdeel",
    useMethod(woordenschatOnderdeelController.create)
  );
  studentRouter.patch(
    "/woordenschat/onderdelen/:id",
    useMethod(woordenschatOnderdeelController.update)
  );
  studentRouter.delete(
    "/woordenschat/onderdelen/:id",
    useMethod(woordenschatOnderdeelController.delete)
  );

  const woordenschatWoordController = new WoordenschatWoordController();
  studentRouter.post(
    "/woordenschat/woorden",
    useMethod(woordenschatWoordController.create)
  );
  studentRouter.patch(
    "/woordenschat/woorden/:id",
    useMethod(woordenschatWoordController.update)
  );
  studentRouter.delete(
    "/woordenschat/woorden/:id",
    useMethod(woordenschatWoordController.delete)
  );

  const taaltipLeerlingController = new TaaltipLeerlingController();
  studentRouter.get(
    "/taaltips/antwoorden/leerling/:id",
    useMethod(taaltipLeerlingController.allByStudent)
  );
  studentRouter.patch(
    "/taaltips/antwoorden/:id",
    useMethod(taaltipLeerlingController.update)
  );

  const vaardighedenOnderdeelController = new VaardighedenOnderdeelController();
  studentRouter.get(
    "/vaardigheden/onderdelen/leerling/:id",
    useMethod(vaardighedenOnderdeelController.byStudent)
  );
  studentRouter.post(
    "/vaardigheden/onderdeel",
    useMethod(vaardighedenOnderdeelController.create)
  );
  studentRouter.patch(
    "/vaardigheden/onderdelen/:id",
    useMethod(vaardighedenOnderdeelController.update)
  );
  studentRouter.delete(
    "/vaardigheden/onderdelen/:id",
    useMethod(vaardighedenOnderdeelController.delete)
  );

  const vaardighedenEvaluatieController = new VaardighedenEvaluatieController();
  studentRouter.post(
    "/vaardigheden/evaluaties",
    useMethod(vaardighedenEvaluatieController.create)
  );
  studentRouter.patch(
    "/vaardigheden/evaluaties/:id",
    useMethod(vaardighedenEvaluatieController.update)
  );
  studentRouter.delete(
    "/vaardigheden/evaluaties/:id",
    useMethod(vaardighedenEvaluatieController.delete)
  );

  router.use(studentRouter);
};

const registerRoutes = (app: Router) => {
  // public folder
  app.use("/public", express.static(path.resolve(__dirname, "../public")));

  // Onboarding routes
  registerOnboardingRoutes(app);

  // Authenticated routes
  registerAuthenticatedRoutes(app);

  // Fallback route
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError());
  });
};

export { registerRoutes };
