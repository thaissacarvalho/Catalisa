import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSolutionInput } from '@app/solutions/application/contracts/create-solution-input.contract';

export class CreateSolutionDto implements CreateSolutionInput {
  @ApiProperty({
    example: 'USER_0123456789abcdef0123456789abcdef',
  })
  @IsString()
  @Matches(/^USER_[a-f0-9]{32}$/)
  userCode!: string;

  @ApiProperty({
    example: 1,
    description: 'Identifier of one of the available challenges',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  challengeId!: number;

  @ApiProperty({
    example: 'Comunicação transparente com a equipe',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  title!: string;

  @ApiProperty({
    example:
      'Realizar reuniões semanais para compartilhar decisões e resultados.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description!: string;
}
