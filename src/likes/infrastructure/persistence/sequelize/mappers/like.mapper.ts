import { LikeEntity } from '@app/likes/domain/entities/like.entity';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import LikeModel from '@app/likes/infrastructure/persistence/sequelize/models/like.model';
import { toLikeTarget } from '@app/likes/infrastructure/persistence/sequelize/mappers/like-target.mapper';

export class LikeMapper {
  static toDomain(model: LikeModel): LikeEntity {
    return new LikeEntity(
      model.id,
      model.userCode,
      toLikeTarget(model),
      model.createdAt,
      model.updatedAt,
    );
  }

  static toPersistence(like: LikeEntity) {
    return {
      id: like.id,
      userCode: like.userCode,
      type: like.target.type,

      solutionId:
        like.target.type === TargetType.SOLUTION
          ? like.target.solutionId
          : null,
      commentId:
        like.target.type === TargetType.COMMENT ? like.target.commentId : null,
    };
  }
}
