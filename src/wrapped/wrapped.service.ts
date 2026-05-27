import { Injectable } from '@nestjs/common';
import { WrappedRepository } from '../wrapped-data/wrapped-data.repository';
import { AuthRepository } from '../auth/auth.repository';
import { WrappedStatus, WrappedType } from '../wrapped-data/entities/wrapped.entity';
import { QueueService } from '../queue/queue.service';

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
      throw new Error('User not found');
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

  remove(id: string, userId: number) {
    return this.wrappedRepository.deleteByUserId(id, userId);
  }
}
