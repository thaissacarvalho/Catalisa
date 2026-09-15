import { Inject } from '@nestjs/common';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { CommentEntity } from '@app/comments/domain/entities/comment.entity';

export class FindCommentUseCase {
  constructor(
    @Inject ('CommentRepository')
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(id: string): Promise<CommentEntity | null> {
    return this.commentRepository.find(id);
  }
}