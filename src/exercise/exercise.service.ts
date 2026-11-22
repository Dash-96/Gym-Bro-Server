import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseMeta } from './entities/ExerciseMeta';
import { ExerciseMetaVersion } from './entities/ExerciseMetaVersion';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class ExerciseService {
    constructor(
        @InjectRepository(ExerciseMeta) private catalogRepository: Repository<ExerciseMeta>,
        @InjectRepository(ExerciseMetaVersion) private catalogVersionRepository: Repository<ExerciseMetaVersion>,
    ){}

    async getLatestCatalogVersion(): Promise<ExerciseMetaVersion> {
        const [latestVersion] = await this.catalogVersionRepository.find({
            order: { version: 'DESC' },
            take: 1,
        });

        if (!latestVersion) {
            throw new NotFoundException('No exercise catalog version found');
        }

        return latestVersion;
    }

    async getExerciseCatalog(userCatalogVersion: number): Promise<{ version: ExerciseMetaVersion; exercises: ExerciseMeta[] }> {
        const version = await this.getLatestCatalogVersion();
        if(userCatalogVersion === version.version) {
            return {version , exercises:[]}
        }
        const exercises = await this.catalogRepository.find({
            order: { date: 'ASC' },
        });
        console.log("returning caltalog: " , exercises)
        return { version, exercises };
    }
}
