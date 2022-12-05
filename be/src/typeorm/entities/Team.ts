import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { Pilot } from '../entities/Pilot';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Pilot, (pilot) => pilot.id)
  pilots: Relation<Pilot[]>;

  @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
  createdAt: Date;
}
