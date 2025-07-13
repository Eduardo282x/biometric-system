import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlanDTO } from './plan.dto';

@Injectable()
export class PlanService {

    constructor(private readonly prismaService: PrismaService) { }

    async getPlans() {
        return await this.prismaService.plan.findMany();
    }

    async createPlan(plan: PlanDTO) {
        try {
            await this.prismaService.plan.create({
                data: {
                    name: plan.name,
                    price: plan.price,
                    description: plan.description
                }
            })

            baseResponse.message = 'Plan guardado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse
        }
    }
    async updatePlan(id: number, plan: PlanDTO) {
        try {
            await this.prismaService.plan.update({
                data: {
                    name: plan.name,
                    price: plan.price,
                    description: plan.description
                },
                where: { id }
            })

            baseResponse.message = 'Plan modificado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse
        }
    }
    async deletePlan(id: number) {
        try {
            await this.prismaService.plan.delete({
                where: { id }
            })

            baseResponse.message = 'Plan eliminado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse
        }
    }
}
