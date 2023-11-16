import { Repository } from "typeorm";
import { TaalOptions, VaardigheidOptions } from "../../constants";
import { AppDataSource } from "../../database/DatabaseSource";
import TaaltipLeerling from "./TaaltipLeerling.entity";
import { TaaltipLeerlingBody } from "./TaaltipLeerling.types";

export default class TaaltipLeerlingService {
  private repository: Repository<TaaltipLeerling>;

  constructor() {
    const repository = AppDataSource.getRepository(TaaltipLeerling);
    this.repository = repository;
  }

  all = async (options: object) => {
    const antwoorden = await this.repository.find({
      where: options,
      relations: ["leerling", "taaltip"],
    });
    return antwoorden;
  };

  byStudent = async (id: number) => {
    const taaltips = await this.repository.find({
      where: { leerling: { id } },
      relations: ["taaltip"],
    });
    return taaltips;
  };

  byClass = async (id: number) => {
    const taaltips = await this.repository.find({
      where: { leerling: { klas: { id } } },
      relations: ["taaltip", "leerling"],
    });
    return taaltips;
  };

  byTaaltip = async (id: number) => {
    const taaltips = await this.repository.find({
      where: { taaltip: { id } },
    });
    return taaltips;
  };

  findOne = async (id: number) => {
    const antwoord = await this.repository.findOne({
      where: { id },
    });
    return antwoord;
  };

  findOneBy = async (options: object) => {
    const antwoord = await this.repository.findOneBy(options);
    return antwoord;
  };

  create = async (body: TaaltipLeerlingBody) => {
    const antwoord = await this.repository.save(this.repository.create(body));
    return antwoord;
  };

  update = async (id: number, body: TaaltipLeerlingBody) => {
    let antwoord = await this.findOne(id);
    if (antwoord) {
      antwoord = await this.repository.save({ ...antwoord, ...body });
    }
    return antwoord;
  };

  delete = async (id: number) => {
    let antwoord = await this.findOne(id);
    if (antwoord) {
      await this.repository.softDelete({ id });
    }
    return antwoord;
  };
}
