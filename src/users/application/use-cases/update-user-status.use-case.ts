import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { TokenCodes } from '@app/common/http/token-codes';
import { Inject } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';

export class UpdateUserStatusUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userCode: string, status: UserStatus): Promise<UserEntity> {
    const userCodeExist = await this.userRepository.findByUserCode(userCode);
    
    if(!userCodeExist) {
      throw new AppHttpException(TokenCodes.USER_NOT_FOUND);
    }
    
    const user = await this.userRepository.updateStatusByUserCode(
      userCode,
      status,
    );

    if (!user) {
      throw new AppHttpException(TokenCodes.USER_NOT_FOUND);
    }

    return user;
  }
}
