import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import CommentModel from '@app/comments/infrastructure/persistence/sequelize/models/comment.model';

export class CommentMapper {
  static toDomain(model: CommentModel) {
    return {
      id: model.id,
      solutionId: model.solutionId,
      userCode: model.userCode,
      comment: model.comment,
      status: model.status,
    };
  }

  static toPersistence(comment: CommentEntity) {
    return {
      id: comment.id,
      solutionId: comment.solutionId,
      userCode: comment.userCode,
      comment: comment.comment,
      status: comment.status,
    }
  }
}