import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import CommentModel from '@app/comments/infrastructure/persistence/sequelize/models/comment.model';
import { CommentMapper } from '@app/comments/infrastructure/persistence/sequelize/mappers/comment.mapper';

export class SequelizeCommentRepository implements CommentRepository {
  async create(comment: CommentEntity): Promise<CommentEntity> {
    const model = await CommentModel.create(CommentMapper.toPersistence(comment));

    return CommentMapper.toDomain(model);
  }

  async find(id: string): Promise<CommentEntity | null> {
    const comment = await CommentModel.findByPk(id);

    return comment ? CommentMapper.toDomain(comment) : null;
  }

  async updateStatus(
    id: string,
    status: CommentStatus,
  ): Promise<CommentEntity | null> {
    const comment = await CommentModel.findByPk(id);

    if (!comment) {
      return null;
    }

    comment.status = status;
    await comment.save();

    return CommentMapper.toDomain(comment);
  } 
}