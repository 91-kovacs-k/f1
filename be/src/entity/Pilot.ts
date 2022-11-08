import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm'
import { Team } from '../entity/Team.js'

@Entity()
export class Pilot {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Team, (team) => team.id, { cascade: true })
  @JoinColumn()
  team: Relation<Team>
}
