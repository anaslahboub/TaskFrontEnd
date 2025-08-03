import { KeycloakProfile } from 'keycloak-js';

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  roles: string[];
}

export interface TokenInfo {
  sub: string;
  iat: Date;
  exp: Date;
  name?: string;
  email?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  initOptions: {
    onLoad: 'check-sso';
    silentCheckSsoRedirectUri: string;
    pkceMethod: 'S256';
  };
}

export interface SocialProvider {
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface SocialProviders {
  google: SocialProvider;
  github: SocialProvider;
  facebook: SocialProvider;
  twitter: SocialProvider;
}

export interface ForgotPasswordConfig {
  enabled: boolean;
  emailTemplate: string;
  resetLinkExpiry: number;
  redirectUrl: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  email?: string;
}

export type AuthGuardResult = Promise<boolean>; 