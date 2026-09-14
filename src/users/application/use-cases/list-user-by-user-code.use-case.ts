import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { Inject } from '@nestjs/common';

export class ListUserByUserCodeUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userCode: string): Promise<UserEntity | null> {
    return this.userRepository.findByUserCode(userCode);
  }
}
