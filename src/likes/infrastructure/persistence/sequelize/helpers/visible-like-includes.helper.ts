import type { IncludeOptions } from 'sequelize';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';

function activeUser(association: string): IncludeOptions {
  return {
    association,
    attributes: [],
    required: true,
    where: { status: UserStatus.ACTIVE },
  };
}

function visibleSolution(): IncludeOptions {
  return {
    association: 'solution',
    attributes: [],
    required: true,
    where: { status: SolutionStatus.PUBLISHED },
    include: [activeUser('author')],
  };
}

export function visibleLikeIncludes(target: LikeTarget): IncludeOptions[] {
  // Usuário que realizou a curtida.
  const user = activeUser('user');

  if (target.type === TargetType.SOLUTION) {
    return [user, visibleSolution()];
  }

  return [
    user,
    {
      association: 'comment',
      attributes: [],
      required: true,
      where: { status: CommentStatus.ACTIVE },
      include: [activeUser('author'), visibleSolution()],
    },
  ];
}
