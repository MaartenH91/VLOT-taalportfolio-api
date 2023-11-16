import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import AndereTaal from "./AndereTaal.entity";
import { AndereTaalBody } from "./AndereTaal.types";

export default class AndereTaalService {
  private repository: Repository<AndereTaal>;

  constructor() {
    const repository = AppDataSource.getRepository(AndereTaal);
    this.repository = repository;
  }

  all = async (options: object) => {
    const andereTalen = await this.repository.find({
      where: options,
      relations: ["leerling"],
    });
    return andereTalen;
  };

  byStudent = async (id: number) => {
    const andereTalen = await this.repository.find({
      where: { leerling: { id } },
    });
    return andereTalen;
  };

  findOne = async (id: number) => {
    const andereTaal = await this.repository.findOne({
      where: { id },
      relations: ["leerling"],
    });
    return andereTaal;
  };

  findOneBy = async (options: object) => {
    const andereTaal = await this.repository.findOneBy(options);
    return andereTaal;
  };

  create = async (body: AndereTaalBody) => {
    const andereTaal = await this.repository.save(this.repository.create(body));
    return andereTaal;
  };

  update = async (id: number, body: AndereTaalBody) => {
    let andereTaal = await this.findOne(id);
    if (andereTaal) {
      andereTaal = await this.repository.save({
        ...andereTaal,
        ...body,
      });
    }
    return andereTaal;
  };

  delete = async (id: number) => {
    let andereTaal = await this.findOne(id);
    if (andereTaal) {
      await this.repository.softDelete({ id });
    }
    return andereTaal;
  };
}
