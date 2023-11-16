import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import WoordenschatWoord from "./WoordenschatWoord.entity";
import { WoordenschatWoordBody } from "./WoordenschatWoord.types";

export default class WoordenschatWoordService {
  private repository: Repository<WoordenschatWoord>;

  constructor() {
    const repository = AppDataSource.getRepository(WoordenschatWoord);
    this.repository = repository;
  }

  all = async (options: object) => {
    const woordenschatWoorden = await this.repository.find({
      where: options,
    });
    return woordenschatWoorden;
  };

  findOne = async (id: number) => {
    const woordenschatWoord = await this.repository.findOne({
      where: { id },
    });
    return woordenschatWoord;
  };

  byOnderdeel = async (id: number) => {
    const woordenschatWoorden = await this.repository.find({
      where: { onderdeel: { id } },
    });
    return woordenschatWoorden;
  };

  findOneBy = async (options: object) => {
    const woordenschatWoord = await this.repository.findOneBy(options);
    return woordenschatWoord;
  };

  create = async (body: WoordenschatWoordBody) => {
    const woordenschatWoord = await this.repository.save(
      this.repository.create(body)
    );
    return woordenschatWoord;
  };

  update = async (id: number, body: WoordenschatWoordBody) => {
    let woordenschatWoord = await this.findOne(id);
    if (woordenschatWoord) {
      woordenschatWoord = await this.repository.save({
        ...woordenschatWoord,
        ...body,
      });
    }
    return woordenschatWoord;
  };

  delete = async (id: number) => {
    let woordenschatWoord = await this.findOne(id);
    if (woordenschatWoord) {
      await this.repository.softDelete({ id });
    }
    return woordenschatWoord;
  };
}
