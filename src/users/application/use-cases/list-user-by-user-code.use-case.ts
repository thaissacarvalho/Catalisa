import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { Inject } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';

export class ListUserByUserCodeUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userCode: string): Promise<UserEntity | null> {
    const userCodeExist = await this.userRepository.findByUserCode(userCode);
    
    if(!userCodeExist) {
      throw new AppHttpException(CatalisaCodes.USER_NOT_FOUND);
    }

    return userCodeExist;
  }
}
