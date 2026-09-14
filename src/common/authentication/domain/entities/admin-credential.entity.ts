export class AdminCredentialEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public passwordHash: string,
    public mustChangePassword: boolean,
    public passwordChangedAt: Date | null,
  ) {}
}
