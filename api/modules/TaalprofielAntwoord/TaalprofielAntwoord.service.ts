import { Between, Repository } from "typeorm";
import { TaalOptions } from "../../constants";
import { AppDataSource } from "../../database/DatabaseSource";
import { getGradeYear } from "../../utils";
import TaalprofielAntwoord from "./TaalprofielAntwoord.entity";
import { TaalprofielAntwoordBody } from "./TaalprofielAntwoord.types";

export default class TaalprofielAntwoordService {
  private repository: Repository<TaalprofielAntwoord>;

  constructor() {
    const repository = AppDataSource.getRepository(TaalprofielAntwoord);
    this.repository = repository;
  }

  all = async (options: object) => {
    const taalprofielAntwoorden = await this.repository.find({
      where: options,
      relations: ["vraag", "leerling"],
    });
    return taalprofielAntwoorden;
  };

  byStudent = async (id: number) => {
    const taalprofielAntwoorden = await this.repository.find({
      where: { leerling: { id } },
      relations: ["vraag"],
    });
    return taalprofielAntwoorden;
  };

  byStudentLanguage = async (
    id: number,
    language: TaalOptions,
    year: number,
    grade: number
  ) => {
    const taalprofielAntwoorden = await this.repository.find({
      where: {
        leerling: { id },
        vraag: { taal: language, graad: grade },
        jaar: getGradeYear(String(year)),
      },
      order: { vraag: { id: "ASC" } },
      relations: ["vraag", "andereTaal"],
    });
    return taalprofielAntwoorden;
  };

  byOtherLanguage = async (id: number, language: any) => {
    const taalprofielAntwoorden = await this.repository.find({
      where: {
        leerling: { id },
        andereTaal: { taal: language },
      },
      order: { vraag: { id: "ASC" } },
      relations: ["vraag"],
    });
    return taalprofielAntwoorden;
  };

  byClass = async (id: number) => {
    const taalprofielAntwoorden = await this.repository.find({
      where: { leerling: { klas: { id } } },
      relations: ["vraag", "leerling"],
      order: { leerling: { achternaam: "ASC" } },
    });
    return taalprofielAntwoorden;
  };

  byClassLanguageYear = async (
    id: number,
    language: TaalOptions,
    grade: number,
    year: number
  ) => {
    const taalprofielAntwoorden = await this.repository.find({
      where: {
        leerling: { klas: { id } },
        vraag: { taal: language, graad: grade },
        jaar: year,
      },
      relations: ["vraag", "leerling"],
      order: { leerling: { achternaam: "ASC" } },
    });
    return taalprofielAntwoorden;
  };

  byQuestion = async (id: number) => {
    const taalprofielAntwoorden = await this.repository.find({
      where: { vraag: { id } },
      relations: ["vraag", "leerling"],
    });
    return taalprofielAntwoorden;
  };

  findOne = async (id: number) => {
    const taalprofielAntwoord = await this.repository.findOne({
      where: { id },
      relations: ["vraag", "leerling"],
    });
    return taalprofielAntwoord;
  };

  findOneBy = async (options: object) => {
    const taalprofielAntwoord = await this.repository.findOneBy(options);
    return taalprofielAntwoord;
  };

  create = async (body: TaalprofielAntwoordBody) => {
    const taalprofielAntwoord = await this.repository.save(
      this.repository.create(body)
    );
    return taalprofielAntwoord;
  };

  update = async (id: number, body: TaalprofielAntwoordBody) => {
    let taalprofielAntwoord = await this.findOne(id);
    if (taalprofielAntwoord) {
      taalprofielAntwoord = await this.repository.save({
        ...taalprofielAntwoord,
        ...body,
      });
    }
    return taalprofielAntwoord;
  };

  delete = async (id: number) => {
    let taalprofielAntwoord = await this.findOne(id);
    if (taalprofielAntwoord) {
      await this.repository.softDelete({ id });
    }
    return taalprofielAntwoord;
  };
}
