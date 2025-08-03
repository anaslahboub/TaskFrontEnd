# Core Authentication Module

This folder contains all authentication-related logic for the application, specifically Keycloak integration.

## Folder Structure

```
core/auth/
├── config/
│   └── keycloak.config.ts      # Keycloak configuration settings
├── services/
│   └── keycloak-auth.service.ts # Main authentication service
├── guards/
│   └── auth.guard.ts           # Route protection guard
├── models/
│   └── auth.models.ts          # TypeScript interfaces and types
├── components/
│   └── login.ts                # Login component
│   └── login.html              # Login template
│   └── login.scss              # Login styles
│   └── login.spec.ts           # Login tests
├── index.ts                    # Public exports
└── README.md                   # This file
```

## Components

### Configuration (`config/`)
- **keycloak.config.ts**: Contains Keycloak server configuration, realm settings, and initialization options

### Services (`services/`)
- **keycloak-auth.service.ts**: Main service handling all Keycloak operations:
  - Initialization
  - Login/Logout
  - User profile management
  - Token management
  - Role checking

### Guards (`guards/`)
- **auth.guard.ts**: Route protection guard that checks authentication status

### Models (`models/`)
- **auth.models.ts**: TypeScript interfaces for:
  - `AuthUser`: User information structure
  - `TokenInfo`: Token payload structure
  - `AuthState`: Authentication state management
  - `KeycloakConfig`: Configuration interface

### Components (`components/`)
- **login.ts**: Login component with Keycloak integration
- **login.html**: Login page template
- **login.scss**: Login page styling
- **login.spec.ts**: Login component tests

## Usage

### Importing from core/auth
```typescript
import { 
  KeycloakAuthService, 
  AuthGuard, 
  keycloakConfig,
  AuthUser,
  TokenInfo,
  LoginComponent
} from '@app/core/auth';
```

### Using the Auth Service
```typescript
constructor(private authService: KeycloakAuthService) {}

async login() {
  await this.authService.login();
}

async logout() {
  await this.authService.logout();
}

isAuthenticated() {
  return this.authService.isAuthenticated();
}
```

### Using the Auth Guard
```typescript
// In routing
{
  path: 'protected',
  component: ProtectedComponent,
  canActivate: [AuthGuard]
}
```

### Using the Login Component
```typescript
// In routing
{
  path: 'login',
  loadComponent: () => import('./core/auth/components/login').then(m => m.LoginComponent)
}
```

## Benefits of This Structure

1. **Separation of Concerns**: Authentication logic is isolated from other application logic
2. **Reusability**: Services and guards can be easily reused across the application
3. **Maintainability**: Clear folder structure makes it easy to find and modify auth-related code
4. **Type Safety**: Strong typing with TypeScript interfaces
5. **Testability**: Isolated modules are easier to unit test
6. **Scalability**: Easy to add new authentication features or switch providers
7. **Organization**: All auth-related components are co-located

## Adding New Authentication Features

1. **New Services**: Add to `services/` folder
2. **New Guards**: Add to `guards/` folder
3. **New Models**: Add to `models/` folder
4. **New Config**: Add to `config/` folder
5. **New Components**: Add to `components/` folder
6. **Export**: Update `index.ts` to export new modules

## Testing

Each module can be tested independently:
- Services: Test authentication logic
- Guards: Test route protection
- Models: Test type definitions
- Config: Test configuration values
- Components: Test UI and user interactions 