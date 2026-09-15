import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { Inject } from '@nestjs/common';
import { CreateCommentDto } from '@app/comments/application/dto/create-comment.dto';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export class CreateCommentUseCase {
  constructor(
    @Inject('CommentRepository') 
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(data: CreateCommentDto): Promise<CommentEntity> {
    const comment = new CommentEntity(
      crypto.randomUUID(),
      data.solutionId,
      data.userCode,
      data.comment,
      CommentStatus.ACTIVE, // Assuming the initial status is 'ACTIVE'
    );

    return this.commentRepository.create(comment);
  }
}