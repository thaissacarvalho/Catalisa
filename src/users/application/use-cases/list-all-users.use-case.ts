import { Inject } from '@nestjs/common';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserRepository } from '@app/users/domain/repositories/user.repository';

export class ListAllUsersUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }
}
