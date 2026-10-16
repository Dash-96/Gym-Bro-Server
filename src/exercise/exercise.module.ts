import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/Exercise';
import { ExerciseController } from './exercise.controller';

@Module({
  controllers:[ExerciseController],
  providers: [ExerciseService],
  imports:[TypeOrmModule.forFeature([Exercise])],
  // exports:[TypeOrmModule]
})
export class ExerciseModule {

}
