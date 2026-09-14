import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsEmail()
  @Length(1, 320)
  email!: string;

  @IsString()
  @Length(1, 80)
  jobPosition!: string;

  @IsString()
  @Length(1, 120)
  enterprise!: string;
}

export type CreateUserInput = CreateUserDto;
