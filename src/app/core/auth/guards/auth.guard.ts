import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakAuthService } from '../services/keycloak-auth.service';
import { getKeycloakConfig } from '../config/keycloak.config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private keycloakAuthService: KeycloakAuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      const config = getKeycloakConfig();
      
      // If in development mode, allow access without Keycloak
      if (!config) {
        console.log('Development mode - allowing access without authentication');
        return true;
      }

      console.log('🔐 AuthGuard: Checking authentication...');
      
      // Check if we're in the middle of an authentication callback
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('session_state');
      
      if (hasAuthParams) {
        console.log('🔄 AuthGuard: Detected authentication callback, allowing initialization...');
        // Allow the page to load so Keycloak can process the callback
        return true;
      }
      
      // Initialize Keycloak with timeout
      const authenticated = await this.keycloakAuthService.initKeycloak();
      
      console.log('🔐 AuthGuard: Authentication result:', authenticated);
      
      if (authenticated) {
        console.log('✅ AuthGuard: User is authenticated - allowing access');
        return true;
      } else {
        console.log('❌ AuthGuard: User is not authenticated - redirecting to login');
        // Redirect to login page
        this.router.navigate(['/login']);
        return false; // Prevent access to protected routes
      }
    } catch (error) {
      console.error('❌ AuthGuard error:', error);
      console.log('❌ AuthGuard: Redirecting to login due to error');
      // If Keycloak is unavailable, redirect to login
      this.router.navigate(['/login']);
      return false; // Prevent access to protected routes
    }
  }
} 