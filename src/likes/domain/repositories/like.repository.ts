import { LikeEntity } from '@app/likes/domain/entities/like.entity';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';

export interface LikeRepository {
  createLike(like: LikeEntity): Promise<LikeEntity>;
  countBy(target: LikeTarget): Promise<number>;
  findByUserAndTarget(
    userCode: string,
    target: LikeTarget,
  ): Promise<LikeEntity | null>;
  deleteByUserAndTarget(userCode: string, target: LikeTarget): Promise<boolean>;
}
