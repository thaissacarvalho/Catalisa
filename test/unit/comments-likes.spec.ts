import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import { CreateCommentUseCase } from '@app/comments/application/use-cases/create-comment.use-case';
import { FindCommentBySolutionUseCase } from '@app/comments/application/use-cases/find-comment-by-solution.use-case';
import { FindCommentUseCase } from '@app/comments/application/use-cases/find-comment.use-case';
import { UpdateCommentStatusUseCase } from '@app/comments/application/use-cases/update-comment-status.use-case';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { TokenCodes } from '@app/common/http/token-codes';
import { toLikeTargetFromDto } from '@app/likes/application/helpers/to-like-target-from-dto.helper';
import { CountByLikeUseCase } from '@app/likes/application/use-cases/count-by-like.use-case';
import { CreateLikeUseCase } from '@app/likes/application/use-cases/create-like.use-case';
import { DeleteLikeUseCase } from '@app/likes/application/use-cases/delete-like.use-case';
import { EnsureLikeTargetVisibleUseCase } from '@app/likes/application/use-cases/ensure-like-target-visible.use-case';
import { LikeEntity } from '@app/likes/domain/entities/like.entity';
import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';
import { DirectRemovalUseCase } from '@app/moderation/application/use-cases/direct-removal.use-case';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import {
  makeComment,
  makeSolutionDetails,
  makeUser,
} from '@test/unit/factories';

function commentRepositoryMock(): jest.Mocked<CommentRepository> {
  return {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findCommentBySolution: jest.fn(),
    updateStatus: jest.fn(),
  };
}

function solutionRepositoryMock(): jest.Mocked<SolutionRepository> {
  return {
    create: jest.fn(),
    findAllForAdmin: jest.fn(),
    findById: jest.fn(),
    findPublishedByChallenge: jest.fn(),
    findPublishedById: jest.fn(),
    updateStatus: jest.fn(),
  };
}

function userRepositoryMock(): jest.Mocked<UserRepository> {
  return {
    create: jest.fn(),
    existsByRole: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findByUserCode: jest.fn(),
    updateStatusByUserCode: jest.fn(),
  };
}

function likeRepositoryMock(): jest.Mocked<LikeRepository> {
  return {
    countBy: jest.fn(),
    createLike: jest.fn(),
    deleteByUserAndTarget: jest.fn(),
    findByUserAndTarget: jest.fn(),
  };
}

function directRemovalMock() {
  return {
    execute: jest.fn(),
  } as unknown as jest.Mocked<DirectRemovalUseCase>;
}

const validComment =
  'This comment contains more than fifty characters and remains below the maximum.';

