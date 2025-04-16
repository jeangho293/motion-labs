import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type Creator = {
  chart: string;
  name: string;
  phone: string;
  rrn: string;
  address: string;
  memo: string;
};

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chart!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  rrn!: string;

  @Column()
  address!: string;

  @Column()
  memo!: string;

  constructor(args: Creator) {
    if (args) {
      this.chart = args.chart;
      this.name = args.name;
      this.phone = args.phone;
      this.rrn = args.rrn;
      this.address = args.address;
      this.memo = args.memo;
    }
  }
}
