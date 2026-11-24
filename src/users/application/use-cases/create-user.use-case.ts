import { Inject } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { CreateUserDto } from '@app/users/application/dto/create-user.dto';
import { generateUserCode } from '@app/utils/generateUserCode';

export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: CreateUserDto): Promise<UserEntity> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppHttpException(CatalisaCodes.USER_ALREADY_EXISTS);
    }

    const user = await this.userRepository.create(
      new UserEntity(
        crypto.randomUUID(),
        data.name.trim(),
        normalizedEmail,
        UserStatus.ACTIVE,
        UserRole.PARTICIPANT,
        data.jobPosition.trim(),
        data.enterprise.trim(),
        generateUserCode(),
      ),
    );

    return user;
  }
}
