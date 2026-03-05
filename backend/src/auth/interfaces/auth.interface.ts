export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  organizationId: string;
  sessionId?: string;
}
