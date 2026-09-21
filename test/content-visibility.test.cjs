const { test } = require('node:test');
const assert = require('node:assert/strict');
Object.assign(process.env, {
  NODE_ENV: 'test',
  JWT_SECRET: 'test-only-secret-with-at-least-32-bytes',
  DB_HOST: '127.0.0.1',
  DB_PORT: '5432',
  DB_NAME: 'unused',
  DB_USERNAME: 'unused',
  DB_PASSWORD: 'unused',
});
require('reflect-metadata');
require('ts-node/register');
require('tsconfig-paths/register');
const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');
const {
  CreateCommentDto,
} = require('../src/comments/application/dto/create-comment.dto');
const {
  CreateCommentUseCase,
} = require('../src/comments/application/use-cases/create-comment.use-case');
const {
  FindCommentUseCase,
} = require('../src/comments/application/use-cases/find-comment.use-case');
const {
  FindCommentBySolutionUseCase,
} = require('../src/comments/application/use-cases/find-comment-by-solution.use-case');
const {
  UpdateCommentStatusUseCase,
} = require('../src/comments/application/use-cases/update-comment-status.use-case');
const {
  SequelizeCommentRepository,
} = require('../src/comments/infrastructure/persistence/sequelize/repositories/sequelize-comment.repository');
const {
  SequelizeSolutionRepository,
} = require('../src/solutions/infrastructure/persistence/sequelize/repositories/sequelize-solution.repository');
const {
  SequelizeLikeRepository,
} = require('../src/likes/infrastructure/persistence/sequelize/repositories/sequelize-like.repository');
const {
  CountLikesUseCase,
} = require('../src/likes/application/use-cases/count-likes.use-case');
const CommentModel =
  require('../src/comments/infrastructure/persistence/sequelize/models/comment.model').default;
const SolutionModel =
  require('../src/solutions/infrastructure/persistence/sequelize/models/solution.model').default;
const LikeModel =
  require('../src/likes/infrastructure/persistence/sequelize/models/like.model').default;
const { sequelize } = require('../src/database/sequelize');
const {
  initializeModelAssociations,
} = require('../src/database/model-associations');
initializeModelAssociations();
const id = 'a16311d5-d396-4586-b438-bd4f9121fa83';
const input = {
  solutionId: id,
  userCode: 'USER_' + 'a'.repeat(32),
  comment: '  ' + 'a'.repeat(50) + '  ',
};
const statusError = (status) => (error) => error.getStatus() === status;

test('create trims text, validates active author and visible solution before writing', async () => {
  let saved = 0;
  const comments = {
    create: async (value) => {
      saved++;
      return value;
    },
  };
  const solutions = { findPublishedById: async () => ({}) };
  const users = { findByUserCode: async () => ({ status: 'ACTIVE' }) };
  const useCase = new CreateCommentUseCase(solutions, comments, users);
  assert.equal((await useCase.execute(input)).comment, 'a'.repeat(50));
  users.findByUserCode = async () => null;
  await assert.rejects(useCase.execute(input), statusError(404));
  users.findByUserCode = async () => ({ status: 'INACTIVE' });
  await assert.rejects(useCase.execute(input), statusError(403));
  users.findByUserCode = async () => ({ status: 'ACTIVE' });
  solutions.findPublishedById = async () => null;
  await assert.rejects(useCase.execute(input), statusError(404));
  await assert.rejects(
    useCase.execute({ ...input, comment: ' '.repeat(60) }),
    statusError(400),
  );
  assert.equal(saved, 1);
});

test('DTO trims before checking the 50–280 character limit', async () => {
  const dto = plainToInstance(CreateCommentDto, input);
  assert.equal(dto.comment.length, 50);
  assert.equal((await validate(dto)).length, 0);
  for (const comment of [' '.repeat(60), 'a'.repeat(49), 'a'.repeat(281)]) {
    assert.ok(
      (await validate(plainToInstance(CreateCommentDto, { ...input, comment })))
        .length,
    );
  }
});

test('public reads return 404 for hidden resources and [] for an empty visible solution', async () => {
  const solutions = { findPublishedById: async () => ({}) };
  const comments = {
    find: async () => null,
    findCommentBySolution: async () => [],
  };
  await assert.rejects(
    new FindCommentUseCase(comments, solutions).execute(id),
    statusError(404),
  );
  assert.deepEqual(
    await new FindCommentBySolutionUseCase(comments, solutions).execute(id),
    [],
  );
  solutions.findPublishedById = async () => null;
  await assert.rejects(
    new FindCommentBySolutionUseCase(comments, solutions).execute(id),
    statusError(404),
  );
  let counted = false;
  await assert.rejects(
    new CountLikesUseCase(
      {
        countVisibleBySolution: async () => {
          counted = true;
          return 0;
        },
      },
      solutions,
    ).execute(id),
    statusError(404),
  );
  assert.equal(counted, false);
});

