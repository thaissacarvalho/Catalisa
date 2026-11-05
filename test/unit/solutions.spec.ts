import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { DirectRemovalUseCase } from '@app/moderation/application/use-cases/direct-removal.use-case';
import { SolutionPresenter } from '@app/solutions/application/presenters/solution.presenter';
import { CreateSolutionUseCase } from '@app/solutions/application/use-cases/create-solution.use-case';
import { ListPublishedSolutionUseCase } from '@app/solutions/application/use-cases/get-published-solution.use-case';
import { ListPublishedSolutionsUseCase } from '@app/solutions/application/use-cases/list-published-solutions.use-case';
import { ListSolutionsForAdminUseCase } from '@app/solutions/application/use-cases/list-solutions-for-admin.use-case';
import { UpdateSolutionStatusUseCase } from '@app/solutions/application/use-cases/update-solution-status.use-case';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import {
  makeChallenge,
  makeSolution,
  makeSolutionDetails,
  makeUser,
} from '@test/unit/factories';

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

function challengeRepositoryMock(): jest.Mocked<ChallengeRepository> {
  return {
    existsActiveById: jest.fn(),
    findAllActive: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };
}

function directRemovalMock() {
  return {
    execute: jest.fn(),
  } as unknown as jest.Mocked<DirectRemovalUseCase>;
}

const input = {
  userCode: 'USER_CODE',
  challengeId: 'challenge-id',
  title: '  My solution ',
  description: '  A useful description ',
};

