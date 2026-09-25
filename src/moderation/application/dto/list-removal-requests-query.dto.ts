import { IsEnum, IsOptional } from 'class-validator';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';

export class ListRemovalRequestsQueryDto {
  @IsOptional()
  @IsEnum(ModerationRequestStatus)
  status?: ModerationRequestStatus;
}
