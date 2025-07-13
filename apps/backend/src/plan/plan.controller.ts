import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanDTO } from './plan.dto';

@Controller('plan')
export class PlanController {

    constructor(private readonly planService: PlanService) {
    }

    @Get()
    async getPlans() {
        return await this.planService.getPlans();
    }
    @Post()
    async createPlan(@Body() plan: PlanDTO) {
        return await this.planService.createPlan(plan);
    }
    @Put('/:id')
    async updatePlan(@Param('id', ParseIntPipe) id: number, @Body() plan: PlanDTO) {
        return await this.planService.updatePlan(id, plan);
    }
    @Delete('/:id')
    async deletePlan(@Param('id', ParseIntPipe) id: number) {
        return await this.planService.deletePlan(id);
    }
}
