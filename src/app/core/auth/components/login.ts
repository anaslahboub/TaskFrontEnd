import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakAuthService, TokenInfo } from '../index';
import { KeycloakProfile } from 'keycloak-js';
import { getKeycloakConfig } from '../config/keycloak.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  isAuthenticated = false;
  userProfile: KeycloakProfile | null = null;
  userRoles: string[] = [];
  isLoading = false;
  errorMessage = '';
  isDevMode = false;

  constructor(
    private keycloakAuthService: KeycloakAuthService,
    private router: Router
  ) {
    this.isDevMode = !getKeycloakConfig();
  }

  async ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      // Check if we're in development mode
      if (this.isDevMode) {
        console.log('🔄 Development mode - showing custom login UI');
        this.isLoading = false;
        return; // Show login form immediately in dev mode
      }

      console.log('🔄 LoginComponent: Initializing authentication...');
      
      // Check if we're in the middle of an authentication callback
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('session_state');
      
      if (hasAuthParams) {
        console.log('🔄 LoginComponent: Detected authentication callback, processing...');
        // Handle the authentication callback
        const callbackSuccess = await this.keycloakAuthService.handleAuthCallback();
        if (callbackSuccess) {
          console.log('✅ LoginComponent: Authentication callback successful, redirecting to dashboard');
          this.router.navigate(['/dashboard']);
          return;
        }
      }
      
      // Initialize Keycloak with timeout
      const authenticated = await this.keycloakAuthService.initKeycloak();
      this.isAuthenticated = authenticated;
      
      console.log('🔐 LoginComponent: Authentication result:', authenticated);
      
      if (authenticated) {
        console.log('✅ LoginComponent: User is authenticated, loading user info...');
        await this.loadUserInfo();
        // Redirect to dashboard if already authenticated
        this.router.navigate(['/dashboard']);
      } else {
        // If not authenticated, show login form immediately
        console.log('❌ LoginComponent: User not authenticated, showing login form');
      }
    } catch (error) {
      console.error('❌ LoginComponent: Failed to initialize authentication', error);
      this.errorMessage = 'Authentication service unavailable. Please try again.';
      // Don't block the UI, allow user to see login form
    } finally {
      this.isLoading = false;
    }
  }

  // Add method to check authentication status
  checkAuthStatus() {
    const status = this.keycloakAuthService.getAuthStatus();
    console.log('🔍 Authentication Status Check:', status);
    return status;
  }

  // Add method to verify login
  verifyLogin() {
    const isAuth = this.keycloakAuthService.isAuthenticated();
    console.log('🔍 Login Verification:', isAuth);
    
    if (isAuth) {
      console.log('✅ Login is working - user is authenticated');
      alert('✅ Login is working! User is authenticated.');
    } else {
      console.log('❌ Login is not working - user is not authenticated');
      alert('❌ Login is not working. User is not authenticated.');
    }
    
    return isAuth;
  }

  // Add method to test authentication
  testAuthentication() {
    console.log('🧪 Testing authentication...');
    
    // Check if Keycloak server is reachable
    const config = getKeycloakConfig();
    if (!config) {
      alert('❌ Keycloak configuration not found. Check your config.');
      return;
    }
    
    console.log('🔧 Keycloak Config:', config);
    
    // Test if we can reach the Keycloak server
    fetch(`${config.url}/realms/${config.realm}`)
      .then(response => {
        if (response.ok) {
          console.log('✅ Keycloak server is reachable');
          alert('✅ Keycloak server is reachable!\n\nNow try clicking "Login with Keycloak" to test authentication.');
        } else {
          console.log('❌ Keycloak server returned error:', response.status);
          alert(`❌ Keycloak server error: ${response.status}\n\nPlease check if Keycloak is running at ${config.url}`);
        }
      })
      .catch(error => {
        console.error('❌ Cannot reach Keycloak server:', error);
        alert(`❌ Cannot reach Keycloak server at ${config.url}\n\nPlease start your Keycloak server first.`);
      });
  }

  async login() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      if (this.isDevMode) {
        // Mock login for development
        console.log('Development mode - simulating login');
        this.isAuthenticated = true;
        await this.loadUserInfo();
        this.router.navigate(['/dashboard']);
        return;
      }

      await this.keycloakAuthService.login();
    } catch (error) {
      console.error('Login failed', error);
      this.errorMessage = 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      if (this.isDevMode) {
        // Mock Google login for development
        console.log('Development mode - simulating Google login');
        this.isAuthenticated = true;
        await this.loadUserInfo();
        this.router.navigate(['/dashboard']);
        return;
      }

      await this.keycloakAuthService.loginWithGoogle();
    } catch (error) {
      console.error('Google login failed', error);
      this.errorMessage = 'Google login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGitHub() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      if (this.isDevMode) {
        // Mock GitHub login for development
        console.log('Development mode - simulating GitHub login');
        this.isAuthenticated = true;
        await this.loadUserInfo();
        this.router.navigate(['/dashboard']);
        return;
      }

      await this.keycloakAuthService.loginWithGitHub();
    } catch (error) {
      console.error('GitHub login failed', error);
      this.errorMessage = 'GitHub login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await this.keycloakAuthService.logout();
    } catch (error) {
      console.error('Logout failed', error);
      this.errorMessage = 'Logout failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private async loadUserInfo() {
    try {
      this.userProfile = await this.keycloakAuthService.getUserProfile();
      this.userRoles = this.keycloakAuthService.getUserRoles();
    } catch (error) {
      console.error('Failed to load user information', error);
    }
  }

  getTokenInfo(): TokenInfo | null {
    const token = this.keycloakAuthService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          exp: new Date(payload.exp * 1000),
          iat: new Date(payload.iat * 1000),
          sub: payload.sub,
          email: payload.email,
          name: payload.name
        };
      } catch (error) {
        console.error('Failed to parse token', error);
        return null;
      }
    }
    return null;
  }
}
