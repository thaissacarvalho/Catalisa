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
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      author: model.author
        ? {
            userCode: model.author.userCode,
            name: model.author.name,
            jobPosition: model.author.jobPosition,
            enterprise: model.author.enterprise,
          }
        : null,
    };
  }

  static toPersistence(comment: CommentEntity) {
    return {
      id: comment.id,
      solutionId: comment.solutionId,
      userCode: comment.userCode,
      comment: comment.comment,
      status: comment.status,
    };
  }
}
