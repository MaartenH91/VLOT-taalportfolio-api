import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import Basisgeletterdheid from "./Basisgeletterdheid.entity";
import { BasisgeletterdheidBody } from "./Basisgeletterdheid.types";

export default class BasisgeletterdheidService {
  private repository: Repository<Basisgeletterdheid>;

  constructor() {
    const repository = AppDataSource.getRepository(Basisgeletterdheid);
    this.repository = repository;
  }

  all = async (options: object) => {
    const basisgeletterdheden = await this.repository.find({
      where: options,
    });
    return basisgeletterdheden;
  };

  findOne = async (id: number) => {
    const basisgeletterdheid = await this.repository.findOne({
      where: { id },
    });
    return basisgeletterdheid;
  };

  findOneBy = async (options: object) => {
    const basisgeletterdheid = await this.repository.findOneBy(options);
    return basisgeletterdheid;
  };

  create = async (body: BasisgeletterdheidBody) => {
    const basisgeletterdheid = await this.repository.save(
      this.repository.create(body)
    );
    return basisgeletterdheid;
  };

  update = async (id: number, body: BasisgeletterdheidBody) => {
    let basisgeletterdheid = await this.findOne(id);
    if (basisgeletterdheid) {
      basisgeletterdheid = await this.repository.save({
        ...basisgeletterdheid,
        ...body,
      });
    }
    return basisgeletterdheid;
  };

  delete = async (id: number) => {
    let basisgeletterdheid = await this.findOne(id);
    if (basisgeletterdheid) {
      await this.repository.softDelete({ id });
    }
    return basisgeletterdheid;
  };
}
