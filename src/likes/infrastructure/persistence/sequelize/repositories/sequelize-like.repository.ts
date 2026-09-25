import { UniqueConstraintError } from 'sequelize';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import LikeModel from '@app/likes/infrastructure/persistence/sequelize/models/like.model';
import { LikeEntity } from '@app/likes/domain/entities/like.entity';
import { LikeMapper } from '../mappers/like.mapper';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';
import { targetWhere } from '../helpers/like-target-where.helper';
import { visibleLikeIncludes } from '../helpers/visible-like-includes.helper';

export class SequelizeLikeRepository implements LikeRepository {
  async createLike(like: LikeEntity): Promise<LikeEntity> {
    try {
      const model = await LikeModel.create(LikeMapper.toPersistence(like));
      return LikeMapper.toDomain(model);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const constraint = (error.parent as Error & { constraint?: string })
          .constraint;
        if (
          constraint === 'likes_solution_user_unique' ||
          constraint === 'likes_comment_user_unique'
        ) {
          throw new AppHttpException(TokenCodes.LIKE_ALREADY_EXISTS);
        }
      }
      throw error;
    }
  }

  async findByUserAndTarget(
    userCode: string,
    target: LikeTarget,
  ): Promise<LikeEntity | null> {
    const model = await LikeModel.findOne({
      where: {
        userCode,
        ...targetWhere(target),
      },
    });

    return model ? LikeMapper.toDomain(model) : null;
  }

  async deleteByUserAndTarget(
    userCode: string,
    target: LikeTarget,
  ): Promise<boolean> {
    const deleted = await LikeModel.destroy({
      where: {
        userCode,
        ...targetWhere(target),
      },
    });

    return deleted > 0;
  }

  async countBy(target: LikeTarget): Promise<number> {
    return LikeModel.count({
      where: targetWhere(target),
      include: visibleLikeIncludes(target),
      distinct: true,
      col: 'id',
    });
  }
}
