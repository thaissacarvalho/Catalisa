import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @IsUUID()
  solutionId!: string;

  @IsString()
  @MinLength(36)
  @MaxLength(40)
  userCode!: string;

  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(50)
  @MaxLength(280)
  comment!: string;
}
