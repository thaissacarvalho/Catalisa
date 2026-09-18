import { Inject } from '@nestjs/common';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';

export class ListAllUsersUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<UserEntity[]> {
    const user = await this.userRepository.findAll();

    if (!user || user.length === 0) {
      throw new AppHttpException(TokenCodes.USER_NOT_FOUND);
    }

    return user;
  }
}
