import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import { LikeEntity } from '@app/likes/domain/entities/like.entity';
import { LikeTarget } from '@app/likes/domain/enums/like-type.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { ensureParticipant } from '@app/common/authorization/ensure-participant';
import { EnsureLikeTargetVisibleUseCase } from './ensure-like-target-visible.use-case';

@Injectable()
export class CreateLikeUseCase {
  constructor(
    @Inject('LikeRepository') private readonly likeRepository: LikeRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly visibleTarget: EnsureLikeTargetVisibleUseCase,
  ) {}

  async execute(userCode: string, target: LikeTarget): Promise<LikeEntity> {
    const user = await this.userRepository.findByUserCode(userCode);

    if (!user) throw new AppHttpException(TokenCodes.USER_NOT_FOUND);

    ensureParticipant(user.role);

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppHttpException(TokenCodes.FORBIDDEN);
    }

    await this.visibleTarget.execute(target);

    const existingLike = await this.likeRepository.findByUserAndTarget(
      userCode,
      target,
    );

    if (existingLike) {
      throw new AppHttpException(TokenCodes.LIKE_ALREADY_EXISTS);
    }

    const like = new LikeEntity(randomUUID(), userCode, target);
    const createdLike = await this.likeRepository.createLike(like);

    return createdLike;
  }
}
