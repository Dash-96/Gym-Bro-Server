import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExerciseService } from './exercise.service';

@ApiBearerAuth()
@Controller('exercise')
export class ExerciseController {
    constructor(private exerciseService: ExerciseService){}

    @Get('catalog/version')
    async getLatestCatalogVersion(){
        return await this.exerciseService.getLatestCatalogVersion();
    }

    @Get('catalog/:userCatalogVersion')
    async getExerciseCatalog(@Param('userCatalogVersion', ParseIntPipe) userCatalogVersion: number){
        console.log("called catalog")
        return await this.exerciseService.getExerciseCatalog(userCatalogVersion);
    }
}
