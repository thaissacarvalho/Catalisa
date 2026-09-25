import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';
import { EnsureLikeTargetVisibleUseCase } from './ensure-like-target-visible.use-case';

@Injectable()
export class CountByLikeUseCase {
  constructor(
    @Inject('LikeRepository') private readonly likeRepository: LikeRepository,
    private readonly visibleTarget: EnsureLikeTargetVisibleUseCase,
  ) {}

  async execute(target: LikeTarget): Promise<{ count: number }> {
    await this.visibleTarget.execute(target);
    const count = await this.likeRepository.countBy(target);
    const result = { count };

    return result;
  }
}
