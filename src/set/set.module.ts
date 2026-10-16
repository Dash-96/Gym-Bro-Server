import { Module } from '@nestjs/common';
import { SetController } from './set.controller';
import { SetService } from './set.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseSet } from './entities/Set';

@Module({
  controllers: [SetController],
  providers: [SetService],
  imports:[TypeOrmModule.forFeature([ExerciseSet])]
})
export class SetModule {}
