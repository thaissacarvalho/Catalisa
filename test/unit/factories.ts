import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';
import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import { ModerationRequestDetails } from '@app/moderation/domain/entities/moderation-request-details.entity';
import { ModerationRequestEntity } from '@app/moderation/domain/entities/moderation-request.entity';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';

export function makeUser(overrides: Partial<UserEntity> = {}): UserEntity {
  return Object.assign(
    new UserEntity(
      'user-id',
      'User Name',
      'user@example.com',
      UserStatus.ACTIVE,
      UserRole.PARTICIPANT,
      'Developer',
      'Token',
      'USER_CODE',
    ),
    overrides,
  );
}

export function makeChallenge(
  overrides: Partial<ChallengeEntity> = {},
): ChallengeEntity {
  const createdAt = new Date('2026-01-01T00:00:00.000Z');
  const updatedAt = new Date('2026-01-02T00:00:00.000Z');

  return Object.assign(
    new ChallengeEntity(
      'challenge-id',
      'CHALLENGE',
      'Challenge title',
      'Challenge description',
      ChallengeStatus.ACTIVE,
      1,
      createdAt,
      updatedAt,
    ),
    overrides,
  );
}

export function makeSolution(
  overrides: Partial<SolutionEntity> = {},
): SolutionEntity {
  return Object.assign(
    new SolutionEntity(
      'solution-id',
      'USER_CODE',
      'challenge-id',
      'Solution title',
      'Solution description',
      SolutionStatus.PUBLISHED,
      null,
      null,
      null,
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-01-02T00:00:00.000Z'),
    ),
    overrides,
  );
}

export function makeSolutionDetails(
  overrides: Partial<SolutionDetails> = {},
): SolutionDetails {
  return {
    solution: makeSolution(),
    author: {
      userCode: 'USER_CODE',
      name: 'User Name',
      jobPosition: 'Developer',
      enterprise: 'Token',
    },
    moderator: null,
    ...overrides,
  };
}

export function makeComment(
  overrides: Partial<CommentEntity> = {},
): CommentEntity {
  return Object.assign(
    new CommentEntity(
      'comment-id',
      'solution-id',
      null,
      'USER_CODE',
      'A valid comment with at least fifty characters for unit testing.',
      CommentStatus.ACTIVE,
    ),
    overrides,
  );
}

export function makeModerationDetails(
  overrides: Partial<ModerationRequestDetails> = {},
): ModerationRequestDetails {
  const now = new Date('2026-01-01T00:00:00.000Z');
  const request = new ModerationRequestEntity(
    'request-id',
    TargetType.SOLUTION,
    'solution-id',
    ModerationRequestStatus.PENDING,
    'Reason',
    'ADMIN_CODE',
    null,
    null,
    null,
    now,
    now,
  );

  return {
    request,
    requestedBy: {
      userCode: 'ADMIN_CODE',
      name: 'Admin',
      email: 'admin@example.com',
    },
    reviewedBy: null,
    ...overrides,
  };
}

export function expectSyncTokenError(
  action: () => unknown,
  expectedCode: string,
): void {
  try {
    action();
  } catch (error) {
    expect(error).toBeInstanceOf(AppHttpException);
    expect((error as AppHttpException).getResponse()).toEqual(
      expect.objectContaining({ code: expectedCode }),
    );
    return;
  }

  throw new Error(`Expected AppHttpException with code ${expectedCode}`);
}
