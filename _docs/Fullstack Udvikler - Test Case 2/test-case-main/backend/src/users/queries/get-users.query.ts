export class GetUsersQuery {
  constructor(
    public readonly limit?: number,
    public readonly offset?: number,
    public readonly accountId?: string,
  ) {}
} 