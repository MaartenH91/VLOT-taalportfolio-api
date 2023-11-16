import {
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import KlasLeerkracht from "./KlasLeerkracht.entity";
import { KlasLeerkrachtBody } from "./KlasLeerkracht.types";

export default class KlasLeerkrachtService {
  private repository: Repository<KlasLeerkracht>;

  constructor() {
    const repository = AppDataSource.getRepository(KlasLeerkracht);
    this.repository = repository;
  }

  all = async (options: object) => {
    const klassen = await this.repository.find({
      where: options,
      relations: ["leerkracht", "klas"],
    });
    return klassen;
  };

  byClass = async (id: number) => {
    const klassen = await this.repository.find({
      where: { klas: { id } },
      relations: ["leerkracht"],
    });
    return klassen;
  };

  byTeacher = async (id: number) => {
    const klassen = await this.repository.find({
      where: { leerkracht: { id } },
      relations: ["klas"],
    });
    return klassen;
  };

  byTeacherYear = async (id: number, beginYear: string, endYear: string) => {
    const klassen = await this.repository.find({
      where: {
        leerkracht: { id },
        geldigVan: MoreThanOrEqual(new Date(`${beginYear}-08-31`)),
        geldigTot: LessThanOrEqual(new Date(`${endYear}-07-02`)),
      },
      relations: ["klas"],
    });
    return klassen;
  };

  findOne = async (id: number) => {
    const klas = await this.repository.findOne({
      where: { id },
      relations: ["leerkracht", "klas"],
    });
    return klas;
  };

  findOneBy = async (options: object) => {
    const klas = await this.repository.findOneBy(options);
    return klas;
  };

  create = async (body: KlasLeerkrachtBody) => {
    const klas = await this.repository.save(this.repository.create(body));
    return klas;
  };

  update = async (id: number, body: KlasLeerkrachtBody) => {
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
