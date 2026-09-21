import { IsEnum } from 'class-validator';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export class UpdateCommentStatusDto {  
  @IsEnum(CommentStatus)
  status!: CommentStatus;
}