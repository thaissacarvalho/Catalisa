import { sequelize } from '@app/database/sequelize';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
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

    if (
      !comment ||
      !(await this.ancestorsAreVisible(comment.parentCommentId))
    ) {
      return null;
    }

    return CommentMapper.toDomain(comment);
  }

  async findById(id: string): Promise<CommentEntity | null> {
    const comment = await CommentModel.findByPk(id, {
      include: [
        {
          association: 'author',
          attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
        },
      ],
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

    const visibleIds = new Set<string>();
    let changed = true;

    while (changed) {
      changed = false;
      for (const comment of comments) {
        if (visibleIds.has(comment.id)) {
          continue;
        }

        if (
          comment.parentCommentId === null ||
          visibleIds.has(comment.parentCommentId)
        ) {
          visibleIds.add(comment.id);
          changed = true;
        }
      }
    }

    return comments
      .filter((comment) => visibleIds.has(comment.id))
      .map(CommentMapper.toDomain);
  }

  private async ancestorsAreVisible(
    parentCommentId: string | null,
  ): Promise<boolean> {
    const visited = new Set<string>();
    let currentId = parentCommentId;

    while (currentId) {
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const parent = await CommentModel.findOne({
        where: { id: currentId, status: CommentStatus.ACTIVE },
        include: [authorInclude, visibleSolutionInclude],
      });

      if (!parent) return false;
      currentId = parent.parentCommentId;
    }

    return true;
  }

  async updateStatus(
    id: string,
    status: CommentStatus,
    moderatedByUserCode?: string,
    moderationReason?: string,
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
        throw new AppHttpException(CatalisaCodes.CONFLICT);
      }

      comment.status = status;
      comment.moderationReason =
        status === CommentStatus.EXCLUDED
          ? (moderationReason?.trim() ?? null)
          : null;
      comment.moderatedByUserCode =
        status === CommentStatus.EXCLUDED
          ? (moderatedByUserCode ?? null)
          : null;
      comment.moderatedAt =
        status === CommentStatus.EXCLUDED ? new Date() : null;

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
