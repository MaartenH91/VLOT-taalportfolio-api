import { Like, Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import { UserRole } from "./User.constants";
import User from "./User.entity";
import { UserBody } from "./User.types";

export default class UserService {
  private repository: Repository<User>;

  constructor() {
    const repository = AppDataSource.getRepository(User);
    this.repository = repository;
  }

  all = async (options: object) => {
    const users = await this.repository.find({
      where: options,
      relations: ["taaltipsAntwoorden", "andereTalen"],
    });
    return users;
  };

  teachers = async () => {
    const teachers = await this.repository.find({
      where: { rol: UserRole.Teacher },
    });
    return teachers;
  };

  students = async () => {
    const students = await this.repository.find({
      where: { rol: UserRole.Student },
    });
    return students;
  };

  studentsByClass = async (id: number) => {
    const students = await this.repository.find({
      where: { rol: UserRole.Student, klas: { id } },
    });
    return students;
  };

  studentsByClassName = async (klas: string) => {
    const students = await this.repository.find({
      where: { rol: UserRole.Student, klas: { klas: klas } },
      order: { achternaam: "ASC" },
    });
    return students;
  };

  // byStudentName = async (studentName: string) => {
  //   const studentData = await this.repository.find({
  //     where: {
  //       rol: UserRole.Student,
  //       voornaam: Like(),
  //       achternaam: lastName,
  //     },
  //     relations: ["klas"],
  //   });
  //   return studentData;
  // };

  findOne = async (id: number) => {
    const user = await this.repository.findOne({
      where: { id },
      relations: ["klas", "leerkrachtKlassen"],
    });
    return user;
  };

  findOneBy = async (options: object) => {
    const user = await this.repository.findOneBy(options);
    return user;
  };

  findByEmailWithPassword = async (email: string) => {
    const user = await this.repository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .select("user.password")
      .getOne();
    return user;
  };

  create = async (body: UserBody) => {
    const user = await this.repository.save(this.repository.create(body));
    return user;
  };

  update = async (id: number, body: UserBody) => {
    let user = await this.findOne(id);
    if (user) {
      user = await this.repository.save({ ...user, ...body });
    }
    return user;
  };

  delete = async (id: number) => {
    let user = await this.findOne(id);
    if (user) {
      await this.repository.softDelete({ id });
    }
    return user;
  };
}
