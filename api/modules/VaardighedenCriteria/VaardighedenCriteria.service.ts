import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import VaardighedenCriteria from "./VaardighedenCriteria.entity";
import { VaardighedenCriteriaBody } from "./VaardighedenCriteria.types";

export default class VaardighedenCriteriaService {
  private repository: Repository<VaardighedenCriteria>;

  constructor() {
    const repository = AppDataSource.getRepository(VaardighedenCriteria);
    this.repository = repository;
  }

  all = async (options: object) => {
    const vaardighedenCriteria = await this.repository.find({
      where: options,
    });
    return vaardighedenCriteria;
  };

  findOne = async (id: number) => {
    const vaardighedenCriteria = await this.repository.findOne({
      where: { id },
    });
    return vaardighedenCriteria;
  };

  findOneBy = async (options: object) => {
    const vaardighedenCriteria = await this.repository.findOneBy(options);
    return vaardighedenCriteria;
  };

  create = async (body: VaardighedenCriteriaBody) => {
    const vaardighedenCriteria = await this.repository.save(this.repository.create(body));
    return vaardighedenCriteria;
  };

  update = async (id: number, body: VaardighedenCriteriaBody) => {
    let vaardighedenCriteria = await this.findOne(id);
    if (vaardighedenCriteria) {
      vaardighedenCriteria = await this.repository.save({ ...vaardighedenCriteria, ...body });
    }
    return vaardighedenCriteria;
  };

  delete = async (id: number) => {
    let vaardighedenCriteria = await this.findOne(id);
    if (vaardighedenCriteria) {
      await this.repository.softDelete({ id });
    }
    return vaardighedenCriteria;
  };
}
