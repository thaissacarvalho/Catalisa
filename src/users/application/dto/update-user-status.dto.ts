import { IsEnum } from 'class-validator';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status!: UserStatus;
}
