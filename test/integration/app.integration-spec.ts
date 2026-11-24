import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@app/app.module';
import { AuthenticationService } from '@app/common/authentication/authentication.service';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { AppHttpExceptionFilter } from '@app/common/http/filters/app-http-exception.filter';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { environment } from '@app/config/environment';
import { sequelize } from '@app/database/sequelize';
import seedChallenges from '../../seeders/001-create-challenges';

describe('application integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    app.useGlobalFilters(new AppHttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: () =>
          new AppHttpException(CatalisaCodes.INVALID_REQUEST),
      }),
    );
    app.enableCors();
    await app.init();

    await app.get(AuthenticationService).createInitialSuperAdmin();
    await seedChallenges.up(sequelize.getQueryInterface());
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('creates compatible UUID foreign keys through the migrations', async () => {
    const queryInterface = sequelize.getQueryInterface();
    const [challenges, solutions] = await Promise.all([
      queryInterface.describeTable('challenges'),
      queryInterface.describeTable('solutions'),
    ]);

    expect(challenges.id?.type).toBe('UUID');
    expect(solutions.challengeId?.type).toBe('UUID');

    const foreignKeys =
      await queryInterface.getForeignKeyReferencesForTable('solutions');

    expect(foreignKeys).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          columnName: 'challengeId',
          referencedTableName: 'challenges',
          referencedColumnName: 'id',
        }),
      ]),
    );
  });

  it('validates DTOs and persists/query users through the HTTP boundary', async () => {
    const invalid = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: '',
        email: 'invalid-email',
        unexpected: true,
      })
      .expect(400);

    expect(invalid.body).toMatchObject({
      success: false,
      code: CatalisaCodes.INVALID_REQUEST.code,
    });

    const created = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: '  Integration User  ',
        email: 'integration.user@example.com',
        jobPosition: '  Developer  ',
        enterprise: '  CATALISA  ',
      })
      .expect(201);

    expect(created.body).toMatchObject({
      success: true,
      code: CatalisaCodes.USER_CREATED.code,
      data: {
        name: 'Integration User',
        email: 'integration.user@example.com',
        jobPosition: 'Developer',
        enterprise: 'CATALISA',
      },
    });
    expect(created.body.data.userCode).toMatch(/^USER_[a-f0-9]{32}$/);

    const found = await request(app.getHttpServer())
      .get(`/users/${created.body.data.userCode}`)
      .expect(200);

    expect(found.body).toEqual({
      success: true,
      type: 'SUCCESS',
      code: CatalisaCodes.USER_FOUND.code,
      message: CatalisaCodes.USER_FOUND.message,
      statusCode: CatalisaCodes.USER_FOUND.statusCode,
      data: {
        userCode: created.body.data.userCode,
        name: 'Integration User',
        jobPosition: 'Developer',
        enterprise: 'CATALISA',
      },
    });

    const duplicate = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Duplicate',
        email: 'INTEGRATION.USER@EXAMPLE.COM',
        jobPosition: 'Developer',
        enterprise: 'CATALISA',
      })
      .expect(409);

    expect(duplicate.body.code).toBe(CatalisaCodes.USER_ALREADY_EXISTS.code);

    const missing = await request(app.getHttpServer())
      .get('/users/USER_DOES_NOT_EXIST')
      .expect(404);

    expect(missing.body.code).toBe(CatalisaCodes.USER_NOT_FOUND.code);
  });

  it('retrieves challenges and publishes and lists solutions using UUIDs', async () => {
    const api = request(app.getHttpServer());
    const challenges = await api.get('/challenges').expect(200);
    const challengeId: string = challenges.body.data[0].id;

    await api.get('/challenges/1').expect(400);
    const challenge = await api.get(`/challenges/${challengeId}`).expect(200);
    expect(challenge.body.data.id).toBe(challengeId);

    const participant = await api
      .post('/users')
      .send({
        name: 'Solution Author',
        email: 'solution.author@example.com',
        jobPosition: 'Developer',
        enterprise: 'CATALISA',
      })
      .expect(201);

    const solution = await api
      .post('/solutions')
      .send({
        userCode: participant.body.data.userCode,
        challengeId,
        title: 'A proposal for the challenge',
        description: 'A solution submitted to an active challenge.',
      })
      .expect(201);

    const published = await api
      .get(`/challenges/${challengeId}/solutions`)
      .expect(200);
    expect(published.body.data).toEqual([
      expect.objectContaining({ id: solution.body.data.id, challengeId }),
    ]);
  });

  it('persists credentials transactionally and invalidates rotated tokens', async () => {
    const invalidLogin = await request(app.getHttpServer())
      .post('/authentication/admin/login')
      .send({
        email: environment.authentication.initialSuperAdmin.email,
        password: 'WrongPassword123',
      })
      .expect(401);

    expect(invalidLogin.body.code).toBe(
      CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
    );

    const login = await request(app.getHttpServer())
      .post('/authentication/admin/login')
      .send({
        email: environment.authentication.initialSuperAdmin.email.toUpperCase(),
        password: environment.authentication.initialSuperAdmin.password,
      })
      .expect(200);

    const initialToken: string = login.body.data.accessToken;

    expect(login.body.data.user.mustChangePassword).toBe(true);

    await request(app.getHttpServer())
      .get('/authentication/me')
      .set('Authorization', `Bearer ${initialToken}`)
      .expect(200);

    const passwordUpdate = await request(app.getHttpServer())
      .patch('/authentication/admin/password')
      .set('Authorization', `Bearer ${initialToken}`)
      .send({
        currentPassword: environment.authentication.initialSuperAdmin.password,
        newPassword: 'Admin@Integration456',
      })
      .expect(200);
    const rotatedToken: string = passwordUpdate.body.data.accessToken;
    expect(rotatedToken).not.toBe(initialToken);
    expect(passwordUpdate.body.data.user.mustChangePassword).toBe(false);

    const staleToken = await request(app.getHttpServer())
      .get('/authentication/me')
      .set('Authorization', `Bearer ${initialToken}`)
      .expect(401);
    expect(staleToken.body.code).toBe(CatalisaCodes.INVALID_ACCESS_TOKEN.code);

    await request(app.getHttpServer())
      .get('/authentication/me')
      .set('Authorization', `Bearer ${rotatedToken}`)
      .expect(200);

    const participant = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Promoted User',
        email: 'promoted.user@example.com',
        jobPosition: 'Developer',
        enterprise: 'CATALISA',
      })
      .expect(201);

    const promotion = await request(app.getHttpServer())
      .post(
        `/authentication/admin/users/${participant.body.data.userCode}/promote`,
      )
      .set('Authorization', `Bearer ${rotatedToken}`)
      .expect(201);

    expect(promotion.body.data).toMatchObject({
      userCode: participant.body.data.userCode,
      role: 'ADMIN',
      mustChangePassword: true,
    });

    expect(promotion.body.data.temporaryPassword).toEqual(expect.any(String));
    expect(promotion.body.data.temporaryPassword).not.toHaveLength(0);

    const promotedLogin = await request(app.getHttpServer())
      .post('/authentication/admin/login')
      .send({
        email: 'promoted.user@example.com',
        password: promotion.body.data.temporaryPassword,
      })
      .expect(200);

    expect(promotedLogin.body.data.user).toMatchObject({
      userCode: participant.body.data.userCode,
      role: 'ADMIN',
      mustChangePassword: true,
    });
  });

  it('validates challenge UUIDs before changing status', async () => {
    const api = request(app.getHttpServer());
    const challenges = await api.get('/challenges').expect(200);
    const challengeId: string = challenges.body.data.at(-1).id;

    const participant = await api
      .post('/users')
      .send({
        name: 'Challenge Moderator',
        email: 'challenge.moderator@example.com',
        jobPosition: 'Moderator',
        enterprise: 'CATALISA',
      })
      .expect(201);
    const authentication = app.get(AuthenticationService);
    const credentials = await authentication.promoteToAdmin(
      participant.body.data.userCode,
    );
    const admin = await authentication.updateAdminPassword(
      credentials.userCode,
      credentials.temporaryPassword,
      'Moderator@Integration123',
    );
    const authorization = `Bearer ${admin.accessToken}`;

    await api
      .patch('/admin/challenges/1/status')
      .set('Authorization', authorization)
      .send({ status: 'INACTIVE' })
      .expect(400);
    const updated = await api
      .patch(`/admin/challenges/${challengeId}/status`)
      .set('Authorization', authorization)
      .send({ status: 'INACTIVE' })
      .expect(200);
    expect(updated.body.data).toMatchObject({
      id: challengeId,
      status: 'INACTIVE',
    });
    await api.get(`/challenges/${challengeId}`).expect(404);
  });
});
