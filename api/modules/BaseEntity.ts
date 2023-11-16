import { validateOrReject } from "class-validator";
import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import ValidationError from "../errors/ValidationError";

export abstract class BaseEntity {
  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @BeforeInsert()
  async validateCreate() {
    try {
      await validateOrReject(this, { groups: ["create"] });
    } catch (errors) {
      // Collect validation errors in object
      const validationErrors = {};
      for (const e of errors) {
        validationErrors[e.property] = e.constraints;
      }
      throw new ValidationError(validationErrors);
    }
  }

  @BeforeUpdate()
  async validateUpdate() {
    try {
      await validateOrReject(this, { groups: ["update"] });
    } catch (errors) {
      // Collect validation errors in object
      const validationErrors = {};
      for (const e of errors) {
        validationErrors[e.property] = e.constraints;
      }
      throw new ValidationError(validationErrors);
    }
  }
}