describe('comment use cases', () => {
  it('creates a normalized comment after validating its relations', async () => {
    const comments = commentRepositoryMock();
    const solutions = solutionRepositoryMock();
    const users = userRepositoryMock();
    users.findByUserCode.mockResolvedValue(makeUser());
    solutions.findPublishedById.mockResolvedValue(makeSolutionDetails());
    comments.find.mockResolvedValue(makeComment());
    comments.create.mockImplementation(async (comment) => comment);

    const result = await new CreateCommentUseCase(
      solutions,
      comments,
      users,
    ).execute({
      solutionId: 'solution-id',
      parentCommentId: 'parent-id',
      userCode: 'USER_CODE',
      comment: `  ${validComment}  `,
    });

    expect(result).toMatchObject({
      solutionId: 'solution-id',
      parentCommentId: 'parent-id',
      userCode: 'USER_CODE',
      comment: validComment,
      status: CommentStatus.ACTIVE,
    });
  });

  it.each([
    ['too short', { comment: 'short' }, TokenCodes.INVALID_COMMENT.code],
    ['too long', { comment: 'x'.repeat(281) }, TokenCodes.INVALID_COMMENT.code],
  ])('rejects invalid text: %s', async (_label, override, errorCode) => {
    const useCase = new CreateCommentUseCase(
      solutionRepositoryMock(),
      commentRepositoryMock(),
      userRepositoryMock(),
    );

    await expect(
      useCase.execute({
        solutionId: 'solution-id',
        userCode: 'USER_CODE',
        ...override,
      }),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: errorCode }),
    });
  });

  it('rejects missing or inactive users and missing solutions', async () => {
    const comments = commentRepositoryMock();
    const solutions = solutionRepositoryMock();
    const users = userRepositoryMock();
    const useCase = new CreateCommentUseCase(solutions, comments, users);
    const data = {
      solutionId: 'solution-id',
      userCode: 'USER_CODE',
      comment: validComment,
    };

    users.findByUserCode.mockResolvedValueOnce(null);
    await expect(useCase.execute(data)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.USER_NOT_FOUND.code,
      }),
    });

    users.findByUserCode.mockResolvedValueOnce(
      makeUser({ status: UserStatus.BLOCKED }),
    );
    await expect(useCase.execute(data)).rejects.toMatchObject({
      response: expect.objectContaining({ code: TokenCodes.FORBIDDEN.code }),
    });

    users.findByUserCode.mockResolvedValueOnce(makeUser());
    solutions.findPublishedById.mockResolvedValueOnce(null);
    await expect(useCase.execute(data)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.SOLUTION_NOT_FOUND.code,
      }),
    });
  });

  it('rejects a missing parent or one from another solution', async () => {
    const comments = commentRepositoryMock();
    const solutions = solutionRepositoryMock();
    const users = userRepositoryMock();
    users.findByUserCode.mockResolvedValue(makeUser());
    solutions.findPublishedById.mockResolvedValue(makeSolutionDetails());
    comments.find
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeComment({ solutionId: 'other-solution' }));
    const useCase = new CreateCommentUseCase(solutions, comments, users);
    const data = {
      solutionId: 'solution-id',
      parentCommentId: 'parent-id',
      userCode: 'USER_CODE',
      comment: validComment,
    };

    await expect(useCase.execute(data)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.PARENT_COMMENT_NOT_FOUND.code,
      }),
    });
    await expect(useCase.execute(data)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.PARENT_COMMENT_NOT_FOUND.code,
      }),
    });
  });

  it('finds comments by a visible solution', async () => {
    const comments = commentRepositoryMock();
    const solutions = solutionRepositoryMock();
    const useCase = new FindCommentBySolutionUseCase(comments, solutions);
    const comment = makeComment();
    solutions.findPublishedById
      .mockResolvedValueOnce(makeSolutionDetails())
      .mockResolvedValueOnce(null);
    comments.findCommentBySolution.mockResolvedValue([comment]);

    await expect(useCase.execute('solution-id')).resolves.toEqual([comment]);
    await expect(useCase.execute('missing')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.SOLUTION_NOT_FOUND.code,
      }),
    });
  });

  it('finds one comment only when its solution remains visible', async () => {
    const comments = commentRepositoryMock();
    const solutions = solutionRepositoryMock();
    const useCase = new FindCommentUseCase(comments, solutions);
    const comment = makeComment();
    comments.find
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(comment)
      .mockResolvedValueOnce(comment);
    solutions.findPublishedById
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeSolutionDetails());

    await expect(useCase.execute('missing')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.COMMENT_NOT_FOUND.code,
      }),
    });
    await expect(useCase.execute('hidden')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.SOLUTION_NOT_FOUND.code,
      }),
    });
    await expect(useCase.execute('comment-id')).resolves.toBe(comment);
  });

  it('updates comment status and covers moderation validation', async () => {
    const comments = commentRepositoryMock();
    const directRemoval = directRemovalMock();
    const useCase = new UpdateCommentStatusUseCase(comments, directRemoval);

    await expect(
      useCase.execute(
        'id',
        CommentStatus.INACTIVE,
        'USER',
        UserRole.PARTICIPANT,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: TokenCodes.FORBIDDEN.code }),
    });

    await expect(
      useCase.execute(
        'id',
        'INVALID' as CommentStatus,
        'ADMIN',
        UserRole.ADMIN,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.INVALID_COMMENT.code,
      }),
    });

    await expect(
      useCase.execute(
        'id',
        CommentStatus.EXCLUDED,
        'ADMIN',
        UserRole.ADMIN,
        'reason',
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.REMOVAL_REQUIRES_APPROVAL.code,
      }),
    });

    await expect(
      useCase.execute(
        'id',
        CommentStatus.EXCLUDED,
        'SUPER',
        UserRole.SUPER_ADMIN,
        ' ',
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.COMMENT_MODERATION_REASON_REQUIRED.code,
      }),
    });

    comments.findById.mockResolvedValueOnce(null);
    await expect(
      useCase.execute(
        'id',
        CommentStatus.EXCLUDED,
        'SUPER',
        UserRole.SUPER_ADMIN,
        'reason',
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.COMMENT_NOT_FOUND.code,
      }),
    });

    const excluded = makeComment({ status: CommentStatus.EXCLUDED });
    comments.findById.mockResolvedValueOnce(excluded);
    await expect(
      useCase.execute(
        'id',
        CommentStatus.EXCLUDED,
        'SUPER',
        UserRole.SUPER_ADMIN,
        'reason',
      ),
    ).resolves.toBe(excluded);

    comments.updateStatus.mockResolvedValueOnce(null);
    await expect(
      useCase.execute('id', CommentStatus.INACTIVE, 'ADMIN', UserRole.ADMIN),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.COMMENT_NOT_FOUND.code,
      }),
    });

    const inactive = makeComment({ status: CommentStatus.INACTIVE });
    comments.updateStatus.mockResolvedValueOnce(inactive);
    await expect(
      useCase.execute('id', CommentStatus.INACTIVE, 'ADMIN', UserRole.ADMIN),
    ).resolves.toBe(inactive);
  });
});

