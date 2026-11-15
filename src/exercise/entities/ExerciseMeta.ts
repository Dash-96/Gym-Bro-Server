import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exercise_catalog')
export class ExerciseMeta {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'exercise_key' })
  exerciseKey: string;

  @Column({ name: 'exercise_name_en' })
  exerciseNameEn: string;

  @Column({ name: 'exercise_name_he' })
  exerciseNameHe: string;

  @Column({ name: 'target_muscle_group' })
  tragetMuscleGroup: string;

  @Column({name: "date"})
  date: Date;
}
