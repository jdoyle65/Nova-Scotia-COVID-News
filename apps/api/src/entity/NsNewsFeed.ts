import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class NsNewsFeed {
  @PrimaryColumn()
  id!: string;

  @Column()
  published!: Date;

  @Column()
  url!: string;

  @Column()
  title!: string;
}
