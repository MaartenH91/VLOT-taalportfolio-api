import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import FoutenanalyseFout from "./FoutenanalyseFout.entity";
import { FoutenanalyseFoutBody } from "./FoutenanalyseFout.types";

export default class FoutenanalyseFoutService {
  private repository: Repository<FoutenanalyseFout>;

  constructor() {
    const repository = AppDataSource.getRepository(FoutenanalyseFout);
    this.repository = repository;
  }

  all = async (options: object) => {
    const foutenanalyseFouten = await this.repository.find({
      where: options,
    });
    return foutenanalyseFouten;
  };

  findOne = async (id: number) => {
    const foutenanalyseFout = await this.repository.findOne({
      where: { id },
    });
    return foutenanalyseFout;
  };

  findOneBy = async (options: object) => {
    const foutenanalyseFout = await this.repository.findOneBy(options);
    return foutenanalyseFout;
  };

  byOnderdeel = async (id: number) => {
    const foutenanalyseFouten = await this.repository.find({
      where: { onderdeel: { id } },
    });
    return foutenanalyseFouten;
  };

  create = async (body: FoutenanalyseFoutBody) => {
    const foutenanalyseFout = await this.repository.save(
      this.repository.create(body)
    );
    return foutenanalyseFout;
  };

  update = async (id: number, body: FoutenanalyseFoutBody) => {
    let foutenanalyseFout = await this.findOne(id);
    if (foutenanalyseFout) {
      foutenanalyseFout = await this.repository.save({
        ...foutenanalyseFout,
        ...body,
      });
    }
    return foutenanalyseFout;
  };

  delete = async (id: number) => {
    let foutenanalyseFout = await this.findOne(id);
    if (foutenanalyseFout) {
      await this.repository.softDelete({ id });
    }
    return foutenanalyseFout;
  };
}
