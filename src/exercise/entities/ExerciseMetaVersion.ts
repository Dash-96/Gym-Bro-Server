import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exercise_meta_version')
export class ExerciseMetaVersion {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'version' })
  version: number;

  // Postgres `date` column: TypeORM returns it as a 'YYYY-MM-DD' string
  @Column({ name: 'version_date', type: 'date' })
  versionDate: string;
}
