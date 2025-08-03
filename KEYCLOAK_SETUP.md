# Keycloak Integration Setup Guide

This guide will help you set up Keycloak authentication for your Angular TaskApp.

## Prerequisites

1. Keycloak server running (local or remote)
2. Angular application (already set up)
3. Node.js and npm installed

## Keycloak Server Setup

### 1. Install and Start Keycloak

```bash
# Download Keycloak from https://www.keycloak.org/downloads
# Or use Docker:
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

### 2. Create a Realm

1. Access Keycloak Admin Console: `http://localhost:8080`
2. Login with admin credentials
3. Click "Create Realm"
4. Name it (e.g., "taskapp-realm")
5. Click "Create"

### 3. Create a Client

1. In your realm, go to "Clients" → "Create"
2. Set Client ID: `taskapp-client`
3. Set Client Protocol: `openid-connect`
4. Click "Save"

### 4. Configure Client Settings

1. **Settings Tab:**
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:4200/*`
   - Web Origins: `http://localhost:4200`

2. **Credentials Tab:**
   - Client Authenticator: `client-secret` (if needed)

3. **Advanced Tab:**
   - Enable "Client authentication" if using confidential client

### 5. Create Users

1. Go to "Users" → "Add user"
2. Fill in username, email, first name, last name
3. Go to "Credentials" tab
4. Set password and disable "Temporary"
5. Click "Save"

### 6. Create Roles (Optional)

1. Go to "Roles" → "Add Role"
2. Create roles like: `user`, `admin`, `manager`

## Angular Application Configuration

### Project Structure

The authentication logic is organized in the `src/app/core/auth/` folder:

```
core/auth/
├── config/keycloak.config.ts      # Keycloak configuration
├── services/keycloak-auth.service.ts # Authentication service
├── guards/auth.guard.ts           # Route protection
├── models/auth.models.ts          # TypeScript interfaces
└── index.ts                       # Public exports
```

### 1. Update Keycloak Configuration

Edit `src/app/core/auth/config/keycloak.config.ts`:

```typescript
export const keycloakConfig = {
  url: 'http://localhost:8080', // Your Keycloak server URL
  realm: 'taskapp-realm', // Your realm name
  clientId: 'taskapp-client', // Your client ID
  initOptions: {
    onLoad: 'check-sso' as const,
    silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
    pkceMethod: 'S256' as const
  }
};
```

### 2. Environment-Specific Configuration

For different environments, update the configuration:

```typescript
// Development
development: {
  url: 'http://localhost:8080',
  realm: 'taskapp-dev',
  clientId: 'taskapp-client-dev'
}

// Production
production: {
  url: 'https://your-keycloak-server.com',
  realm: 'taskapp-prod',
  clientId: 'taskapp-client-prod'
}
```

## Testing the Integration

### 1. Start the Application

```bash
npm start
```

### 2. Access the Login Page

Navigate to `http://localhost:4200/login`

### 3. Test Authentication Flow

1. Click "Login with Keycloak"
2. You'll be redirected to Keycloak login page
3. Enter your credentials
4. You'll be redirected back to the app
5. Check user information and token details

## Features Included

### Login Component Features:
- ✅ Modern, responsive UI design
- ✅ Loading states and error handling
- ✅ User profile display
- ✅ Role-based information
- ✅ Token information display
- ✅ Logout functionality

### Security Features:
- ✅ AuthGuard for route protection
- ✅ Token refresh handling
- ✅ Silent SSO check
- ✅ PKCE method for enhanced security

### Service Features:
- ✅ Keycloak initialization
- ✅ User authentication
- ✅ Profile management
- ✅ Role checking
- ✅ Token management

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure Web Origins are configured in Keycloak client
   - Check that redirect URIs are correct

2. **Authentication Failures:**
   - Verify realm and client names
   - Check client configuration
   - Ensure user exists and has correct credentials

3. **Token Issues:**
   - Check token expiration settings
   - Verify client secret if using confidential client

4. **Silent Check SSO Issues:**
   - Ensure silent-check-sso.html is accessible
   - Check browser console for errors

### Debug Mode:

Enable debug logging in the Keycloak service:

```typescript
// In src/app/core/auth/config/keycloak.config.ts
initOptions: {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
  pkceMethod: 'S256' as const,
  enableLogging: true // Add this for debugging
}
```

## Next Steps

1. **Customize the UI:** Modify the login component styles
2. **Add Role-Based Access:** Implement role-based navigation
3. **Token Interceptor:** Add HTTP interceptor for API calls
4. **User Management:** Add user profile management features
5. **Multi-Tenant:** Configure for multiple realms/environments

## Security Best Practices

1. **Use HTTPS in Production**
2. **Implement Token Refresh**
3. **Add Logout on Token Expiry**
4. **Use Secure Storage for Tokens**
5. **Implement Proper Error Handling**
6. **Add Rate Limiting**
7. **Regular Security Audits**

## Support

For issues related to:
- **Keycloak:** Check [Keycloak Documentation](https://www.keycloak.org/documentation)
- **Angular:** Check [Angular Documentation](https://angular.io/docs)
- **Keycloak Angular:** Check [Keycloak Angular Documentation](https://github.com/mauriciovigolo/keycloak-angular) 