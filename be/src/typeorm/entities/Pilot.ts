import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Team } from '../entities/Team';

@Entity()
export class Pilot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Team, (team) => team.id, { cascade: true })
  @JoinColumn()
  team: Relation<Team>;
}
