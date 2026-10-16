import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { Workout } from './entities/Workout';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/auth/auth.guard';

@ApiBearerAuth()
@Controller('workout')
export class WorkoutController {
    constructor(private service : WorkoutService){}

    @Get()
    getAll(@Req() request: Request){
        return "workout controller";
    }

    @Get("workouts")
    async getWorkouts(@Req() req:AuthenticatedRequest){
        const userId = req.user.sub
        const workouts =  await this.service.getWorkoutsByUserId(userId);
        return workouts;
    }

    @Post("create")
    async createWorkout( @Req() req: AuthenticatedRequest, @Body() workoutDto:CreateWorkoutDto){
        console.log("create workout endpoint")
        const user = req.user;
        console.log("create workout request was made for user: " , user.sub ," " ,  user.username)
        return await this.service.createWorkout(workoutDto , user.sub);
    }

    @Get("count")
    async countWorkouts(@Req() req: AuthenticatedRequest){
        console.log("count workouts called");
        const userId = req.user.sub;
        const count = await this.service.getWorkoutCount(userId)
        return {workoutCount: count}

    }
}
