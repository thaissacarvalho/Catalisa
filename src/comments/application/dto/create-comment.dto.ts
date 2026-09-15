import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  solutionId!: string;

  @IsString()
  userCode!: string;

  @IsString()
  @Length(1, 280)
  comment!: string;
}