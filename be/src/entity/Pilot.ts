import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { Team } from '../entity/Team'

@Entity()
export class Pilot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Team, (team) => team.id, { cascade: true })
    @JoinColumn()
    team: Team

    // @OneToMany(() => Team, (team) => team.id)
    // teams: Team[]
}
