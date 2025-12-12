export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

class TokenService {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_ROLE_KEY = 'userRole';

  static setTokens(tokens: Tokens): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_ROLE_KEY);
  }

  static setUserRole(role: string): void {
    localStorage.setItem(this.USER_ROLE_KEY, role);
  }

  static getUserRole(): string | null {
    return localStorage.getItem(this.USER_ROLE_KEY);
  }
}

export default TokenService;