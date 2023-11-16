import { Repository } from "typeorm";
import { AppDataSource } from "../../database/DatabaseSource";
import BasisgeletterdheidLeerling from "./BasisgeletterdheidLeerling.entity";
import { BasisgeletterdheidLeerlingBody } from "./BasisgeletterdheidLeerling.types";

export default class BasisgeletterdheidLeerlingService {
  private repository: Repository<BasisgeletterdheidLeerling>;

  constructor() {
    const repository = AppDataSource.getRepository(BasisgeletterdheidLeerling);
    this.repository = repository;
  }

  all = async (options: object) => {
    const basisgeletterdheidLeerlingen = await this.repository.find({
      where: options,
      relations: ["leerling", "basisgeletterdheid"],
    });
    return basisgeletterdheidLeerlingen;
  };

  byStudent = async (id: number) => {
    const basisgeletterdheidLeerlingen = await this.repository.find({
      where: { leerling: { id } },
      relations: ["basisgeletterdheid"],
    });
    return basisgeletterdheidLeerlingen;
  };

  byClass = async (id: number) => {
    const basisgeletterdheidLeerlingen = await this.repository.find({
      where: { leerling: { klas: { id } } },
      relations: ["basisgeletterdheid", "leerling"],
      order: {
        leerling: { achternaam: "ASC" },
        basisgeletterdheid: { id: "ASC" },
      },
    });
    return basisgeletterdheidLeerlingen;
  };

  byBasisgeletterdheid = async (id: number) => {
    const basisgeletterdheidLeerlingen = await this.repository.find({
      where: { basisgeletterdheid: { id } },
      relations: ["basisgeletterdheid"],
    });
    return basisgeletterdheidLeerlingen;
  };

  findOne = async (id: number) => {
    const basisgeletterdheidLeerling = await this.repository.findOne({
      where: { id },
    });
    return basisgeletterdheidLeerling;
  };

  findOneBy = async (options: object) => {
    const basisgeletterdheidLeerling = await this.repository.findOneBy(options);
    return basisgeletterdheidLeerling;
  };

  create = async (body: BasisgeletterdheidLeerlingBody) => {
    const basisgeletterdheidLeerling = await this.repository.save(
      this.repository.create(body)
    );
    return basisgeletterdheidLeerling;
  };

  update = async (id: number, body: BasisgeletterdheidLeerlingBody) => {
    let basisgeletterdheidLeerling = await this.findOne(id);
    if (basisgeletterdheidLeerling) {
      basisgeletterdheidLeerling = await this.repository.save({
        ...basisgeletterdheidLeerling,
        ...body,
      });
    }
    return basisgeletterdheidLeerling;
  };

  delete = async (id: number) => {
    let basisgeletterdheidLeerling = await this.findOne(id);
    if (basisgeletterdheidLeerling) {
      await this.repository.softDelete({ id });
    }
    return basisgeletterdheidLeerling;
  };
}
