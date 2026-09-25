import ChallengeModel from '@app/challenges/infrastructure/persistence/sequelize/models/challenge.model';
import CommentModel from '@app/comments/infrastructure/persistence/sequelize/models/comment.model';
import LikeModel from '@app/likes/infrastructure/persistence/sequelize/models/like.model';
import ModerationRequestModel from '@app/moderation/infrastructure/persistence/sequelize/models/moderation-request.model';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

let associationsInitialized = false;

export function initializeModelAssociations(): void {
  if (associationsInitialized) {
    return;
  }

  SolutionModel.belongsTo(UserModel, {
    as: 'author',
    foreignKey: 'userCode',
    targetKey: 'userCode',
  });

  UserModel.hasMany(SolutionModel, {
    as: 'authoredSolutions',
    foreignKey: 'userCode',
    sourceKey: 'userCode',
  });

  SolutionModel.belongsTo(UserModel, {
    as: 'moderator',
    foreignKey: 'moderatedByUserCode',
    targetKey: 'userCode',
  });

  UserModel.hasMany(SolutionModel, {
    as: 'moderatedSolutions',
    foreignKey: 'moderatedByUserCode',
    sourceKey: 'userCode',
  });

  SolutionModel.belongsTo(ChallengeModel, {
    as: 'challenge',
    foreignKey: 'challengeId',
    targetKey: 'id',
  });

  ChallengeModel.hasMany(SolutionModel, {
    as: 'solutions',
    foreignKey: 'challengeId',
    sourceKey: 'id',
  });

  SolutionModel.hasMany(CommentModel, {
    as: 'comments',
    foreignKey: 'solutionId',
    sourceKey: 'id',
  });

  CommentModel.belongsTo(SolutionModel, {
    as: 'solution',
    foreignKey: 'solutionId',
    targetKey: 'id',
  });

  CommentModel.belongsTo(CommentModel, {
    as: 'parentComment',
    foreignKey: 'parentCommentId',
    targetKey: 'id',
  });

  CommentModel.hasMany(CommentModel, {
    as: 'replies',
    foreignKey: 'parentCommentId',
    sourceKey: 'id',
  });

  SolutionModel.hasMany(LikeModel, {
    as: 'likes',
    foreignKey: 'solutionId',
    sourceKey: 'id',
  });

  LikeModel.belongsTo(SolutionModel, {
    as: 'solution',
    foreignKey: 'solutionId',
    targetKey: 'id',
  });

  CommentModel.belongsTo(UserModel, {
    as: 'author',
    foreignKey: 'userCode',
    targetKey: 'userCode',
  });

  UserModel.hasMany(CommentModel, {
    as: 'comments',
    foreignKey: 'userCode',
    sourceKey: 'userCode',
  });

  CommentModel.belongsTo(UserModel, {
    as: 'moderator',
    foreignKey: 'moderatedByUserCode',
    targetKey: 'userCode',
  });

  LikeModel.belongsTo(UserModel, {
    as: 'user',
    foreignKey: 'userCode',
    targetKey: 'userCode',
  });

  UserModel.hasMany(LikeModel, {
    as: 'likes',
    foreignKey: 'userCode',
    sourceKey: 'userCode',
  });

  LikeModel.belongsTo(CommentModel, {
    as: 'comment',
    foreignKey: 'commentId',
    targetKey: 'id',
  });

  CommentModel.hasMany(LikeModel, {
    as: 'likes',
    foreignKey: 'commentId',
    sourceKey: 'id',
  });

  ModerationRequestModel.belongsTo(UserModel, {
    as: 'requestedBy',
    foreignKey: 'requestedByUserCode',
    targetKey: 'userCode',
  });

  UserModel.hasMany(ModerationRequestModel, {
    as: 'requestedModerations',
    foreignKey: 'requestedByUserCode',
    sourceKey: 'userCode',
  });

  ModerationRequestModel.belongsTo(UserModel, {
    as: 'reviewedBy',
    foreignKey: 'reviewedByUserCode',
    targetKey: 'userCode',
  });

  UserModel.hasMany(ModerationRequestModel, {
    as: 'reviewedModerations',
    foreignKey: 'reviewedByUserCode',
    sourceKey: 'userCode',
  });

  associationsInitialized = true;
}
