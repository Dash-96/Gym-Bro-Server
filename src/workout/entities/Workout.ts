import { Exercise } from "src/exercise/entities/Exercise";
import { User } from "src/user/entities/User";
import {Column, Entity, ForeignKey, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity("workouts")
export class Workout{
    
    @PrimaryGeneratedColumn ()
    id:number;
    @Column({name:"user_id"})
    userId: number;
    @Column({name:"workout_type"})
    workoutType: string;
    @Column({name:"workout_alias"})
    workoutAlias: string;
    @Column({name:"started_at"})
    startedAt: Date;
    @Column({name:"finished_at"})
    finishedAt: Date;
    @Column()
    notes: string ;
    @Column({name:"created_at"})
    createdAt: string  = new Date().toDateString();
    @Column({name:"updated_at"})
    updatedAt: string = new Date().toDateString();

    @OneToMany(type => Exercise , exercise => exercise.workout , {
        cascade:["insert" , "remove" ]
    })
    exercises: Exercise[];

    @ManyToOne(type => User )
    @JoinColumn({name:"user_id" , referencedColumnName:"id"})
    user: User;

}