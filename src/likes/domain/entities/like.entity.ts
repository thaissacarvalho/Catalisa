import { LikeTarget } from '@app/likes/domain/types/like-target.type';

export class LikeEntity {
  constructor(
    public readonly id: string,
    public readonly userCode: string,
    public readonly target: LikeTarget,
    public readonly createdAt: Date | null = null,
    public readonly updatedAt: Date | null = null,
  ) {}
}
