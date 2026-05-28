import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wrapped, WrappedStatus } from "./entities/wrapped.entity";
import { Repository } from "typeorm";

@Injectable()
export class WrappedRepository {

    constructor(
        @InjectRepository(Wrapped)
        private readonly wrappedRepo: Repository<Wrapped>
    ) { }

    async create(wrappedData: Partial<Wrapped>) {
        const newWrapped = this.wrappedRepo.create(wrappedData);
        return this.wrappedRepo.save(newWrapped);
    }

    async findById(id: string) {
        return this.wrappedRepo.findOne({ where: { id } });
    }

    async findOneByUserId(wrappedId: string, userId: number) {
        return this.wrappedRepo.findOne({ where: { id: wrappedId, userId } });
    }

    async findByYear(year: number) {
        return this.wrappedRepo.find({ where: { year } });
    }

    async getItemsByUserId(userId: number) {
        return this.wrappedRepo.find({ where: { userId } });
    }

    async updateWrappedStatus(id: string, status: WrappedStatus) {
        return this.wrappedRepo.update({ id }, { status });
    }

    async updateWrappedData(id: string, data: Record<string, any>) {
        return this.wrappedRepo.update({ id }, { data });
    }

    async updateWrappedJobId(id: string, jobId: string) {
        return this.wrappedRepo.update({ id }, { jobId });
    }

    async deleteByUserId(wrappedId: string, userId: number) {
        return this.wrappedRepo.delete({ id: wrappedId, userId });
    }

    async deleteById(id: string) {
        return this.wrappedRepo.delete({ id });
    }

}