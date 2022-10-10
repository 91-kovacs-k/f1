import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}
