import { Module } from "@nestjs/common";
import { WorkoutController } from "./workout.controller";
import { WorkoutService } from './workout.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workout } from "./entities/Workout";
import { Exercise } from "src/exercise/entities/Exercise";

@Module({
    controllers:[WorkoutController],
    providers: [WorkoutService],
    imports:[TypeOrmModule.forFeature([Workout])],
    exports:[TypeOrmModule]
})

export class WorkoutModule{}
