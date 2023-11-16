import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import VaardighedenEvaluatie from "./VaardighedenEvaluatie.entity";
import { VaardighedenEvaluatieBody } from "./VaardighedenEvaluatie.types";

export default class VaardighedenEvaluatieService {
  private repository: Repository<VaardighedenEvaluatie>;

  constructor() {
    const repository = AppDataSource.getRepository(VaardighedenEvaluatie);
    this.repository = repository;
  }

  all = async (options: object) => {
    const vaardighedenEvaluaties = await this.repository.find({
      where: options,
      relations: ["criteria"],
    });
    return vaardighedenEvaluaties;
  };

  findOne = async (id: number) => {
    const vaardighedenEvaluatie = await this.repository.findOne({
      where: { id },
      relations: ["criteria"],
    });
    return vaardighedenEvaluatie;
  };

  findOneBy = async (options: object) => {
    const vaardighedenEvaluatie = await this.repository.findOneBy(options);
    return vaardighedenEvaluatie;
  };

  byCriteria = async (id: number) => {
    const vaardighedenEvaluaties = await this.repository.find({
      where: { criteria: { id } },
      relations: ["criteria"],
    });
    return vaardighedenEvaluaties;
  };

  byOnderdeel = async (id: number) => {
    const vaardighedenEvaluaties = await this.repository.find({
      where: { onderdeel: { id } },
      relations: ["criteria"],
    });
    return vaardighedenEvaluaties;
  };

  create = async (body: VaardighedenEvaluatieBody) => {
    const vaardighedenEvaluatie = await this.repository.save(
      this.repository.create(body)
    );
    return vaardighedenEvaluatie;
  };

  update = async (id: number, body: VaardighedenEvaluatieBody) => {
    let vaardighedenEvaluatie = await this.findOne(id);
    if (vaardighedenEvaluatie) {
      vaardighedenEvaluatie = await this.repository.save({
        ...vaardighedenEvaluatie,
        ...body,
      });
    }
    return vaardighedenEvaluatie;
  };

  delete = async (id: number) => {
    let vaardighedenEvaluatie = await this.findOne(id);
    if (vaardighedenEvaluatie) {
      await this.repository.softDelete({ id });
    }
    return vaardighedenEvaluatie;
  };
}
