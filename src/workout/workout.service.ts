import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workout } from './entities/Workout';
import { DataSource, Repository } from 'typeorm';
import { Exercise } from 'src/exercise/entities/Exercise';
import { CreateWorkoutDto } from './dto/createWorkout.dto';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout) private workoutRepository: Repository<Workout>,
    private dataSource: DataSource,
  ) {}

  async createWorkout(
    workoutDto: CreateWorkoutDto,
    userId: number,
  ): Promise<Workout> {
    try {
      const workout = this.workoutRepository.create({
        userId: userId,
        workoutType: workoutDto.workoutType,
        workoutAlias: workoutDto.workoutAlias ?? '',
        startedAt: workoutDto.startedAt ?? new Date(),
        finishedAt: workoutDto.finishedAt ?? new Date(),
        notes: workoutDto.notes ?? '',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        exercises: workoutDto.exercises,
      });
      return await this.workoutRepository.save(workout);
    } catch (err) {
      throw new InternalServerErrorException(`Error creating workout: ${err}`, {
        cause: err,
      });
    }
  }

  async getWorkoutsByUserId(userId: number): Promise<Workout[]> {
    const response = await this.workoutRepository.find({
      where: { userId},
      relations: { exercises: { sets: true } },
    });
    return response;
  }

  async getExerciseMetaData() {}

  async getWorkoutCount(userId: number) {
    const workoutsList = await this.workoutRepository
      .createQueryBuilder('workout')
      .where('workout.userId = :userId', { userId })
      .getManyAndCount();
    console.log('workout count ', workoutsList[1]);
    return workoutsList[1];
  }
}
