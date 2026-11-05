import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { ensureCanLike } from '@app/common/authorization/ensure-can-like';

@Injectable()
export class DeleteLikeUseCase {
  constructor(
    @Inject('LikeRepository') private readonly likeRepository: LikeRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(userCode: string, target: LikeTarget): Promise<void> {
    const user = await this.userRepository.findByUserCode(userCode);

    if (!user) throw new AppHttpException(CatalisaCodes.USER_NOT_FOUND);

    ensureCanLike(user.role);

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppHttpException(CatalisaCodes.FORBIDDEN);
    }

    // Removal remains possible when the target is hidden and is idempotent.
    await this.likeRepository.deleteByUserAndTarget(userCode, target);
  }
}
