import { Repository } from "typeorm";
import { GradeOptions, TaalOptions } from "../../constants";
import { AppDataSource } from "../../database/DatabaseSource";
import TaalprofielVraag from "./TaalprofielVraag.entity";
import { TaalprofielVraagBody } from "./TaalprofielVraag.types";

export default class TaalprofielVraagService {
  private repository: Repository<TaalprofielVraag>;

  constructor() {
    const repository = AppDataSource.getRepository(TaalprofielVraag);
    this.repository = repository;
  }

  all = async (options: object) => {
    const taalprofielvragen = await this.repository.find({
      where: options,
    });
    return taalprofielvragen;
  };

  byGrade = async (grade: GradeOptions) => {
    const taalprofielvragen = await this.repository.find({
      where: { graad: grade },
    });
    return taalprofielvragen;
  };

  byLanguage = async (language: TaalOptions) => {
    const taalprofielvragen = await this.repository.find({
      where: { taal: language },
    });
    return taalprofielvragen;
  };

  findOne = async (id: number) => {
    const taalprofielvraag = await this.repository.findOne({
      where: { id },
    });
    return taalprofielvraag;
  };

  findOneBy = async (options: object) => {
    const taalprofielvraag = await this.repository.findOneBy(options);
    return taalprofielvraag;
  };

  create = async (body: TaalprofielVraagBody) => {
    const taalprofielvraag = await this.repository.save(this.repository.create(body));
    return taalprofielvraag;
  };

  update = async (id: number, body: TaalprofielVraagBody) => {
    let taalprofielvraag = await this.findOne(id);
    if (taalprofielvraag) {
      taalprofielvraag = await this.repository.save({ ...taalprofielvraag, ...body });
    }
    return taalprofielvraag;
  };

  delete = async (id: number) => {
    let taalprofielvraag = await this.findOne(id);
    if (taalprofielvraag) {
      await this.repository.softDelete({ id });
    }
    return taalprofielvraag;
  };
}
