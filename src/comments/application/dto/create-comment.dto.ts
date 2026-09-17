import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  solutionId!: string;

  @IsString()
  @MinLength(36)
  @MaxLength(40)
  userCode!: string;

  @IsString()
  @MinLength(50)
  @MaxLength(280)
  comment!: string;
}