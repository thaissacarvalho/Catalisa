import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import LikeModel from '@app/likes/infrastructure/persistence/sequelize/models/like.model';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';

export class SequelizeLikeRepository implements LikeRepository {
  async countVisibleBySolution(solutionId: string): Promise<number> {
    return LikeModel.count({
      where: { solutionId },
      distinct: true,
      col: 'id',
      include: [
        {
          association: 'user',
          attributes: [],
          required: true,
          where: { status: UserStatus.ACTIVE },
        },
        {
          association: 'solution',
          attributes: [],
          required: true,
          where: { status: SolutionStatus.PUBLISHED },
          include: [
            {
              association: 'author',
              attributes: [],
              required: true,
              where: { status: UserStatus.ACTIVE },
            },
          ],
        },
      ],
    });
  }
}
