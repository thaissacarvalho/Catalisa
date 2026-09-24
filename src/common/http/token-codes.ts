export const TokenCodes = {
  // =========================
  // ERROR CODES
  // =========================

  // USERS
  // =========================

  USER_NOT_FOUND: {
    type: 'ERROR',
    code: 'MCODE-001',
    statusCode: 404,
    message: 'User not found',
  },

  USER_ALREADY_EXISTS: {
    type: 'ERROR',
    code: 'MCODE-002',
    statusCode: 409,
    message: 'User already exists',
  },

  INVALID_USER: {
    type: 'ERROR',
    code: 'MCODE-003',
    statusCode: 400,
    message: 'Invalid user',
  },

  // =========================
  // GENERAL / AUTH
  // =========================

  FORBIDDEN: {
    type: 'ERROR',
    code: 'MCODE-004',
    statusCode: 403,
    message: 'Forbidden',
  },

  INTERNAL_SERVER_ERROR: {
    type: 'ERROR',
    code: 'MCODE-005',
    statusCode: 500,
    message: 'Internal server error',
  },

  ACCESS_DENIED: {
    type: 'ERROR',
    code: 'MCODE-006',
    statusCode: 403,
    message: 'Access denied',
  },

  AUTHENTICATION_REQUIRED: {
    type: 'ERROR',
    code: 'MCODE-007',
    statusCode: 401,
    message: 'Authentication required',
  },

  // =========================
  // SOLUTIONS
  // =========================

  SOLUTION_NOT_FOUND: {
    type: 'ERROR',
    code: 'MCODE-008',
    statusCode: 404,
    message: 'Solution not found',
  },

  SOLUTION_ALREADY_EXISTS: {
    type: 'ERROR',
    code: 'MCODE-009',
    statusCode: 409,
    message: 'Solution already exists',
  },

  INVALID_SOLUTION: {
    type: 'ERROR',
    code: 'MCODE-010',
    statusCode: 400,
    message: 'Invalid solution',
  },

  // =========================
  // CHALLENGES
  // =========================

  CHALLENGE_FOUND: {
    type: 'SUCCESS',
    code: 'MCODE-S014',
    statusCode: 200,
    message: 'Challenge found',
  },

  CHALLENGES_LISTED: {
    type: 'SUCCESS',
    code: 'MCODE-S015',
    statusCode: 200,
    message: 'Challenges listed',
  },

  CHALLENGE_STATUS_UPDATED: {
    type: 'SUCCESS',
    code: 'MCODE-S016',
    statusCode: 200,
    message: 'Challenge status updated',
  },

  CHALLENGE_NOT_FOUND: {
    type: 'ERROR',
    code: 'MCODE-011',
    statusCode: 404,
    message: 'Challenge not found',
  },

  CHALLENGE_ALREADY_EXISTS: {
    type: 'ERROR',
    code: 'MCODE-012',
    statusCode: 409,
    message: 'Challenge already exists',
  },

  INVALID_CHALLENGE: {
    type: 'ERROR',
    code: 'MCODE-013',
    statusCode: 400,
    message: 'Invalid challenge',
  },

  // =========================
  // COMMENTS
  // =========================

  COMMENT_CREATED: {
    type: 'SUCCESS',
    code: 'MCODE-S017',
    statusCode: 201,
    message: 'Comment created',
  },

  COMMENT_FOUND: {
    type: 'SUCCESS',
    code: 'MCODE-S018',
    statusCode: 200,
    message: 'Comment found',
  },

  COMMENT_STATUS_UPDATED: {
    type: 'SUCCESS',
    code: 'MCODE-S019',
    statusCode: 200,
    message: 'Comment status updated',
  },

  COMMENT_NOT_FOUND: {
    type: 'ERROR',
    code: 'MCODE-014',
    statusCode: 404,
    message: 'Comment not found',
  },

  INVALID_COMMENT: {
    type: 'ERROR',
    code: 'MCODE-015',
    statusCode: 400,
    message: 'Invalid comment',
  },

  COMMENT_ALREADY_EXISTS: {
    type: 'ERROR',
    code: 'MCODE-016',
    statusCode: 409,
    message: 'Comment already exists',
  },

  // =========================
  // LIKES
  // =========================

  LIKE_CREATED: {
    type: 'SUCCESS',
    code: 'MCODE-S021',
    statusCode: 201,
    message: 'Like created',
  },

  LIKES_COUNTED: {
    type: 'SUCCESS',
    code: 'MCODE-S020',
    statusCode: 200,
    message: 'Visible likes counted',
  },

  LIKE_NOT_FOUND: {
    type: 'ERROR',
    code: 'MCODE-017',
    statusCode: 404,
    message: 'Like not found',
  },

  LIKE_ALREADY_EXISTS: {
    type: 'ERROR',
    code: 'MCODE-018',
    statusCode: 409,
    message: 'Like already exists',
  },

  // =========================
  // GENERAL / AUTH
  // =========================

  INVALID_REQUEST: {
    type: 'ERROR',
    code: 'MCODE-019',
    statusCode: 400,
    message: 'Invalid request',
  },

  RESOURCE_NOT_FOUND: {
    type: 'ERROR',
    code: 'MCODE-020',
    statusCode: 404,
    message: 'Resource not found',
  },

  CONFLICT: {
    type: 'ERROR',
    code: 'MCODE-021',
    statusCode: 409,
    message: 'Conflict',
  },

  INVALID_ADMIN_CREDENTIALS: {
    type: 'ERROR',
    code: 'MCODE-022',
    statusCode: 401,
    message: 'Invalid admin credentials',
  },

  INVALID_ACCESS_TOKEN: {
    type: 'ERROR',
    code: 'MCODE-023',
    statusCode: 401,
    message: 'Invalid or expired access token',
  },

  ADMIN_ACCOUNT_INACTIVE: {
    type: 'ERROR',
    code: 'MCODE-024',
    statusCode: 403,
    message: 'Admin account is not active',
  },

  PASSWORD_UPDATE_REQUIRED: {
    type: 'ERROR',
    code: 'MCODE-025',
    statusCode: 403,
    message: 'Password update required',
  },

  USER_ALREADY_ADMIN: {
    type: 'ERROR',
    code: 'MCODE-026',
    statusCode: 409,
    message: 'User is already an admin',
  },

  PASSWORD_UNCHANGED: {
    type: 'ERROR',
    code: 'MCODE-027',
    statusCode: 409,
    message: 'New password must be different',
  },

  INVALID_PASSWORD: {
    type: 'ERROR',
    code: 'MCODE-028',
    statusCode: 400,
    message: 'Invalid password',
  },

  // =========================
  // CONTENT AND REQUEST ERRORS
  // =========================

  INVALID_USER_IDENTIFIER: {
    type: 'ERROR',
    code: 'MCODE-029',
    statusCode: 400,
    message: 'Invalid id or userCode request',
  },

  INVALID_PERSISTENCE_DATA: {
    type: 'ERROR',
    code: 'MCODE-030',
    statusCode: 400,
    message: 'Required data to store was not provided',
  },

  SOLUTION_QUERY_FAILED: {
    type: 'ERROR',
    code: 'MCODE-031',
    statusCode: 500,
    message: 'Failed to query solutions',
  },

  SOLUTION_CREATION_FAILED: {
    type: 'ERROR',
    code: 'MCODE-032',
    statusCode: 500,
    message: 'Failed to create solution',
  },

  COMMENT_QUERY_FAILED: {
    type: 'ERROR',
    code: 'MCODE-033',
    statusCode: 500,
    message: 'Failed to query comments',
  },

  // =========================
  // SUPER ADMIN
  // =========================

  INITIAL_SUPER_ADMIN_CONFIGURATION_INVALID: {
    type: 'ERROR',
    code: 'MCODE-034',
    statusCode: 500,
    message: 'Initial super admin configuration is invalid',
  },

  SUPER_ADMIN_ALREADY_EXISTS: {
    type: 'ERROR',
    code: 'MCODE-035',
    statusCode: 409,
    message: 'Super admin already exists',
  },

  EMAIL_ALREADY_EXISTS: {
    type: 'ERROR',
    code: 'MCODE-036',
    statusCode: 409,
    message: 'Email already exists',
  },

  EMAIL_NOT_FOUND: {
    type: 'ERROR',
    code: 'MCODE-042',
    statusCode: 404,
    message: 'Email not found',
  },

  INVALID_PASSWORD_LENGTH: {
    type: 'ERROR',
    code: 'MCODE-037',
    statusCode: 400,
    message: 'Password length is invalid',
  },

  USER_CANNOT_BE_PROMOTED: {
    type: 'ERROR',
    code: 'MCODE-038',
    statusCode: 409,
    message: 'User cannot be promoted',
  },

  SOLUTION_MODERATION_REASON_REQUIRED: {
    type: 'ERROR',
    code: 'MCODE-039',
    statusCode: 400,
    message: 'A moderation reason is required to remove a solution',
  },

  SOLUTION_STATUS_UNCHANGED: {
    type: 'ERROR',
    code: 'MCODE-040',
    statusCode: 409,
    message: 'Solution already has the requested status',
  },

  CHALLENGE_STATUS_UNCHANGED: {
    type: 'ERROR',
    code: 'MCODE-041',
    statusCode: 409,
    message: 'Challenge already has the requested status',
  },
  // =========================
  // SUCCESS CODES
  // =========================

  USER_CREATED: {
    type: 'SUCCESS',
    code: 'MCODE-S001',
    statusCode: 201,
    message: 'User created',
  },

  USER_FOUND: {
    type: 'SUCCESS',
    code: 'MCODE-S002',
    statusCode: 200,
    message: 'User found',
  },

  USERS_LISTED: {
    type: 'SUCCESS',
    code: 'MCODE-S003',
    statusCode: 200,
    message: 'Users listed',
  },

  USER_STATUS_UPDATED: {
    type: 'SUCCESS',
    code: 'MCODE-S004',
    statusCode: 200,
    message: 'User status updated',
  },

  ADMIN_AUTHENTICATED: {
    type: 'SUCCESS',
    code: 'MCODE-S005',
    statusCode: 200,
    message: 'Admin authenticated',
  },

  AUTHENTICATED_IDENTITY_RETRIEVED: {
    type: 'SUCCESS',
    code: 'MCODE-S006',
    statusCode: 200,
    message: 'Authenticated identity retrieved',
  },

  ADMIN_PASSWORD_UPDATED: {
    type: 'SUCCESS',
    code: 'MCODE-S007',
    statusCode: 200,
    message: 'Admin password updated',
  },

  USER_PROMOTED_TO_ADMIN: {
    type: 'SUCCESS',
    code: 'MCODE-S008',
    statusCode: 201,
    message: 'User promoted to admin',
  },

  SUPER_ADMIN_CREATED: {
    type: 'SUCCESS',
    code: 'MCODE-S009',
    statusCode: 201,
    message: 'Super admin created',
  },

  SOLUTION_CREATED: {
    type: 'SUCCESS',
    code: 'MCODE-S010',
    statusCode: 201,
    message: 'Solution created',
  },

  SOLUTION_FOUND: {
    type: 'SUCCESS',
    code: 'MCODE-S011',
    statusCode: 200,
    message: 'Solution found',
  },

  SOLUTIONS_LISTED: {
    type: 'SUCCESS',
    code: 'MCODE-S012',
    statusCode: 200,
    message: 'Solutions listed',
  },

  SOLUTION_STATUS_UPDATED: {
    type: 'SUCCESS',
    code: 'MCODE-S013',
    statusCode: 200,
    message: 'Solution status updated',
  },
} as const;

export type TokenCode = (typeof TokenCodes)[keyof typeof TokenCodes];
export type TokenErrorCode = Extract<TokenCode, { type: 'ERROR' }>;
export type TokenSuccessCode = Extract<TokenCode, { type: 'SUCCESS' }>;
