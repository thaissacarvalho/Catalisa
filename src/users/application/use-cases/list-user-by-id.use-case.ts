import { Inject } from '@nestjs/common';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';

export class ListUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<UserEntity | null> {
    const idExist = await this.userRepository.findById(id);

    if(!idExist) {
      throw new AppHttpException(CatalisaCodes.USER_NOT_FOUND);
    }

    return idExist;
  }
}