function assertVisibleIncludes(include, actorAssociation) {
  const actor = include.find((item) => item.association === actorAssociation);
  assert.equal(actor.required, true);
  assert.equal(actor.where.status, 'ACTIVE');
  const solution = include.find((item) => item.association === 'solution');
  assert.equal(solution.required, true);
  assert.equal(solution.where.status, 'PUBLISHED');
  assert.equal(solution.include[0].required, true);
  assert.equal(solution.include[0].where.status, 'ACTIVE');
}

test('comment queries and like counts enforce visibility for both authors', async (t) => {
  t.mock.method(CommentModel, 'findAll', async (options) => {
    assert.equal(options.where.status, 'ACTIVE');
    assertVisibleIncludes(options.include, 'author');
    assert.deepEqual(options.order, [
      ['createdAt', 'ASC'],
      ['id', 'ASC'],
    ]);
    return [];
  });
  t.mock.method(CommentModel, 'findOne', async (options) => {
    assert.equal(options.where.status, 'ACTIVE');
    assertVisibleIncludes(options.include, 'author');
    return null;
  });
  t.mock.method(LikeModel, 'count', async (options) => {
    assertVisibleIncludes(options.include, 'user');
    assert.equal(options.distinct, true);
    return 2;
  });
  const repo = new SequelizeCommentRepository();
  assert.deepEqual(await repo.findCommentBySolution(id), []);
  assert.equal(await repo.find(id), null);
  assert.equal(
    await new SequelizeLikeRepository().countVisibleBySolution(id),
    2,
  );
  assert.ok(CommentModel.associations.author);
});

test('public Solutions filter inactive authors; administrative queries retain them', async (t) => {
  t.mock.method(SolutionModel, 'findOne', async (options) => {
    assert.equal(options.where.status, 'PUBLISHED');
    assert.equal(options.include[0].where.status, 'ACTIVE');
    return null;
  });
  let calls = 0;
  t.mock.method(SolutionModel, 'findAll', async (options) => {
    if (calls++ === 0) assert.equal(options.include[0].where.status, 'ACTIVE');
    else assert.equal(options.include[0].where, undefined);
    return [];
  });
  const repo = new SequelizeSolutionRepository();
  await repo.findPublishedById(id);
  await repo.findPublishedByChallenge(1);
  await repo.findAllForAdmin();
});

test('moderation locks the row; exclusion is final and unchanged status conflicts', async (t) => {
  const transaction = { LOCK: { UPDATE: 'UPDATE' } };
  t.mock.method(sequelize, 'transaction', async (callback) =>
    callback(transaction),
  );
  let row;
  let saves = 0;
  t.mock.method(CommentModel, 'findByPk', async (_id, options) => {
    assert.equal(options.transaction, transaction);
    assert.equal(options.lock, 'UPDATE');
    return row;
  });
  const repo = new SequelizeCommentRepository();
  const useCase = new UpdateCommentStatusUseCase(repo);
  for (const [from, to, allowed] of [
    ['ACTIVE', 'INACTIVE', true],
    ['INACTIVE', 'ACTIVE', true],
    ['ACTIVE', 'EXCLUDED', true],
    ['INACTIVE', 'EXCLUDED', true],
    ['EXCLUDED', 'ACTIVE', false],
    ['EXCLUDED', 'INACTIVE', false],
    ['ACTIVE', 'ACTIVE', false],
    ['EXCLUDED', 'EXCLUDED', false],
  ]) {
    row = {
      status: from,
      save: async () => {
        saves++;
      },
      reload: async () => {},
    };
    if (allowed)
      assert.equal((await useCase.execute(id, to, 'ADMIN')).status, to);
    else
      await assert.rejects(
        useCase.execute(id, to, 'SUPER_ADMIN'),
        statusError(409),
      );
  }
  assert.equal(saves, 4);
  await assert.rejects(useCase.execute(id, 'ACTIVE', 'USER'), statusError(403));
  await assert.rejects(useCase.execute(id, 'OTHER', 'ADMIN'), statusError(400));
  row = null;
  await assert.rejects(
    useCase.execute(id, 'ACTIVE', 'ADMIN'),
    statusError(404),
  );
});

test('Nest resolves Comments and Likes dependencies without a database connection', async (t) => {
  t.mock.method(sequelize, 'authenticate', async () => {});
  t.mock.method(sequelize, 'close', async () => {});
  const { NestFactory } = require('@nestjs/core');
  const { AppModule } = require('../src/app.module');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
    abortOnError: false,
  });
  try {
    assert.ok(app.get(CreateCommentUseCase));
    assert.ok(app.get(CountLikesUseCase));
  } finally {
    await app.close();
  }
});
