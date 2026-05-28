import { HttpException, Injectable } from '@nestjs/common';
import { WrappedRepository } from '../wrapped-data/wrapped-data.repository';
import { AuthRepository } from '../auth/auth.repository';
import { WrappedStatus, WrappedType } from '../wrapped-data/entities/wrapped.entity';
import { QueueService } from '../queue/queue.service';
import { DeleteResult } from 'typeorm';

@Injectable()
export class WrappedService {

  constructor(
    private readonly wrappedRepository: WrappedRepository,
    private readonly authRepository: AuthRepository,
    private readonly queueService: QueueService
  ) { }

  async generateWrapped(username: string, token: string) {
    const year = new Date().getFullYear();
    const user = await this.authRepository.findByUsername(username);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const wrapped = await this.wrappedRepository.create({
      userId: user.id,
      githubUsername: username,
      title: `Git Wrapped ${year} for ${username}`,
      type: WrappedType.YEARLY,
      year,
      status: WrappedStatus.PENDING,
    });

    const res = await this.queueService.handleWrappedJob(wrapped.id, username, token);
    await this.wrappedRepository.updateWrappedJobId(wrapped.id, res.id || '');
    return res;
  }

  async getWrappedJobStatus(userId: number, wrappedId: string) {
    const wrapped = await this.wrappedRepository.findById(wrappedId);
    if (!wrapped) {
      throw new HttpException('Wrapped not found', 404);
    }

    if (wrapped.userId !== userId) {
      throw new HttpException('Unauthorized', 403);
    }

    const res = await this.queueService.handleGetWrappedJobStatus(wrapped.jobId || '');
    return res;
  }


  findAllUserWrapped(userId: number) {
    return this.wrappedRepository.getItemsByUserId(userId);
  }

  findOne(id: string, userId: number) {
    return this.wrappedRepository.findOneByUserId(id, userId);
  }

  updateWrappedStatus(id: string, status: WrappedStatus) {
    return this.wrappedRepository.create({ id, status });
  }

  async remove(id: string, userId: number) {
    const res: DeleteResult = await this.wrappedRepository.deleteByUserId(id, userId);
    console.log('Delete result:', res);

    if (res.affected === 0) {
      throw new HttpException('Wrapped not found or unauthorized', 404);
    }

    return { message: 'Wrapped deleted successfully' };
  }
}
