"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengePresenter = void 0;
class ChallengePresenter {
    static public(challenge) {
        return {
            id: challenge.id,
            code: challenge.code,
            title: challenge.title,
            description: challenge.description,
            status: challenge.status,
            displayOrder: challenge.displayOrder,
        };
    }
    static statusUpdated(challenge) {
        return {
            id: challenge.id,
            code: challenge.code,
            status: challenge.status,
            updatedAt: challenge.updatedAt,
        };
    }
}
exports.ChallengePresenter = ChallengePresenter;
//# sourceMappingURL=challenge.presenter.js.map