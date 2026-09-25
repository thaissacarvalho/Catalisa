import { Module } from '@nestjs/common';

import { ChallengesModule } from '@app/challenges/challenges.module';
import { AuthenticationModule } from '@app/common/authentication/authentication.module';
import { CommentsModule } from '@app/comments/comments.module';
import { DatabaseModule } from '@app/database/database.module';
import { LikesModule } from '@app/likes/likes.module';
import { ModerationModule } from '@app/moderation/moderation.module';
import { SolutionsModule } from '@app/solutions/solutions.module';
import { UsersModule } from '@app/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    ChallengesModule,
    SolutionsModule,
    CommentsModule,
    LikesModule,
    ModerationModule,
  ],
})
export class AppModule {}
