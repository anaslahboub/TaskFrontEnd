// Quick development mode toggle - set to true to bypass Keycloak for faster development
export const DEV_MODE = false; // Set to false to force real authentication

export const keycloakConfig = {
  url: 'http://localhost:8080', // Replace with your Keycloak server URL
  realm: 'ensa-realm', // Replace with your realm name
  clientId: 'task-client', // Replace with your client ID
  initOptions: {
    onLoad: 'check-sso' as const, // Changed back to check-sso to handle callback properly
    silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
    pkceMethod: 'S256' as const, // Recommended for security
    checkLoginIframe: false, // Disable iframe check for faster loading
    enableLogging: true, // Enable logging to see what's happening
    responseMode: 'fragment' as const, // Use fragment mode for better performance
    flow: 'standard' as const, // Use standard flow
    redirectUri: window.location.origin + '/dashboard', // Redirect to dashboard after login
    postLogoutRedirectUri: window.location.origin + '/login' // Redirect to login after logout
  }
};

// Social login providers configuration
export const socialProviders = {
  google: {
    name: 'Google',
    icon: 'fab fa-google',
    color: '#4285F4',
    enabled: true
  },
  github: {
    name: 'GitHub',
    icon: 'fab fa-github',
    color: '#333333',
    enabled: true
  },
  facebook: {
    name: 'Facebook',
    icon: 'fab fa-facebook',
    color: '#1877F2',
    enabled: false
  },
  twitter: {
    name: 'Twitter',
    icon: 'fab fa-twitter',
    color: '#1DA1F2',
    enabled: false
  }
};

// Forgot password configuration
export const forgotPasswordConfig = {
  enabled: true,
  emailTemplate: 'forgot-password',
  resetLinkExpiry: 3600, // 1 hour in seconds
  redirectUrl: '/login'
};

// Example configuration for different environments
export const environmentConfigs = {
  development: {
    url: 'http://localhost:8080',
    realm: 'ensa-realm',
    clientId: 'task-client'
  },
  production: {
    url: 'https://your-keycloak-server.com',
    realm: 'ensa-realm',
    clientId: 'task-client'
  }
};

// Offline mode configuration for development
export const offlineConfig = {
  enabled: DEV_MODE, // Use the development mode toggle
  mockUser: {
    id: 'mock-user-id',
    username: 'demo@example.com',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    roles: ['user']
  }
};

// Environment detection
export const isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('dev');
};

// Get configuration based on environment
export const getKeycloakConfig = () => {
  if (isDevelopment() && offlineConfig.enabled) {
    console.log('Running in offline mode for development');
    return null; // Return null to indicate offline mode
  }
  return keycloakConfig;
}; 