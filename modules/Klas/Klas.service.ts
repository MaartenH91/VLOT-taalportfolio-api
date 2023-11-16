import { LessThan, MoreThan, Repository } from "typeorm";
import { GradeOptions } from "../../constants";
import { AppDataSource } from "../../database/DatabaseSource";
import Klas from "./Klas.entity";
import { KlasBody } from "./Klas.types";

export default class KlasService {
  private repository: Repository<Klas>;

  constructor() {
    const repository = AppDataSource.getRepository(Klas);
    this.repository = repository;
  }

  all = async (options: object) => {
    const klassen = await this.repository.find({
      where: options,
    });
    return klassen;
  };

  byGrade = async (grade: GradeOptions) => {
    const klassen = await this.repository.find({
      where: { graad: grade },
    });
    return klassen;
  };

  byTeacher = async (id: number) => {
    const klassen = await this.repository.find({
      where: {
        leerkrachtKlassen: {
          leerkracht: { id },
          geldigVan: LessThan(new Date()),
          geldigTot: MoreThan(new Date()),
        },
      },
    });
    return klassen;
  };

  findOne = async (id: number) => {
    const klas = await this.repository.findOne({
      where: { id },
      relations: ["leerlingen"],
    });
    return klas;
  };

  findOneBy = async (options: object) => {
    const klas = await this.repository.findOneBy(options);
    return klas;
  };

  create = async (body: KlasBody) => {
    const klas = await this.repository.save(this.repository.create(body));
    return klas;
  };

  update = async (id: number, body: KlasBody) => {
    let klas = await this.findOne(id);
    if (klas) {
      klas = await this.repository.save({ ...klas, ...body });
    }
    return klas;
  };

  delete = async (id: number) => {
    let klas = await this.findOne(id);
    if (klas) {
      await this.repository.softDelete({ id });
    }
    return klas;
  };
}
