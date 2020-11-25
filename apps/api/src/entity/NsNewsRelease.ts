import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class NsNewsRelease {
  @PrimaryColumn()
  id!: string;

  @Column()
  published!: Date;

  @Column()
  url!: string;

  @Column()
  title!: string;
}
