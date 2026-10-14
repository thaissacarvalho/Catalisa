"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChallengeStatusDto = void 0;
const ChallengeStatus_enum_1 = require("../../domain/enums/ChallengeStatus.enum");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateChallengeStatusDto {
    status;
}
exports.UpdateChallengeStatusDto = UpdateChallengeStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ChallengeStatus_enum_1.ChallengeStatus,
        example: ChallengeStatus_enum_1.ChallengeStatus.INACTIVE,
    }),
    (0, class_validator_1.IsEnum)(ChallengeStatus_enum_1.ChallengeStatus),
    __metadata("design:type", String)
], UpdateChallengeStatusDto.prototype, "status", void 0);
//# sourceMappingURL=update-challenge-status.dto.js.map