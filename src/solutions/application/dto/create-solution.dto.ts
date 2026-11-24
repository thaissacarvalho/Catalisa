import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
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
    format: 'uuid',
    description: 'Identifier of one of the available challenges',
  })
  @IsUUID()
  challengeId!: string;

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
