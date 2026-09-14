import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAdminPasswordDto {
  @IsString()
  currentPassword!: string;
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword!: string;
}
