import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import { LikeTarget } from '@app/likes/domain/enums/like-type.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { ensureParticipant } from '@app/common/authorization/ensure-participant';

@Injectable()
export class DeleteLikeUseCase {
  constructor(
    @Inject('LikeRepository') private readonly likeRepository: LikeRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(userCode: string, target: LikeTarget): Promise<void> {
    const user = await this.userRepository.findByUserCode(userCode);

    if (!user) throw new AppHttpException(TokenCodes.USER_NOT_FOUND);

    ensureParticipant(user.role);

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppHttpException(TokenCodes.FORBIDDEN);
    }

    // Removal remains possible when the target is hidden and is idempotent.
    await this.likeRepository.deleteByUserAndTarget(userCode, target);
  }
}
