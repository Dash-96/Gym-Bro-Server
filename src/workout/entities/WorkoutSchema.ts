import {EntitySchema} from "typeorm";
import { Workout } from "./Workout";
export const WorkoutSchema = new EntitySchema<Workout>({
    name: 'Workout',
    target: Workout,
    columns:{
        id:{
            type:Number,
            primary:true,
            generated:true
        },
        userId:{
            type:Number,
            name: "user_id",
            
        }
    }
})