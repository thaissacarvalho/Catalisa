import type { Transaction, WhereOptions } from 'sequelize';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import CommentModel from '@app/comments/infrastructure/persistence/sequelize/models/comment.model';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';

interface ModerationTargetColumns {
  solutionId: string | null;
  commentId: string | null;
}

interface RemovableTarget extends ModerationTargetColumns {
  targetType: TargetType;
  reason: string;
}

export function moderationTargetWhere(
  targetType: TargetType,
  targetId: string,
): WhereOptions {
  return targetType === TargetType.SOLUTION
    ? { solutionId: targetId }
    : { commentId: targetId };
}

export async function ensureModerationTargetCanBeRemoved(
  targetType: TargetType,
  targetId: string,
  transaction: Transaction,
): Promise<void> {
  if (targetType === TargetType.SOLUTION) {
    const solution = await SolutionModel.findByPk(targetId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!solution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    if (solution.status === SolutionStatus.REMOVED) {
      throw new AppHttpException(TokenCodes.MODERATION_TARGET_ALREADY_REMOVED);
    }

    return;
  }

  const comment = await CommentModel.findByPk(targetId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!comment) {
    throw new AppHttpException(TokenCodes.COMMENT_NOT_FOUND);
  }

  if (comment.status === CommentStatus.EXCLUDED) {
    throw new AppHttpException(TokenCodes.MODERATION_TARGET_ALREADY_REMOVED);
  }
}

export async function removeModerationTarget(
  target: RemovableTarget,
  reviewerUserCode: string,
  transaction: Transaction,
): Promise<void> {
  if (target.targetType === TargetType.SOLUTION) {
    if (!target.solutionId) {
      throw new AppHttpException(TokenCodes.INVALID_PERSISTENCE_DATA);
    }

    const solution = await SolutionModel.findByPk(target.solutionId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!solution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    if (solution.status === SolutionStatus.REMOVED) {
      throw new AppHttpException(TokenCodes.MODERATION_TARGET_ALREADY_REMOVED);
    }

    solution.status = SolutionStatus.REMOVED;
    solution.moderationReason = target.reason;
    solution.moderatedByUserCode = reviewerUserCode;
    solution.moderatedAt = new Date();
    await solution.save({ transaction });
    return;
  }

  if (!target.commentId) {
    throw new AppHttpException(TokenCodes.INVALID_PERSISTENCE_DATA);
  }

  const comment = await CommentModel.findByPk(target.commentId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!comment) {
    throw new AppHttpException(TokenCodes.COMMENT_NOT_FOUND);
  }

  if (comment.status === CommentStatus.EXCLUDED) {
    throw new AppHttpException(TokenCodes.MODERATION_TARGET_ALREADY_REMOVED);
  }

  comment.status = CommentStatus.EXCLUDED;
  comment.moderationReason = target.reason;
  comment.moderatedByUserCode = reviewerUserCode;
  comment.moderatedAt = new Date();
  await comment.save({ transaction });
}
