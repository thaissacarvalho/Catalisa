"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeSolutionRepository = void 0;
const common_1 = require("@nestjs/common");
const solution_status_enum_1 = require("../../../../domain/enums/solution-status.enum");
const solution_mapper_1 = require("../mappers/solution.mapper");
const solution_model_1 = __importDefault(require("../models/solution.model"));
const user_status_enum_1 = require("../../../../../users/domain/enums/user-status.enum");
const authorInclude = {
    association: 'author',
    attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
    required: true,
    where: {
        status: user_status_enum_1.UserStatus.ACTIVE,
    },
};
const moderatorInclude = {
    association: 'moderator',
    attributes: ['userCode', 'name', 'role'],
    required: false,
};
let SequelizeSolutionRepository = class SequelizeSolutionRepository {
    async create(solution) {
        const model = await solution_model_1.default.create(solution_mapper_1.SolutionMapper.toPersistence(solution));
        return solution_mapper_1.SolutionMapper.toDomain(model);
    }
    async findPublishedByChallenge(challengeId) {
        const solutions = await solution_model_1.default.findAll({
            where: {
                challengeId,
                status: solution_status_enum_1.SolutionStatus.PUBLISHED,
            },
            include: [authorInclude],
            order: [['createdAt', 'DESC']],
        });
        return solutions.map((solution) => solution_mapper_1.SolutionMapper.toDetails(solution));
    }
    async findPublishedById(solutionId) {
        const solution = await solution_model_1.default.findOne({
            where: {
                id: solutionId,
                status: solution_status_enum_1.SolutionStatus.PUBLISHED,
            },
            include: [authorInclude],
        });
        return solution ? solution_mapper_1.SolutionMapper.toDetails(solution) : null;
    }
    async findAllForAdmin() {
        const solutions = await solution_model_1.default.findAll({
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
        return solutions.map((solution) => solution_mapper_1.SolutionMapper.toDetails(solution));
    }
    async findById(solutionId) {
        const solution = await solution_model_1.default.findByPk(solutionId);
        return solution ? solution_mapper_1.SolutionMapper.toDomain(solution) : null;
    }
    async updateStatus(data) {
        const solution = await solution_model_1.default.findByPk(data.solutionId);
        if (!solution) {
            return null;
        }
        solution.status = data.status;
        solution.moderationReason = data.moderationReason;
        solution.moderatedByUserCode = data.moderatedByUserCode;
        solution.moderatedAt = data.moderatedAt;
        await solution.save();
        return solution_mapper_1.SolutionMapper.toDomain(solution);
    }
};
exports.SequelizeSolutionRepository = SequelizeSolutionRepository;
exports.SequelizeSolutionRepository = SequelizeSolutionRepository = __decorate([
    (0, common_1.Injectable)()
], SequelizeSolutionRepository);
//# sourceMappingURL=sequelize-solution.repository.js.map