import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import WoordenschatOnderdeel from "./WoordenschatOnderdeel.entity";
import { WoordenschatOnderdeelBody } from "./WoordenschatOnderdeel.types";

export default class WoordenschatOnderdeelService {
  private repository: Repository<WoordenschatOnderdeel>;

  constructor() {
    const repository = AppDataSource.getRepository(WoordenschatOnderdeel);
    this.repository = repository;
  }

  all = async (options: object) => {
    const woordenschatOnderdelen = await this.repository.find({
      where: options,
      relations: ["leerling", "woorden"],
    });
    return woordenschatOnderdelen;
  };

  byStudent = async (id: number) => {
    const woordenschatOnderdelen = await this.repository.find({
      where: { leerling: { id } },
      relations: ["woorden"],
    });
    return woordenschatOnderdelen;
  };

  byClass = async (id: number) => {
    const woordenschatOnderdelen = await this.repository.find({
      where: { leerling: { klas: { id } } },
      relations: ["woorden", "leerling"],
    });
    return woordenschatOnderdelen;
  };

  findOne = async (id: number) => {
    const woordenschatOnderdeel = await this.repository.findOne({
      where: { id },
      relations: ["leerling", "woorden"],
    });
    return woordenschatOnderdeel;
  };

  findOneBy = async (options: object) => {
    const woordenschatOnderdeel = await this.repository.findOneBy(options);
    return woordenschatOnderdeel;
  };

  create = async (body: WoordenschatOnderdeelBody) => {
    const woordenschatOnderdeel = await this.repository.save(
      this.repository.create(body)
    );
    return woordenschatOnderdeel;
  };

  update = async (id: number, body: WoordenschatOnderdeelBody) => {
    let woordenschatOnderdeel = await this.findOne(id);
    if (woordenschatOnderdeel) {
      woordenschatOnderdeel = await this.repository.save({
        ...woordenschatOnderdeel,
        ...body,
      });
    }
    return woordenschatOnderdeel;
  };

  delete = async (id: number) => {
    let woordenschatOnderdeel = await this.findOne(id);
    if (woordenschatOnderdeel) {
      await this.repository.softDelete({ id });
    }
    return woordenschatOnderdeel;
  };
}
