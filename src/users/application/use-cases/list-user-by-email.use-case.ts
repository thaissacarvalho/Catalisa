import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { Inject } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';

export class ListUserByEmailUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<UserEntity | null> {
    const emailExist = await this.userRepository.findByEmail(email);

    if (!emailExist) {
      throw new AppHttpException(TokenCodes.EMAIL_ALREADY_EXISTS);
    }

    return emailExist;
  }
}
