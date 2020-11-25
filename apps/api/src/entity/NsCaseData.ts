import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class NsCaseData {
  @PrimaryColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column()
  cases!: number;

  @Column()
  deaths!: number;
}
