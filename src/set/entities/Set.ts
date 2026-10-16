import { Exercise } from "src/exercise/entities/Exercise";
import {Entity , PrimaryGeneratedColumn , Column, ManyToOne, JoinColumn} from "typeorm"
@Entity("excercise_sets")
export class ExerciseSet{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"workout_excercise_id"})
    exerciseId: number;

    @Column({name:"set_number"})
    setNumber:number;

    @Column()
    reps:number

    @Column()
    weight:number;

    @Column({name:'created_at'})
    createdAt:Date = new Date()

    @ManyToOne(() => Exercise , exercise => exercise.sets)
    @JoinColumn({name:"workout_excercise_id" , referencedColumnName:"id"})
    exercise: Exercise
}