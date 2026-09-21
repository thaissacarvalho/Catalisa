import { sequelize } from '@app/database/sequelize';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import CommentModel from '@app/comments/infrastructure/persistence/sequelize/models/comment.model';
import { CommentMapper } from '@app/comments/infrastructure/persistence/sequelize/mappers/comment.mapper';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';

const authorInclude = {
  association: 'author',
  attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
  required: true,
  where: { status: UserStatus.ACTIVE },
};
const visibleSolutionInclude = {
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
};

export class SequelizeCommentRepository implements CommentRepository {
  async create(comment: CommentEntity): Promise<CommentEntity> {
    const model = await CommentModel.create(
      CommentMapper.toPersistence(comment),
    );

    await model.reload({
      include: [
        {
          association: 'author',
          attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
        },
      ],
    });
    return CommentMapper.toDomain(model);
  }

  async find(id: string): Promise<CommentEntity | null> {
    const comment = await CommentModel.findOne({
      where: { id, status: CommentStatus.ACTIVE },
      include: [authorInclude, visibleSolutionInclude],
    });

    return comment ? CommentMapper.toDomain(comment) : null;
  }

  async findCommentBySolution(solutionId: string): Promise<CommentEntity[]> {
    const comments = await CommentModel.findAll({
      where: {
        solutionId,
        status: CommentStatus.ACTIVE,
      },
      include: [authorInclude, visibleSolutionInclude],
      order: [
        ['createdAt', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    return comments.map(CommentMapper.toDomain);
  }

  async updateStatus(
    id: string,
    status: CommentStatus,
  ): Promise<CommentEntity | null> {
    return sequelize.transaction(async (transaction) => {
      const comment = await CommentModel.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!comment) return null;
      if (
        comment.status === status ||
        comment.status === CommentStatus.EXCLUDED
      ) {
        throw new AppHttpException(TokenCodes.CONFLICT);
      }
      comment.status = status;
      await comment.save({ transaction });
      await comment.reload({
        transaction,
        include: [
          {
            association: 'author',
            attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
          },
        ],
      });
      return CommentMapper.toDomain(comment);
    });
  }
}