describe('solution use cases', () => {
  it('creates a normalized published solution', async () => {
    const solutions = solutionRepositoryMock();
    const users = userRepositoryMock();
    const challenges = challengeRepositoryMock();
    users.findByUserCode.mockResolvedValue(makeUser());
    challenges.existsActiveById.mockResolvedValue(true);
    solutions.create.mockImplementation(async (solution) => solution);

    const result = await new CreateSolutionUseCase(
      solutions,
      users,
      challenges,
    ).execute(input);

    expect(result).toMatchObject({
      userCode: input.userCode,
      challengeId: input.challengeId,
      title: 'My solution',
      description: 'A useful description',
      status: SolutionStatus.PUBLISHED,
    });
    expect(result.id).toBeTruthy();
  });

  it.each([
    ['missing user', null, true, CatalisaCodes.INVALID_USER.code],
    [
      'inactive user',
      makeUser({ status: UserStatus.INACTIVE }),
      true,
      CatalisaCodes.INVALID_USER.code,
    ],
    [
      'forbidden role',
      makeUser({ role: UserRole.ADMIN }),
      true,
      CatalisaCodes.FORBIDDEN.code,
    ],
    [
      'missing challenge',
      makeUser(),
      false,
      CatalisaCodes.CHALLENGE_NOT_FOUND.code,
    ],
  ])('rejects %s', async (_label, user, challengeExists, errorCode) => {
    const solutions = solutionRepositoryMock();
    const users = userRepositoryMock();
    const challenges = challengeRepositoryMock();
    users.findByUserCode.mockResolvedValue(user);
    challenges.existsActiveById.mockResolvedValue(challengeExists);

    await expect(
      new CreateSolutionUseCase(solutions, users, challenges).execute(input),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: errorCode }),
    });
  });

  it('maps repository creation failures to a stable application error', async () => {
    const solutions = solutionRepositoryMock();
    const users = userRepositoryMock();
    const challenges = challengeRepositoryMock();
    users.findByUserCode.mockResolvedValue(makeUser());
    challenges.existsActiveById.mockResolvedValue(true);
    solutions.create.mockRejectedValue(new Error('database unavailable'));

    await expect(
      new CreateSolutionUseCase(solutions, users, challenges).execute(input),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_CREATION_FAILED.code,
      }),
    });
  });

  it('gets a published solution and maps query failures/not found', async () => {
    const repository = solutionRepositoryMock();
    const useCase = new ListPublishedSolutionUseCase(repository);
    const details = makeSolutionDetails();
    repository.findPublishedById
      .mockResolvedValueOnce(details)
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error('query failed'));

    await expect(useCase.execute('solution-id')).resolves.toBe(details);
    await expect(useCase.execute('missing')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_NOT_FOUND.code,
      }),
    });
    await expect(useCase.execute('failure')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_QUERY_FAILED.code,
      }),
    });
  });

  it('lists published solutions only for an existing challenge', async () => {
    const solutions = solutionRepositoryMock();
    const challenges = challengeRepositoryMock();
    const details = makeSolutionDetails();
    const useCase = new ListPublishedSolutionsUseCase(solutions, challenges);
    challenges.findById
      .mockResolvedValueOnce(makeChallenge())
      .mockResolvedValueOnce(null);
    solutions.findPublishedByChallenge.mockResolvedValue([details]);

    await expect(useCase.execute('challenge-id')).resolves.toEqual([details]);
    await expect(useCase.execute('missing')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.CHALLENGE_NOT_FOUND.code,
      }),
    });
  });

  it('lists solutions for administrators and rejects forbidden/empty results', async () => {
    const repository = solutionRepositoryMock();
    const useCase = new ListSolutionsForAdminUseCase(repository);
    const details = makeSolutionDetails();

    await expect(useCase.execute(UserRole.PARTICIPANT)).rejects.toMatchObject({
      response: expect.objectContaining({ code: CatalisaCodes.FORBIDDEN.code }),
    });

    repository.findAllForAdmin.mockResolvedValueOnce([]);
    await expect(useCase.execute(UserRole.ADMIN)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_NOT_FOUND.code,
      }),
    });

    repository.findAllForAdmin.mockResolvedValueOnce([details]);
    await expect(useCase.execute(UserRole.SUPER_ADMIN)).resolves.toEqual([
      details,
    ]);
  });

  it('updates a published solution through the repository', async () => {
    const repository = solutionRepositoryMock();
    const directRemoval = directRemovalMock();
    const removed = makeSolution({ status: SolutionStatus.REMOVED });
    const published = makeSolution();
    repository.findById
      .mockResolvedValueOnce(published)
      .mockResolvedValueOnce(removed);

    const result = await new UpdateSolutionStatusUseCase(
      repository,
      directRemoval,
    ).execute(
      published.id,
      SolutionStatus.REMOVED,
      'SUPER_CODE',
      'Policy violation',
      UserRole.SUPER_ADMIN,
    );

    expect(directRemoval.execute).toHaveBeenCalledWith(
      TargetType.SOLUTION,
      published.id,
      'Policy violation',
      'SUPER_CODE',
    );
    expect(result).toBe(removed);
    expect(repository.updateStatus).not.toHaveBeenCalled();
  });

  it('rejects a status update from a participant', async () => {
    const repository = solutionRepositoryMock();
    const directRemoval = directRemovalMock();
    const useCase = new UpdateSolutionStatusUseCase(repository, directRemoval);

    await expect(
      useCase.execute(
        'id',
        SolutionStatus.REMOVED,
        'USER',
        'reason',
        UserRole.PARTICIPANT,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: CatalisaCodes.FORBIDDEN.code }),
    });
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('rejects missing solutions and unchanged statuses', async () => {
    const repository = solutionRepositoryMock();
    const useCase = new UpdateSolutionStatusUseCase(
      repository,
      directRemovalMock(),
    );
    repository.findById.mockResolvedValueOnce(null);
    await expect(
      useCase.execute(
        'id',
        SolutionStatus.PUBLISHED,
        'ADMIN',
        undefined,
        UserRole.ADMIN,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_NOT_FOUND.code,
      }),
    });
  });

  it('requires super-admin approval and a reason for removal', async () => {
    const repository = solutionRepositoryMock();
    const useCase = new UpdateSolutionStatusUseCase(
      repository,
      directRemovalMock(),
    );
    const published = makeSolution();

    repository.findById.mockResolvedValueOnce(published);
    await expect(
      useCase.execute(
        'id',
        SolutionStatus.PUBLISHED,
        'ADMIN',
        undefined,
        UserRole.ADMIN,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_STATUS_UNCHANGED.code,
      }),
    });

    repository.findById.mockResolvedValueOnce(published);
    await expect(
      useCase.execute(
        'id',
        SolutionStatus.REMOVED,
        'ADMIN',
        'reason',
        UserRole.ADMIN,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.REMOVAL_REQUIRES_APPROVAL.code,
      }),
    });

    repository.findById.mockResolvedValueOnce(published);
    await expect(
      useCase.execute(
        'id',
        SolutionStatus.REMOVED,
        'SUPER',
        ' ',
        UserRole.SUPER_ADMIN,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_MODERATION_REASON_REQUIRED.code,
      }),
    });
  });

  it('fails when a directly removed solution cannot be reloaded', async () => {
    const repository = solutionRepositoryMock();
    const directRemoval = directRemovalMock();
    const useCase = new UpdateSolutionStatusUseCase(repository, directRemoval);
    const published = makeSolution();

    repository.findById
      .mockResolvedValueOnce(published)
      .mockResolvedValueOnce(null);
    await expect(
      useCase.execute(
        'id',
        SolutionStatus.REMOVED,
        'SUPER',
        'reason',
        UserRole.SUPER_ADMIN,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_NOT_FOUND.code,
      }),
    });
    expect(directRemoval.execute).toHaveBeenCalledTimes(1);
  });

  it('handles repository failures while restoring a removed solution', async () => {
    const repository = solutionRepositoryMock();
    const useCase = new UpdateSolutionStatusUseCase(
      repository,
      directRemovalMock(),
    );
    const published = makeSolution();

    const removed = makeSolution({ status: SolutionStatus.REMOVED });
    repository.findById.mockResolvedValueOnce(removed);
    repository.updateStatus.mockResolvedValueOnce(null);
    await expect(
      useCase.execute(
        'id',
        SolutionStatus.PUBLISHED,
        'ADMIN',
        undefined,
        UserRole.ADMIN,
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.SOLUTION_NOT_FOUND.code,
      }),
    });

    repository.findById.mockResolvedValueOnce(removed);
    repository.updateStatus.mockResolvedValueOnce(published);
    await expect(
      useCase.execute(
        'id',
        SolutionStatus.PUBLISHED,
        'ADMIN',
        undefined,
        UserRole.ADMIN,
      ),
    ).resolves.toBe(published);
    expect(repository.updateStatus).toHaveBeenLastCalledWith({
      solutionId: 'id',
      status: SolutionStatus.PUBLISHED,
      moderationReason: null,
      moderatedByUserCode: null,
      moderatedAt: null,
    });
  });
});

