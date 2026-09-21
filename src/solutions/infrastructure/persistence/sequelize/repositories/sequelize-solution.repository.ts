import { Injectable } from '@nestjs/common';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { UpdateSolutionStatusInput } from '@app/solutions/domain/repositories/update-solution-status.input';
import { SolutionMapper } from '@app/solutions/infrastructure/persistence/sequelize/mappers/solution.mapper';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';

const authorInclude = {
  association: 'author',
  attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
  required: true,
  where: {
    status: UserStatus.ACTIVE,
  },
};

const moderatorInclude = {
  association: 'moderator',
  attributes: ['userCode', 'name', 'role'],
  required: false,
};

@Injectable()
export class SequelizeSolutionRepository implements SolutionRepository {
  async create(solution: SolutionEntity): Promise<SolutionEntity> {
    const model = await SolutionModel.create(
      SolutionMapper.toPersistence(solution),
    );

    return SolutionMapper.toDomain(model);
  }

  async findPublishedByChallenge(
    challengeId: number,
  ): Promise<SolutionDetails[]> {
    const solutions = await SolutionModel.findAll({
      where: {
        challengeId,
        status: SolutionStatus.PUBLISHED,
      },
      include: [authorInclude],
      order: [['createdAt', 'DESC']],
    });

    return solutions.map((solution) => SolutionMapper.toDetails(solution));
  }

  async findPublishedById(solutionId: string): Promise<SolutionDetails | null> {
    const solution = await SolutionModel.findOne({
      where: {
        id: solutionId,
        status: SolutionStatus.PUBLISHED,
      },
      include: [authorInclude],
    });

    return solution ? SolutionMapper.toDetails(solution) : null;
  }

  async findAllForAdmin(): Promise<SolutionDetails[]> {
    const solutions = await SolutionModel.findAll({
      include: [
        {
          association: 'author',
          attributes: authorInclude.attributes,
          required: true,
        },
        moderatorInclude,
      ],
      order: [['createdAt', 'DESC']],
    });

    return solutions.map((solution) => SolutionMapper.toDetails(solution));
  }

  async findById(solutionId: string): Promise<SolutionEntity | null> {
    const solution = await SolutionModel.findByPk(solutionId);

    return solution ? SolutionMapper.toDomain(solution) : null;
  }

  async updateStatus(
    data: UpdateSolutionStatusInput,
  ): Promise<SolutionEntity | null> {
    const solution = await SolutionModel.findByPk(data.solutionId);

    if (!solution) {
      return null;
    }

    solution.status = data.status;
    solution.moderationReason = data.moderationReason;
    solution.moderatedByUserCode = data.moderatedByUserCode;
    solution.moderatedAt = data.moderatedAt;

    await solution.save();

    return SolutionMapper.toDomain(solution);
  }
}
