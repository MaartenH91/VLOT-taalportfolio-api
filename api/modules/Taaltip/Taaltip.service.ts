import { Repository } from "typeorm";
import { TaalOptions, VaardigheidOptions } from "../../constants";
import { AppDataSource } from "../../database/DatabaseSource";
import Taaltip from "./Taaltip.entity";
import { TaaltipBody } from "./Taaltip.types";

export default class TaaltipService {
  private repository: Repository<Taaltip>;

  constructor() {
    const repository = AppDataSource.getRepository(Taaltip);
    this.repository = repository;
  }

  all = async (options: object) => {
    const taaltips = await this.repository.find({
      where: options,
      relations: ["taaltipsAntwoorden"],
    });
    return taaltips;
  };

  byClass = async (id: number) => {
    const taaltips = await this.repository.find({
      where: { klas: { id } },
    });
    return taaltips;
  };

  byLanguage = async (language: TaalOptions) => {
    const taaltips = await this.repository.find({
      where: { taal: language },
    });
    return taaltips;
  };

  bySkill = async (skill: VaardigheidOptions) => {
    const taaltips = await this.repository.find({
      where: { vaardigheid: skill },
    });
    return taaltips;
  };

  byClassLanguageSkill = async (
    id: number,
    language: TaalOptions,
    skill: VaardigheidOptions
  ) => {
    const taaltips = await this.repository.find({
      where: { klas: { id }, taal: language, vaardigheid: skill },
    });
    return taaltips;
  };

  findOne = async (id: number) => {
    const taaltip = await this.repository.findOne({
      where: { id },
    });
    return taaltip;
  };

  findOneBy = async (options: object) => {
    const taaltip = await this.repository.findOneBy(options);
    return taaltip;
  };

  create = async (body: TaaltipBody) => {
    const taaltip = await this.repository.save(this.repository.create(body));
    return taaltip;
  };

  update = async (id: number, body: TaaltipBody) => {
    let taaltip = await this.findOne(id);
    if (taaltip) {
      taaltip = await this.repository.save({ ...taaltip, ...body });
    }
    return taaltip;
  };

  delete = async (id: number) => {
    let taaltip = await this.findOne(id);
    if (taaltip) {
      await this.repository.softDelete({ id });
    }
    return taaltip;
  };
}