describe('solution presenter', () => {
  it('creates public, created and admin representations', () => {
    const solution = makeSolution();
    const details = makeSolutionDetails({ solution });

    expect(SolutionPresenter.created(solution)).toMatchObject({
      id: solution.id,
      userCode: solution.userCode,
      status: SolutionStatus.PUBLISHED,
    });
    expect(SolutionPresenter.public(details)).toMatchObject({
      id: solution.id,
      author: details.author,
    });
    expect(SolutionPresenter.admin(details)).toMatchObject({
      id: solution.id,
      moderation: null,
    });
    expect(SolutionPresenter.statusUpdated(solution)).toEqual({
      id: solution.id,
      status: solution.status,
      moderation: null,
    });
  });

  it('includes moderation details for removed solutions', () => {
    const solution = makeSolution({
      status: SolutionStatus.REMOVED,
      moderationReason: 'Reason',
      moderatedAt: new Date('2026-01-03T00:00:00.000Z'),
      moderatedByUserCode: 'ADMIN_CODE',
    });
    const details = makeSolutionDetails({
      solution,
      moderator: {
        userCode: 'ADMIN_CODE',
        name: 'Admin',
        role: UserRole.ADMIN,
      },
    });

    expect(SolutionPresenter.admin(details).moderation).toEqual({
      reason: 'Reason',
      moderatedAt: solution.moderatedAt,
      moderator: details.moderator,
    });
    expect(SolutionPresenter.statusUpdated(solution).moderation).toEqual({
      reason: 'Reason',
      moderatedAt: solution.moderatedAt,
      moderatedByUserCode: 'ADMIN_CODE',
    });
  });
});
