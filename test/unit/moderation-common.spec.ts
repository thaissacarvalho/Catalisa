import { ensureAdmin } from '@app/common/authorization/ensure-admin';
import { ensureCanLike } from '@app/common/authorization/ensure-can-like';
import { ensureCanPublishSolution } from '@app/common/authorization/ensure-can-publish-solution';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { errorResponse } from '@app/common/http/error-response';
import { successResponse } from '@app/common/http/success-response';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { CreateRemovalRequestUseCase } from '@app/moderation/application/use-cases/create-removal-request.use-case';
import { DirectRemovalUseCase } from '@app/moderation/application/use-cases/direct-removal.use-case';
import { ListRemovalRequestsUseCase } from '@app/moderation/application/use-cases/list-removal-requests.use-case';
import { ReviewRemovalRequestUseCase } from '@app/moderation/application/use-cases/review-removal-request.use-case';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { ModerationRepository } from '@app/moderation/domain/repositories/moderation.repository';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { generateUserCode } from '@app/utils/generateUserCode';
import {
  expectSyncTokenError,
  makeModerationDetails,
} from '@test/unit/factories';

function moderationRepositoryMock(): jest.Mocked<ModerationRepository> {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    removeDirect: jest.fn(),
    review: jest.fn(),
  };
}

describe('moderation use cases', () => {
  it('creates a pending removal request for an administrator', async () => {
    const repository = moderationRepositoryMock();
    const details = makeModerationDetails();
    repository.create.mockResolvedValue(details);

    await expect(
      new CreateRemovalRequestUseCase(repository).execute(
        TargetType.SOLUTION,
        'solution-id',
        '  Policy violation  ',
        'ADMIN_CODE',
        UserRole.ADMIN,
      ),
    ).resolves.toBe(details);

    const request = repository.create.mock.calls[0]![0];
    expect(request).toMatchObject({
      targetType: TargetType.SOLUTION,
      targetId: 'solution-id',
      status: ModerationRequestStatus.PENDING,
      reason: 'Policy violation',
      requestedByUserCode: 'ADMIN_CODE',
    });
  });

  it('rejects removal requests from participants', () => {
    const repository = moderationRepositoryMock();

    expectSyncTokenError(
      () =>
        new CreateRemovalRequestUseCase(repository).execute(
          TargetType.COMMENT,
          'comment-id',
          'reason',
          'USER_CODE',
          UserRole.PARTICIPANT,
        ),
      CatalisaCodes.FORBIDDEN.code,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('records direct removal as an approved request', async () => {
    const repository = moderationRepositoryMock();
    const details = makeModerationDetails();
    repository.removeDirect.mockResolvedValue(details);

    await expect(
      new DirectRemovalUseCase(repository).execute(
        TargetType.COMMENT,
        'comment-id',
        '  Direct reason ',
        'SUPER_CODE',
      ),
    ).resolves.toBe(details);

    const request = repository.removeDirect.mock.calls[0]![0];
    expect(request).toMatchObject({
      status: ModerationRequestStatus.APPROVED,
      reason: 'Direct reason',
      requestedByUserCode: 'SUPER_CODE',
      reviewedByUserCode: 'SUPER_CODE',
      reviewReason: 'Direct reason',
    });
    expect(request.reviewedAt).toBeInstanceOf(Date);
  });

  it('lists requests for admins and forwards the optional status', async () => {
    const repository = moderationRepositoryMock();
    const details = makeModerationDetails();
    repository.findAll.mockResolvedValue([details]);
    const useCase = new ListRemovalRequestsUseCase(repository);

    await expect(
      useCase.execute(UserRole.ADMIN, ModerationRequestStatus.PENDING),
    ).resolves.toEqual([details]);
    expect(repository.findAll).toHaveBeenCalledWith(
      ModerationRequestStatus.PENDING,
    );
    expectSyncTokenError(
      () => useCase.execute(UserRole.PARTICIPANT),
      CatalisaCodes.FORBIDDEN.code,
    );
  });

  it('reviews a request and validates the reviewer and reason', async () => {
    const repository = moderationRepositoryMock();
    const details = makeModerationDetails();
    repository.review.mockResolvedValue(details);
    const useCase = new ReviewRemovalRequestUseCase(repository);

    expectSyncTokenError(
      () =>
        useCase.execute(
          'request-id',
          ModerationRequestStatus.APPROVED,
          'USER_CODE',
          UserRole.PARTICIPANT,
          'reason',
        ),
      CatalisaCodes.FORBIDDEN.code,
    );

    expectSyncTokenError(
      () =>
        useCase.execute(
          'request-id',
          ModerationRequestStatus.REJECTED,
          'ADMIN_CODE',
          UserRole.ADMIN,
          ' ',
        ),
      CatalisaCodes.REVIEW_REASON_REQUIRED.code,
    );

    await expect(
      useCase.execute(
        'request-id',
        ModerationRequestStatus.REJECTED,
        'ADMIN_CODE',
        UserRole.ADMIN,
        'Insufficient evidence',
      ),
    ).resolves.toBe(details);
    expect(repository.review).toHaveBeenCalledWith({
      requestId: 'request-id',
      decision: ModerationRequestStatus.REJECTED,
      reviewerUserCode: 'ADMIN_CODE',
      reviewReason: 'Insufficient evidence',
    });
  });
});

describe('authorization and HTTP helpers', () => {
  it('authorizes only admin roles for administrative actions', () => {
    expect(() => ensureAdmin(UserRole.ADMIN)).not.toThrow();
    expect(() => ensureAdmin(UserRole.SUPER_ADMIN)).not.toThrow();
    expectSyncTokenError(
      () => ensureAdmin(UserRole.PARTICIPANT),
      CatalisaCodes.FORBIDDEN.code,
    );
  });

  it('authorizes participants and super admins to like and publish', () => {
    for (const role of [UserRole.PARTICIPANT, UserRole.SUPER_ADMIN]) {
      expect(() => ensureCanLike(role)).not.toThrow();
      expect(() => ensureCanPublishSolution(role)).not.toThrow();
    }
    expectSyncTokenError(
      () => ensureCanLike(UserRole.ADMIN),
      CatalisaCodes.FORBIDDEN.code,
    );
    expectSyncTokenError(
      () => ensureCanPublishSolution(UserRole.ADMIN),
      CatalisaCodes.FORBIDDEN.code,
    );
  });

  it('creates stable error and success response envelopes', () => {
    expect(errorResponse(CatalisaCodes.INVALID_REQUEST)).toEqual({
      success: false,
      type: 'ERROR',
      code: 'MCODE-019',
      message: 'Invalid request',
      statusCode: 400,
    });
    expect(successResponse(CatalisaCodes.USER_CREATED, { id: 'user-id' })).toEqual(
      {
        success: true,
        type: 'SUCCESS',
        code: 'MCODE-S001',
        message: 'User created',
        statusCode: 201,
        data: { id: 'user-id' },
      },
    );

    const exception = new AppHttpException(CatalisaCodes.FORBIDDEN);
    expect(exception.getStatus()).toBe(403);
    expect(exception.getResponse()).toEqual(
      errorResponse(CatalisaCodes.FORBIDDEN),
    );
  });

  it('generates unique user codes with the expected format', () => {
    const first = generateUserCode();
    const second = generateUserCode();

    expect(first).toMatch(/^USER_[a-f0-9]{32}$/);
    expect(second).toMatch(/^USER_[a-f0-9]{32}$/);
    expect(first).not.toBe(second);
  });
});
