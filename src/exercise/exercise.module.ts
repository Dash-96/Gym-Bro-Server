import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/Exercise';
import { ExerciseController } from './exercise.controller';
import { ExerciseMeta } from './entities/ExerciseMeta';
import { ExerciseMetaVersion } from './entities/ExerciseMetaVersion';

@Module({
  controllers:[ExerciseController],
  providers: [ExerciseService],
  imports:[TypeOrmModule.forFeature([Exercise , ExerciseMeta, ExerciseMetaVersion])],
  // exports:[TypeOrmModule]
})
export class ExerciseModule {

}