describe('like use cases and helpers', () => {
  const solutionTarget: LikeTarget = {
    type: TargetType.SOLUTION,
    solutionId: 'solution-id',
  };
  const commentTarget: LikeTarget = {
    type: TargetType.COMMENT,
    commentId: 'comment-id',
  };

  it('validates visible solution and comment targets', async () => {
    const solutions = solutionRepositoryMock();
    const comments = commentRepositoryMock();
    const useCase = new EnsureLikeTargetVisibleUseCase(solutions, comments);
    solutions.findPublishedById
      .mockResolvedValueOnce(makeSolutionDetails())
      .mockResolvedValueOnce(null);
    comments.find
      .mockResolvedValueOnce(makeComment())
      .mockResolvedValueOnce(null);

    await expect(useCase.execute(solutionTarget)).resolves.toBeUndefined();
    await expect(useCase.execute(solutionTarget)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.SOLUTION_NOT_FOUND.code,
      }),
    });
    await expect(useCase.execute(commentTarget)).resolves.toBeUndefined();
    await expect(useCase.execute(commentTarget)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.COMMENT_NOT_FOUND.code,
      }),
    });
    await expect(
      useCase.execute({ type: 'INVALID' } as unknown as LikeTarget),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.INVALID_REQUEST.code,
      }),
    });
  });

  it('counts likes after target visibility validation', async () => {
    const repository = likeRepositoryMock();
    const visibleTarget = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EnsureLikeTargetVisibleUseCase>;
    repository.countBy.mockResolvedValue(3);

    await expect(
      new CountByLikeUseCase(repository, visibleTarget).execute(solutionTarget),
    ).resolves.toEqual({ count: 3 });
    expect(visibleTarget.execute).toHaveBeenCalledWith(solutionTarget);
  });

  it('creates a like for an active authorized user', async () => {
    const repository = likeRepositoryMock();
    const users = userRepositoryMock();
    const visibleTarget = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EnsureLikeTargetVisibleUseCase>;
    users.findByUserCode.mockResolvedValue(makeUser());
    repository.findByUserAndTarget.mockResolvedValue(null);
    repository.createLike.mockImplementation(async (like) => like);

    const result = await new CreateLikeUseCase(
      repository,
      users,
      visibleTarget,
    ).execute('USER_CODE', solutionTarget);

    expect(result).toBeInstanceOf(LikeEntity);
    expect(result).toMatchObject({
      userCode: 'USER_CODE',
      target: solutionTarget,
    });
  });

  it('rejects invalid users and duplicate likes', async () => {
    const repository = likeRepositoryMock();
    const users = userRepositoryMock();
    const visibleTarget = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EnsureLikeTargetVisibleUseCase>;
    const useCase = new CreateLikeUseCase(repository, users, visibleTarget);

    users.findByUserCode.mockResolvedValueOnce(null);
    await expect(useCase.execute('USER', solutionTarget)).rejects.toMatchObject(
      {
        response: expect.objectContaining({
          code: TokenCodes.USER_NOT_FOUND.code,
        }),
      },
    );

    users.findByUserCode.mockResolvedValueOnce(
      makeUser({ role: UserRole.ADMIN }),
    );
    await expect(useCase.execute('USER', solutionTarget)).rejects.toMatchObject(
      {
        response: expect.objectContaining({ code: TokenCodes.FORBIDDEN.code }),
      },
    );

    users.findByUserCode.mockResolvedValueOnce(
      makeUser({ status: UserStatus.INACTIVE }),
    );
    await expect(useCase.execute('USER', solutionTarget)).rejects.toMatchObject(
      {
        response: expect.objectContaining({ code: TokenCodes.FORBIDDEN.code }),
      },
    );

    users.findByUserCode.mockResolvedValueOnce(makeUser());
    repository.findByUserAndTarget.mockResolvedValueOnce(
      new LikeEntity('like-id', 'USER', solutionTarget),
    );
    await expect(useCase.execute('USER', solutionTarget)).rejects.toMatchObject(
      {
        response: expect.objectContaining({
          code: TokenCodes.LIKE_ALREADY_EXISTS.code,
        }),
      },
    );
  });

  it('deletes likes idempotently and validates the actor', async () => {
    const repository = likeRepositoryMock();
    const users = userRepositoryMock();
    const useCase = new DeleteLikeUseCase(repository, users);
    users.findByUserCode
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeUser({ role: UserRole.ADMIN }))
      .mockResolvedValueOnce(makeUser({ status: UserStatus.BLOCKED }))
      .mockResolvedValueOnce(makeUser());

    await expect(useCase.execute('USER', solutionTarget)).rejects.toMatchObject(
      {
        response: expect.objectContaining({
          code: TokenCodes.USER_NOT_FOUND.code,
        }),
      },
    );
    await expect(useCase.execute('USER', solutionTarget)).rejects.toMatchObject(
      {
        response: expect.objectContaining({ code: TokenCodes.FORBIDDEN.code }),
      },
    );
    await expect(useCase.execute('USER', solutionTarget)).rejects.toMatchObject(
      {
        response: expect.objectContaining({ code: TokenCodes.FORBIDDEN.code }),
      },
    );
    await expect(
      useCase.execute('USER', solutionTarget),
    ).resolves.toBeUndefined();
    expect(repository.deleteByUserAndTarget).toHaveBeenCalledWith(
      'USER',
      solutionTarget,
    );
  });

  it('maps DTO target identifiers to the domain union', () => {
    expect(
      toLikeTargetFromDto({
        type: TargetType.SOLUTION,
        targetId: 'solution-id',
      }),
    ).toEqual(solutionTarget);
    expect(
      toLikeTargetFromDto({ type: TargetType.COMMENT, targetId: 'comment-id' }),
    ).toEqual(commentTarget);
  });
});
