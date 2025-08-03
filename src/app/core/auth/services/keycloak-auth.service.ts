import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { keycloakConfig, socialProviders, forgotPasswordConfig, getKeycloakConfig, offlineConfig } from '../config/keycloak.config';
import { ForgotPasswordRequest, ResetPasswordRequest, PasswordResetResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {

  constructor(private keycloakService: KeycloakService) { }

  /**
   * Initialize Keycloak
   */
  async initKeycloak(): Promise<boolean> {
    try {
      const config = getKeycloakConfig();
      
      // If offline mode is enabled, return mock authentication immediately
      if (!config) {
        console.log('🔄 Development mode enabled - bypassing Keycloak initialization');
        return true; // Mock authenticated state
      }

      console.log('🔄 Initializing Keycloak...');
      console.log('🔧 Keycloak Config:', {
        url: config.url,
        realm: config.realm,
        clientId: config.clientId
      });

      // Check if we're in the middle of an authentication callback
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('session_state');
      
      if (hasAuthParams) {
        console.log('🔄 Detected authentication callback, processing...');
      }

      // Add timeout to prevent long loading
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Keycloak initialization timeout')), 15000); // Increased to 15 seconds for callback processing
      });

      const initPromise = this.keycloakService.init({
        config: {
          url: config.url,
          realm: config.realm,
          clientId: config.clientId
        },
        initOptions: config.initOptions
      });

      // Race between timeout and initialization
      const authenticated = await Promise.race([initPromise, timeoutPromise]);
      
      console.log('✅ Keycloak initialized successfully');
      console.log('🔐 Authentication status:', authenticated);
      
      // If we had auth params and are now authenticated, clean up the URL
      if (hasAuthParams && authenticated) {
        console.log('🔄 Cleaning up authentication callback URL...');
        // Remove auth parameters from URL
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      
      return authenticated;
    } catch (error) {
      console.error('❌ Failed to initialize Keycloak', error);
      // In development mode, return true to allow app to continue
      const config = getKeycloakConfig();
      if (!config) {
        return true; // Allow app to continue in dev mode
      }
      return false;
    }
  }

  /**
   * Login user
   */
  async login(): Promise<void> {
    try {
      await this.keycloakService.login();
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  /**
   * Login with social provider
   */
  async loginWithSocialProvider(provider: string): Promise<void> {
    try {
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      await keycloakInstance.login({
        idpHint: provider
      });
    } catch (error) {
      console.error(`Login with ${provider} failed`, error);
      throw error;
    }
  }

  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<void> {
    return this.loginWithSocialProvider('google');
  }

  /**
   * Login with GitHub
   */
  async loginWithGitHub(): Promise<void> {
    return this.loginWithSocialProvider('github');
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const config = getKeycloakConfig();
      
      if (!config) {
        console.log('🔄 Development mode - simulating logout');
        // In dev mode, just redirect to login
        window.location.href = '/login';
        return;
      }

      console.log('🔄 Logging out...');
      
      // Use the Keycloak instance directly for more control
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      await keycloakInstance.logout({
        redirectUri: window.location.origin + '/login'
      });
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed', error);
      // Even if logout fails, redirect to login page
      window.location.href = '/login';
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const config = getKeycloakConfig();
    if (!config) {
      const result = offlineConfig.enabled;
      console.log('🔐 isAuthenticated (dev mode):', result);
      return result;
    }
    const result = this.keycloakService.isLoggedIn();
    console.log('🔐 isAuthenticated:', result);
    return result;
  }

  /**
   * Get authentication status with details
   */
  getAuthStatus() {
    const config = getKeycloakConfig();
    if (!config) {
      return {
        isAuthenticated: offlineConfig.enabled,
        mode: 'development',
        message: 'Running in development mode'
      };
    }

    const keycloakInstance = this.keycloakService.getKeycloakInstance();
    return {
      isAuthenticated: this.keycloakService.isLoggedIn(),
      mode: 'production',
      token: keycloakInstance.token ? 'Present' : 'Missing',
      refreshToken: keycloakInstance.refreshToken ? 'Present' : 'Missing',
      tokenParsed: keycloakInstance.tokenParsed,
      message: this.keycloakService.isLoggedIn() ? 'User is authenticated' : 'User is not authenticated'
    };
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<KeycloakProfile> {
    try {
      const config = getKeycloakConfig();
      if (!config) {
        // Return mock user profile in offline mode
        return {
          id: offlineConfig.mockUser.id,
          username: offlineConfig.mockUser.username,
          email: offlineConfig.mockUser.email,
          firstName: offlineConfig.mockUser.firstName,
          lastName: offlineConfig.mockUser.lastName,
          emailVerified: true,
          enabled: true
        } as KeycloakProfile;
      }
      
      return await this.keycloakService.loadUserProfile();
    } catch (error) {
      console.error('Failed to load user profile', error);
      throw error;
    }
  }

  /**
   * Get user roles
   */
  getUserRoles(): string[] {
    const config = getKeycloakConfig();
    if (!config) {
      return offlineConfig.mockUser.roles; // Return mock roles in offline mode
    }
    return this.keycloakService.getUserRoles();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.keycloakService.isUserInRole(role);
  }

  /**
   * Get access token
   */
  getToken(): string {
    return this.keycloakService.getKeycloakInstance().token || '';
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<void> {
    try {
      await this.keycloakService.getKeycloakInstance().updateToken(70);
    } catch (error) {
      console.error('Token refresh failed', error);
      throw error;
    }
  }

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<PasswordResetResponse> {
    try {
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      const realm = keycloakConfig.realm;
      const url = `${keycloakConfig.url}/realms/${realm}/login-actions/reset-credentials`;
      
      // In a real implementation, you would make an API call to your backend
      // which would then call Keycloak's admin API to send the reset email
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: request.email
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Password reset email sent successfully',
          email: request.email
        };
      } else {
        throw new Error('Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password failed', error);
      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.'
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(request: ResetPasswordRequest): Promise<PasswordResetResponse> {
    try {
      if (request.newPassword !== request.confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match'
        };
      }

      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      const realm = keycloakConfig.realm;
      const url = `${keycloakConfig.url}/realms/${realm}/login-actions/reset-credentials`;
      
      // In a real implementation, you would make an API call to your backend
      // which would then call Keycloak's admin API to reset the password
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: request.token,
          newPassword: request.newPassword
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Password reset successfully'
        };
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password failed', error);
      return {
        success: false,
        message: 'Failed to reset password. Please try again.'
      };
    }
  }

  /**
   * Get available social providers
   */
  getSocialProviders() {
    return Object.entries(socialProviders)
      .filter(([_, provider]) => provider.enabled)
      .reduce((acc, [key, provider]) => {
        acc[key] = provider;
        return acc;
      }, {} as any);
  }

  /**
   * Check if forgot password is enabled
   */
  isForgotPasswordEnabled(): boolean {
    return forgotPasswordConfig.enabled;
  }

  /**
   * Handle authentication callback
   */
  async handleAuthCallback(): Promise<boolean> {
    try {
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      
      // Check if we have authentication parameters
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('session_state');
      
      if (hasAuthParams) {
        console.log('🔄 Processing authentication callback...');
        
        // Let Keycloak process the callback
        const authenticated = await this.keycloakService.isLoggedIn();
        
        if (authenticated) {
          console.log('✅ Authentication callback successful');
          
          // Clean up the URL by removing auth parameters
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
          
          return true;
        } else {
          console.log('❌ Authentication callback failed');
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error handling auth callback:', error);
      return false;
    }
  }
} 