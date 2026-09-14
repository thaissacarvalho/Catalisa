import { Inject } from '@nestjs/common';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserRepository } from '@app/users/domain/repositories/user.repository';

export class ListUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }
}
