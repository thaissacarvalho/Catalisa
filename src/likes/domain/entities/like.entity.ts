import { LikeTarget } from '@app/likes/domain/enums/like-type.enum';

export class LikeEntity {
  constructor(
    public readonly id: string,
    public readonly userCode: string,
    public readonly target: LikeTarget,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}