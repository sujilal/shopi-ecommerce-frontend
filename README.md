
### Frontend Framework
- **React 19.2.0** - UI library
- **Vite 7.3.1** - Build tool and dev server
- **TanStack React Router v1.166.3** - Client-side routing

### State Management & Data
- **React Context API** - Global auth state management
- **Apollo Client v4.1.6** - GraphQL client
- **@graphql-tools/mock** - Local GraphQL schema mocking

### UI & Styling
- **Material-UI (MUI) v7.3.9** - Component library
- **Emotion** - CSS-in-JS styling
- **SASS/SCSS** - Module styling

### Additional Libraries
- **Swiper v12.1.2** - Image carousel
- **GraphQL** - Query language and schema

## 📁 Project Structure


```
┌─────────────────────────────────────────────────────────────┐
│                     Shopi Auth System                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐          ┌──────────────┐                 │
│  │   Login      │          │  Register    │                 │
│  │   Page       │          │  Page        │                 │
│  └──────┬───────┘          └──────┬───────┘                 │
│         │                         │                         │
│         └────────────┬────────────┘                         │
│                      │                                      │
│              ┌───────▼────────┐                            │
│              │  GraphQL       │                            │
│              │  Mutations     │                            │
│              │  (login/       │                            │
│              │   createUser)  │                            │
│              └───────┬────────┘                            │
│                      │                                      │
│              ┌───────▼────────┐                            │
│              │  Mock Users    │                            │
│              │  Validation    │                            │
│              └───────┬────────┘                            │
│                      │                                      │
│              ┌───────▼────────────────┐                    │
│              │  JWT Token Generated   │                    │
│              │  by utils.js           │                    │
│              └───────┬────────────────┘                    │
│                      │                                      │
│         ┌────────────┼────────────┐                        │
│         │            │            │                        │
│    ┌────▼──┐   ┌────▼──┐   ┌────▼────┐                    │
│    │Returned│   │Stored │   │Used in  │                    │
│    │to      │   │in     │   │Apollo   │                    │
│    │Client  │   │local  │   │Context  │                    │
│    │        │   │Storage│   │         │                    │
│    └────────┘   └───────┘   └────┬────┘                    │
│                                   │                        │
│                          ┌────────▼──────────┐             │
│                          │  AuthContext      │             │
│                          │  Updates User     │             │
│                          │  State            │             │
│                          └────────┬──────────┘             │
│                                   │                        │
│                          ┌────────▼──────────┐             │
│                          │  App Navigation   │             │
│                          │  & Route Guards   │             │
│                          └───────────────────┘             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

```
src/
├── api/
│   └── apolloClient.js          # Apollo Client configuration with auth context
├── components/
│   ├── Carousel/                # Image/video carousel component
│   │   ├── Carousel.jsx
│   │   └── Carousel.scss
│   ├── Loader/                  # Loading spinner component
│   │   ├── Loader.jsx
│   │   └── Loader.scss
│   ├── ProductCard/             # Reusable product card component
│   │   ├── ProductCard.jsx
│   │   └── ProductCard.scss
│   ├── ReviewItem/              # Individual review display component
│   │   └── ReviewItem.jsx
│   ├── SearchBar/               # Search input component with debouncing
│   │   ├── SearchBar.jsx
│   │   └── SearchBar.scss
│   └── AddReviewDialog/         # Dialog for adding new reviews
│       └── AddReviewDialog.jsx
├── context/
│   └── AuthContext.jsx          # Global authentication state management
├── graphql/
│   ├── schema/
│   │   ├── typeDefs.js          # GraphQL type definitions
│   │   └── index.js
│   ├── mocks/
│   │   ├── products.js          # Mock product data (6 sample products)
│   │   ├── users.js             # Mock user credentials
│   │   ├── reviews.js           # Mock review data
│   │   ├── utils.js             # JWT token generation/verification
│   │   └── index.js
│   ├── resolvers/
│   │   ├── queries.js           # GraphQL query resolvers
│   │   ├── mutations.js         # GraphQL mutation resolvers
│   │   └── index.js
│   └── mutations/
│       └── login.js             # Login/Register/Review mutations
├── hooks/
│   └── useAuth.js               # Custom hook for authentication
├── pages/
│   ├── RootLayout.jsx           # Root layout with route guards
│   ├── LoginPage/
│   │   ├── LoginPage.jsx
│   │   └── LoginPage.scss
│   ├── RegisterPage/
│   │   ├── RegisterPage.jsx
│   │   └── RegisterPage.scss
│   ├── ProductListPage/
│   │   ├── ProductListPage.jsx
│   │   └── ProductListPage.scss
│   └── ProductDetailPage/
│       ├── ProductDetailPage.jsx
│       └── ProductDetailPage.scss
├── router/
│   ├── index.js                 # Router initialization
│   ├── routes.js                # Route definitions
│   └── guards.js                # Route guard utilities
├── App.jsx                      # Main app component
├── main.jsx                     # App entry point
└── index.html                   # HTML template

.env                             # Environment variables
vite.config.js                   # Vite configuration
package.json                     # Project dependencies
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

 **Navigate to project directory**
```bash
cd shopi-ecommerce-frontend
```

 **Install dependencies**
```bash
npm install
```


4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000/login`

## 📖 Running the Application

### Development Server
```bash
npm run dev
```
Starts Vite dev server with hot module replacement (HMR).

### Lint Code
```bash
npm run lint
```
Runs ESLint to check code quality and potential issues.

## 🔐 Authentication

### How It Works

1. **Login/Registration**
   - Users enter credentials on Login or Register page
   - GraphQL mutation validates credentials against MOCK_USERS
   - JWT token is generated using Base64 encoding
   - Token is stored in `localStorage` with key `"token"`
   - User context is updated with user information

2. **Token Structure** (Base64 JWT)
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId, email, name, iat, exp }
Signature: Fake signature (for mock purposes)
```

3. **Token Persistence**
   - Token stored in `localStorage` - survives page refreshes
   - AuthContext provides `login()`, `logout()`, `register()` methods
   - `useAuth()` hook provides convenient access to auth state
   - Decoded user info passed to GraphQL context for resolvers

### Test Credentials

```
Account 1:
Email: test@gamil.com
Password: password123

```

### Route Guards

**Public Routes** (anyone can access):
- `/login` - Login page
- `/register` - Register page

**Protected Routes** (authentication required):
- `/products` - Product listing page
- `/product/:slug` - Product detail page

**Auto-Redirect Logic**:
```
If user is logged in AND tries to access /login or /register
  → Redirects to /products

If user is NOT logged in AND tries to access /products or /product/:slug
  → Redirects to /login
```

This routing logic is implemented in `src/pages/RootLayout.jsx`.

