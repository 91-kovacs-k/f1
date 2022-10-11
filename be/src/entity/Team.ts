import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Pilot } from '../entity/Pilot'

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Pilot, (pilot) => pilot.id)
    pilots: Pilot[]
}
