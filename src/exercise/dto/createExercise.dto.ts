import { CreateSetDto } from "src/set/dto/createSet.dto";

export class CreateExerciseDto{
    exerciseKey: string;
    exerciseName: string;
    orderIndex: number;
    sets: CreateSetDto[];
}