import { ExerciseSet} from "src/set/entities/Set";
import { Workout } from "src/workout/entities/Workout";
import {Entity ,PrimaryGeneratedColumn , Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";

@Entity("workout_excercises")
export class Exercise{
    @PrimaryGeneratedColumn()
    id: number
    @Column({name:"workout_id"})
    workoutId: number
    @Column({name:"excercise_key"})
    exerciseKey:string
    @Column({name:"excercise_name"})
    exerciseName: string
    @Column({name:"order_index"})
    orderIndex:number;
    @Column({name:"created_at"})
    createdAt:Date = new Date()

    @ManyToOne(type => Workout , workout => workout.exercises)
    @JoinColumn({name:"workout_id" , referencedColumnName:"id"})
    workout: Workout

    @OneToMany(type => ExerciseSet , set => set.exercise , {
        cascade:["insert"]
    })
    sets: ExerciseSet[]
}