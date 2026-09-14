import { Sequelize } from 'sequelize';

import ChallengeModel from '@app/challenges/infrastructure/persistence/sequelize/models/challenge.model';
import CommentModel from '@app/comments/infrastructure/persistence/sequelize/models/comment.model';
import config from '@app/config/sequelizeCli';
import LikeModel from '@app/likes/infrastructure/persistence/sequelize/models/like.model';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

type Env = 'development' | 'production';
const currentEnvironment: Env = (process.env.NODE_ENV as Env) || 'development';
const databaseConfig = config[currentEnvironment];

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect as any,
  },
);

export default {
  sequelize,
  Solutions: SolutionModel,
  Users: UserModel,
  Likes: LikeModel,
  Comments: CommentModel,
  Challenges: ChallengeModel,
};
