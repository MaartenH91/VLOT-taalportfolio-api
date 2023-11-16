import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import FoutenanalyseOnderdeel from "./FoutenanalyseOnderdeel.entity";
import { FoutenanalyseOnderdeelBody } from "./FoutenanalyseOnderdeel.types";

export default class FoutenanalyseOnderdeelService {
  private repository: Repository<FoutenanalyseOnderdeel>;

  constructor() {
    const repository = AppDataSource.getRepository(FoutenanalyseOnderdeel);
    this.repository = repository;
  }

  all = async (options: object) => {
    const foutenanalyseOnderdelen = await this.repository.find({
      where: options,
      relations: ["leerling", "fouten"],
    });
    return foutenanalyseOnderdelen;
  };

  byStudent = async (id: number) => {
    const foutenanalyseOnderdelen = await this.repository.find({
      where: { leerling: { id } },
      relations: ["fouten"],
    });
    return foutenanalyseOnderdelen;
  };

  byClass = async (id: number) => {
    const foutenanalyseOnderdelen = await this.repository.find({
      where: { leerling: { klas: { id } } },
      relations: ["fouten", 'leerling'],
    });
    return foutenanalyseOnderdelen;
  };


  findOne = async (id: number) => {
    const foutenanalyseOnderdeel = await this.repository.findOne({
      where: { id },
      relations: ["leerling", "fouten"],
    });
    return foutenanalyseOnderdeel;
  };

  findOneBy = async (options: object) => {
    const foutenanalyseOnderdeel = await this.repository.findOneBy(options);
    return foutenanalyseOnderdeel;
  };

  create = async (body: FoutenanalyseOnderdeelBody) => {
    const foutenanalyseOnderdeel = await this.repository.save(
      this.repository.create(body)
    );
    return foutenanalyseOnderdeel;
  };

  update = async (id: number, body: FoutenanalyseOnderdeelBody) => {
    let foutenanalyseOnderdeel = await this.findOne(id);
    if (foutenanalyseOnderdeel) {
      foutenanalyseOnderdeel = await this.repository.save({
        ...foutenanalyseOnderdeel,
        ...body,
      });
    }
    return foutenanalyseOnderdeel;
  };

  delete = async (id: number) => {
    let foutenanalyseOnderdeel = await this.findOne(id);
    if (foutenanalyseOnderdeel) {
      await this.repository.softDelete({ id });
    }
    return foutenanalyseOnderdeel;
  };
}
