import { CreateExerciseDto } from "src/exercise/dto/createExercise.dto";


export class CreateWorkoutDto{
    workoutType: string;
    workoutAlias: string | null;
    notes: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    exercises: CreateExerciseDto[];
}
