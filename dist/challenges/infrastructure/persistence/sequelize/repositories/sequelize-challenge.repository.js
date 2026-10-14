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
exports.SequelizeChallengeRepository = void 0;
const common_1 = require("@nestjs/common");
const challenge_model_1 = __importDefault(require("../models/challenge.model"));
const challenge_mapper_1 = require("../mappers/challenge.mapper");
const ChallengeStatus_enum_1 = require("../../../../domain/enums/ChallengeStatus.enum");
let SequelizeChallengeRepository = class SequelizeChallengeRepository {
    async findAllActive() {
        const challenges = await challenge_model_1.default.findAll({
            where: { status: ChallengeStatus_enum_1.ChallengeStatus.ACTIVE },
            order: [['displayOrder', 'ASC']],
        });
        return challenges.map(challenge_mapper_1.ChallengeMapper.toDomain);
    }
    async findById(challengeId) {
        const challenge = await challenge_model_1.default.findByPk(challengeId);
        return challenge ? challenge_mapper_1.ChallengeMapper.toDomain(challenge) : null;
    }
    async existsActiveById(challengeId) {
        const total = await challenge_model_1.default.count({
            where: { id: challengeId, status: ChallengeStatus_enum_1.ChallengeStatus.ACTIVE },
        });
        return total > 0;
    }
    async updateStatus(challengeId, status) {
        const challenge = await challenge_model_1.default.findByPk(challengeId);
        if (!challenge) {
            return null;
        }
        challenge.status = status;
        await challenge.save();
        return challenge_mapper_1.ChallengeMapper.toDomain(challenge);
    }
};
exports.SequelizeChallengeRepository = SequelizeChallengeRepository;
exports.SequelizeChallengeRepository = SequelizeChallengeRepository = __decorate([
    (0, common_1.Injectable)()
], SequelizeChallengeRepository);
//# sourceMappingURL=sequelize-challenge.repository.js.map