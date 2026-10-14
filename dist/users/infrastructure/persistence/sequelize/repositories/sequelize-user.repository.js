"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeUserRepository = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const user_mapper_1 = require("../mappers/user.mapper");
class SequelizeUserRepository {
    async create(user) {
        const model = await user_model_1.default.create(user_mapper_1.UserMapper.toPersistence(user));
        return user_mapper_1.UserMapper.toDomain(model);
    }
    async findAll() {
        const users = await user_model_1.default.findAll();
        return users.map(user_mapper_1.UserMapper.toDomain);
    }
    async findById(id) {
        const user = await user_model_1.default.findByPk(id);
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async findByUserCode(userCode) {
        const user = await user_model_1.default.findOne({ where: { userCode } });
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async findByEmail(email) {
        const user = await user_model_1.default.findOne({ where: { email } });
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async existsByRole(role) {
        const total = await user_model_1.default.count({
            where: { role },
        });
        return total > 0;
    }
    async updateStatusByUserCode(userCode, status) {
        const user = await user_model_1.default.findOne({ where: { userCode } });
        if (!user) {
            return null;
        }
        user.status = status;
        await user.save();
        return user_mapper_1.UserMapper.toDomain(user);
    }
}
exports.SequelizeUserRepository = SequelizeUserRepository;
//# sourceMappingURL=sequelize-user.repository.js.map