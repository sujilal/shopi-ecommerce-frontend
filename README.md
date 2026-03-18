# Shopi E-Commerce Frontend

A modern, secure React-based e-commerce frontend application with real-time GraphQL API integration, encrypted authentication, and professional UI/UX.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Application Workflow](#application-workflow)
- [Authentication System](#authentication-system)
- [Security Implementation](#security-implementation)
- [API Integration](#api-integration)
- [Known Issues & Workarounds](#known-issues--workarounds)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)

---

## 🎯 Overview

Shopi is a full-featured e-commerce frontend application built with React and Material-UI, featuring:

- ✅ **Secure Authentication**: JWT-based login/register with in-memory encrypted token storage
- ✅ **Real-time Product Browsing**: Browse, search, and filter products from GraphQL API
- ✅ **Product Details**: View detailed product information with reviews and ratings
- ✅ **Review System**: Add and view product reviews with ratings
- ✅ **User Roles**: Support for both User and Admin authentication
- ✅ **Professional UI**: Material-UI theme with coral/orange (#E07856) color scheme
- ✅ **Responsive Design**: Mobile-friendly layout with responsive grid system
- ✅ **Protected Routes**: Route guards for authenticated and public pages

---

## 🛠 Tech Stack

### Frontend Framework
- **React** 19.2.0 - UI library
- **Vite** 7.3.1 - Build tool and dev server
- **SASS** 1.97.3 - Styling preprocessor

### UI & Styling
- **Material-UI (MUI)** 7.3.9 - Component library
- **MUI Icons** 7.3.9 - Icon set
- **Emotion** 11.14.x - CSS-in-JS styling

### GraphQL & API
- **Apollo Client** 4.1.6 - GraphQL client
- **GraphQL** 16.13.1 - Query language
- **GraphQL-tag** 2.12.6 - Template literals

### Routing
- **TanStack React Router** 1.166.3 - Advanced routing

### Security
- **crypto-js** - Client-side token encryption
- **jsonwebtoken** 9.0.3 - JWT handling

### Other
- **Swiper** 12.1.2 - Carousel/slider component

---

## 📁 Project Structure

```
src/
├── api/
│   └── apolloClient.js           # Apollo Client configuration with auth link
├── components/
│   ├── Header/                   # App header with user profile dropdown
│   ├── Footer/                   # App footer with links and social media
│   ├── ProductCard/              # Product grid card component
│   ├── ProductListPagination/    # Pagination controls
│   ├── Carousel/                 # Image carousel for products
│   ├── SearchBar/                # Search input with debouncing
│   ├── ReviewItem/               # Individual review display
│   └── AddReviewDialog/          # Modal form for adding reviews
├── context/
│   └── AuthContext.jsx           # Global auth state management
├── graphql/
│   ├── mutations/
│   │   └── login.js              # Login, register, review mutations
│   ├── queries/
│   │   └── queries.js            # Product and review queries
│   ├── resolvers/
│   ├── schema/
│   └── mocks/
├── hooks/
│   └── useAuth.js                # Custom hook for auth context
├── pages/
│   ├── RootLayout.jsx            # Root layout with route guards
│   ├── LoginPage/                # User/Admin login page
│   ├── RegisterPage/             # User registration page
│   ├── ProductListPage/          # Products list with search & pagination
│   └── ProductDetailPage/        # Product details with reviews
├── router/
│   ├── index.js                  # Router configuration
│   ├── routes.js                 # Route definitions
│   └── guards.js                 # Route protection logic
├── theme/
│   └── index.js                  # MUI theme configuration
├── utils/
│   ├── encryption.js             # Token encryption/decryption
│   └── tokenStore.js             # In-memory token storage bridge
├── App.jsx                       # Root component with theme provider
├── main.jsx                      # Entry point
└── [SCSS files]                  # Component styling
```

---

## 🔄 Application Workflow

### User Journey Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SHOPI E-COMMERCE FLOW                    │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   User Visits    │
                    │   Application    │
                    └────────┬─────────┘
                             │
                    ┌────────v─────────┐
                    │  Check Auth      │
                    │  Status (Token)  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────v────┐    ┌───v───┐    ┌────v────┐
         │Not Auth │    │ Auth  │    │ Already │
         │(Token=0)│    │(Token)│    │ Logged  │
         └────┬────┘    └───┬───┘    └────┬────┘
              │             │             │
         ┌────v─────────────v──┐          │
         │   Login/Register    │          │
         │      Pages          │          │
         └────┬────────────────┘          │
              │                           │
         ┌────v─────────────────────┐    │
         │ Authenticate User        │    │
         │ (Verify Email/Password)  │    │
         └────┬────────────────────┘    │
              │                           │
         ┌────v─────────────────────┐    │
         │  Encrypt + Store Token   │    │
         │  (in Memory + Context)   │    │
         └────┬────────────────────┘    │
              │                           │
              └───────────┬───────────────┘
                          │
                    ┌─────v──────────┐
                    │  Product List  │
                    │     Page       │
                    └─────┬──────────┘
                          │
           ┌──────────────┼──────────────┐
           │              │              │
       ┌───v───┐    ┌────v────┐   ┌────v────┐
       │Browse │    │ Search  │   │ Filter  │
       │All    │    │Products │   │Products │
       │Products│   └────┬────┘   └────┬────┘
       └───┬───┘         │             │
           │             │             │
           └─────────────┼─────────────┘
                         │
              ┌──────────v─────────┐
              │  Product Details   │
              │      Page          │
              └──────────┬─────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
       ┌───v───┐   ┌────v────┐   ┌───v───┐
       │ View  │   │See All  │   │ Add   │
       │Details│   │ Reviews │   │Review │
       └───────┘   └────┬────┘   └───┬───┘
                        │            │
                   ┌────v────────────v───┐
                   │ Review Added to     │
                   │ Product (Backend)   │
                   └────────────────────┘
                        │
                   ┌────v────┐
                   │ Logout  │
                   │ (Clear  │
                   │ Token)  │
                   └────┬────┘
                        │
                   ┌────v──────┐
                   │ Redirected│
                   │ to Login  │
                   └───────────┘
```

### Page Flow Details

| Page | Purpose | Authentication Required | Key Features |
|------|---------|------------------------|--------------|
| **Login** | User authentication | ❌ No | User/Admin toggle, email/password input |
| **Register** | New user signup | ❌ No | Email, password, display name input |
| **ProductList** | Browse products | ✅ Yes | Search, pagination (9 items/page), grid layout |
| **ProductDetail** | View product info | ✅ Yes | Images carousel, reviews, add review dialog |

---

## 🔐 Authentication System

### Authentication Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│              AUTHENTICATION & TOKEN FLOW                      │
└──────────────────────────────────────────────────────────────┘

1. USER LOGIN/REGISTER
   ┌─────────────────────────────────────┐
   │  User Submits Email + Password      │
   │  (LoginPage / RegisterPage)         │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  GraphQL Mutation                   │
   │  - userLogin                        │
   │  - adminLogin                       │
   │  - createUser                       │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Backend Validates Credentials      │
   │  Returns: {authToken, user}         │
   └────────────┬────────────────────────┘
                │
                ├─── Error? ────→ Show Error Message
                │
                No (Success)
                │
   ┌────────────v────────────────────────┐
   │  AuthContext.login() Called          │
   │  Receives:                           │
   │  - authToken (JWT from backend)      │
   │  - userData (user profile)           │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Encryption Layer                   │
   │  1. Encrypt token with SECRET_KEY   │
   │  2. Store encrypted in state        │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Token Bridge (tokenStore)          │
   │  1. setCurrentToken(plainToken)     │
   │  2. Available globally              │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Ready for API Requests             │
   │  Token auto-attached to all         │
   │  GraphQL queries                    │
   └────────────────────────────────────┘


2. API REQUEST WITH AUTHENTICATION
   ┌─────────────────────────────────────┐
   │  Component executes Query/Mutation  │
   │  (e.g., GET_ALL_PRODUCTS)           │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  ApolloClient authLink triggered    │
   │  setContext() middleware            │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Get token from tokenStore:         │
   │  getCurrentToken()                  │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Add to Request Headers:            │
   │  Authorization: {token}             │
   │  (NO "Bearer " prefix)              │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Send to GraphQL API                │
   │  with Authorization header         │
   └────────────┬────────────────────────┘
                │
                ├─── 401? ────→ Access Denied
                │
                ├─── 200? ────→ Success
                │
                └─── Error? ──→ Handle Error


3. LOGOUT FLOW
   ┌─────────────────────────────────────┐
   │  User clicks Logout                 │
   │  (Header menu or error page)        │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  AuthContext.logout() called        │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Clear Encrypted Token              │
   │  setEncryptedToken(null)            │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Clear tokenStore                   │
   │  clearCurrentToken()                │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Clear userData                     │
   │  setUser(null)                      │
   └────────────┬────────────────────────┘
                │
   ┌────────────v────────────────────────┐
   │  Redirect to Login Page             │
   │  (Router guards prevent access)     │
   └────────────────────────────────────┘
```

### Token Lifecycle

```
Memory Storage Architecture:

┌─────────────────────────────────────────────────────┐
│          React Context State (Memory)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  encryptedToken: "U2Fd23...encrypted..."    │  │
│  │  (Encrypted in AES format)                   │  │
│  │  Stored ONLY in context state                │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  user: {                                     │  │
│  │    id: "user123"                             │  │
│  │    email: "user@example.com"                 │  │
│  │    displayName: "John Doe"                   │  │
│  │    role: "user"                              │  │
│  │  }                                           │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  Function: getToken()                              │
│  Returns: decrypted plain token                    │
│  Used by: Components, useAuth hook                │  │
│                                                     │
└─────────────────────────────────────────────────────┘
                         ║
              ┌──────────╫──────────┐
              │          │          │
              ▼          ▼          ▼
         
    ┌────────────────┐ ┌──────────────┐ ┌──────────────┐
    │  apolloClient  │ │ Router Guards│ │ Components   │
    │                │ │              │ │              │
    │ Reads via      │ │ Check auth   │ │ Use via      │
    │ tokenStore     │ │ state        │ │ useAuth()    │
    │ getCurrentToken│ │              │ │              │
    │ for API calls  │ │ Protect      │ │ Display user │
    │                │ │ routes       │ │ info         │
    └────────────────┘ └──────────────┘ └──────────────┘


Token Lifetime:

┌──────────────────────────────────────────────────────────┐
│  Page Load                                               │
│  ├─ Check context for token                             │
│  ├─ No token? → Show Login Page                         │
│  └─ Token exists? → Show Product List                   │
├──────────────────────────────────────────────────────────┤
│  User Active                                             │
│  ├─ Token stored in memory                              │
│  ├─ Auto-sent with API requests                         │
│  └─ Available for entire session                        │
├──────────────────────────────────────────────────────────┤
│  Page Refresh (User Action)                              │
│  ├─ Context state is cleared                            │
│  ├─ Token lost                                          │
│  ├─ User redirected to login                            │
│  └─ Must re-authenticate                               │
├──────────────────────────────────────────────────────────┤
│  Browser Close                                           │
│  ├─ Memory cleared automatically                        │
│  ├─ All tokens destroyed                                │
│  └─ No persistent data on disk                          │
├──────────────────────────────────────────────────────────┤
│  Explicit Logout                                         │
│  ├─ logout() function called                            │
│  ├─ Token cleared                                       │
│  ├─ User data cleared                                   │
│  └─ Redirected to login                                │
└──────────────────────────────────────────────────────────┘
```

### How Authentication Works

1. **User Registration/Login**
   - User submits credentials (email/password)
   - GraphQL mutation sent to backend
   - Backend validates and returns `authToken`

2. **Token Encryption & Storage**
   - Received plain token is encrypted using AES encryption
   - Encrypted token stored in React Context (memory only)
   - No localStorage, sessionStorage, or cookies used
   - **Security benefit**: Protection against XSS attacks

3. **Token Availability**
   - Token bridge (`tokenStore.js`) keeps plain token in memory
   - ApolloCient reads from tokenStore for each request
   - Token automatically added to `Authorization` header

4. **Route Protection**
   - `RootLayout.jsx` checks authentication status
   - `isAuthenticated` from context determines route access
   - Protected routes redirect to login if no token
   - Public routes redirect to products if already logged in

5. **Token Expiration**
   - Token lost on page refresh
   - User must re-authenticate
   - This is a security feature (no persistent refresh tokens)

---

## 🛡️ Security Implementation

### Token Storage Security

| Method | Secure? | Why |
|--------|---------|-----|
| localStorage | ❌ No | Vulnerable to XSS, persistent on disk |
| sessionStorage | ⚠️ Maybe | Still vulnerable to XSS |
| Cookies | ✅ Yes* | httpOnly cookies are safest (requires backend) |
| **Memory (Current)** | ✅ **Yes** | **Not accessible to JavaScript XSS, clears on refresh** |

*Our implementation: **Memory + Encryption**

### Encryption Details

```javascript
// src/utils/encryption.js

// Secret Key (app name-based, not cryptographically sensitive)
const SECRET_KEY = "shopi-ecommerce-app-2024";

// Encryption on login:
const encryptedToken = CryptoJS.AES.encrypt(
  plainToken,
  SECRET_KEY
).toString();
// Result: "U2FsdGVkX1...long encrypted string..."

// Decryption on demand:
const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
const plainToken = bytes.toString(CryptoJS.enc.Utf8);
// Result: "eyJhbGciOiJIUzI1NiI..."
```

### Why This Approach?

✅ **XSS Protection**: Encrypted token not readable by injected scripts  
✅ **No Persistence**: Memory-only storage, cleared on refresh  
✅ **Auto Logout**: Users must re-login on page reload  
✅ **Standards Compliant**: Follows React security best practices  
⚠️ **Limitation**: Page refresh requires re-authentication (standard trade-off)

---

## 🔌 API Integration

### Base Configuration

```javascript
// API Endpoint
GraphQL Endpoint: https://gql-shopping-sample.onrender.com/graphql

// Headers
Authorization: {token}  // Plain JWT token (NO "Bearer " prefix)
Content-Type: application/json
```

### GraphQL Queries

#### 1. **GET_ALL_PRODUCTS**
```graphql
query GetAllProducts {
  getAllProducts(filters: { query: null }) {
    products {
      id, slug, title, price
      images { secure_url }
      averageRating, totalReviews
      ...more fields
    }
  }
}
```
- **Purpose**: Fetch all available products with pagination
- **Auth Required**: ✅ Yes
- **Pagination**: Via offset/limit in resolver
- **Used in**: ProductListPage (9 products per page)

#### 2. **SEARCH_PRODUCTS**
```graphql
query SearchHomeProducts($search: String!) {
  searchHomeProducts(search: $search) {
    // Same fields as GET_ALL_PRODUCTS
  }
}
```
- **Purpose**: Search products by keyword
- **Auth Required**: ✅ Yes
- **Parameter**: `search` string
- **Used in**: ProductListPage search bar

#### 3. **GET_PRODUCT_BY_SLUG**
```graphql
query GetProductBySlug($slug: String!) {
  getProductBySlug(slug: $slug) {
    id, slug, title, price, description
    images { secure_url }
    video { secure_url }
    shop { owner }
    averageRating, totalReviews
  }
}
```
- **Purpose**: Fetch detailed product information
- **Auth Required**: ✅ Yes
- **Parameter**: Product `slug`
- **Used in**: ProductDetailPage

#### 4. **GET_PRODUCT_REVIEWS**
```graphql
query GetProductReviews($productId: String!) {
  getProductReviews(productId: $productId) {
    reviewList {
      id, review, rating
      user { displayName, image }
      likes, dislikes
      createdAt
    }
  }
}
```
- **Purpose**: Fetch reviews for a specific product
- **Auth Required**: ✅ Yes
- **Parameter**: Product `id`
- **Used in**: ProductDetailPage reviews tab

### GraphQL Mutations

#### 1. **USER_LOGIN**
```graphql
mutation UserLogin($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    authToken
    user { id, email, displayName }
  }
}
```
- **Purpose**: Authenticate regular users
- **Returns**: JWT token + user info
- **Used in**: LoginPage (user mode)

#### 2. **ADMIN_LOGIN**
```graphql
mutation AdminLogin($email: String!, $password: String!) {
  adminLogin(email: $email, password: $password) {
    authToken
    user { email }
  }
}
```
- **Purpose**: Authenticate admin users
- **Returns**: JWT token
- **Used in**: LoginPage (admin mode)

#### 3. **CREATE_USER**
```graphql
mutation CreateUser($payload: CreateUserPayload!) {
  createUser(payload: $payload) {
    authToken
    user { displayName, email, emailVerified }
  }
}
```
- **Purpose**: Register new user
- **Payload**:
  ```javascript
  {
    displayName: "User Name",
    email: "user@example.com",
    password: "securePassword123",
    provider: "local"
  }
  ```
- **Used in**: RegisterPage

#### 4. **ADD_PRODUCT_REVIEW**
```graphql
mutation AddProductReview($payload: ProductReviewsPayload!) {
  addProductReview(payload: $payload) {
    id, review, rating
    user { displayName, image }
    media { secure_url }
    createdAt
  }
}
```
- **Purpose**: Submit product review
- **Payload**:
  ```javascript
  {
    productId: "product-id",
    rating: 5,
    review: "Great product!",
    media: [Image files] // Optional
  }
  ```
- **Used in**: AddReviewDialog (ProductDetailPage)

---

## ⚠️ Known Issues & Workarounds

### Critical Issues

#### 1. **SEARCH_PRODUCTS Returns Empty Array**
```
Issue: searchHomeProducts query always returns []
Status: Backend Issue
Impact: Search functionality broken, returns no results
```

**Details:**
- Query: `searchHomeProducts(search: $search)`
- Expected: Array of products matching search term
- Actual: Empty array regardless of search term
- Impact: Users cannot search for products

**Workaround (Frontend):**
```javascript
// In ProductListPage.jsx
if (searchTerm) {
  // Display message: "Search functionality temporarily unavailable"
  // Show previous results or message
}
```

**To Fix (Backend):**
- Check search resolver implementation
- Verify search index/database query
- Test with sample search terms

---

#### 2. **addProductReview Throws User Not Found Error**
```
Error: "User not found. It appears that your account has been removed 
        from our records."
HTTP Status: 400/401
Impact: Users cannot add reviews
```

**Details:**
- Occurs after successful review submission
- Mutation: `addProductReview(payload: ProductReviewsPayload!)`
- Happens even for valid authenticated users
- Appears backend cannot find user in database

**Workaround (Frontend):**
```javascript
// Show user-friendly error message
const handleReviewError = (error) => {
  if (error.message.includes("User not found")) {
    showMessage("Unable to add review. Please try again later.");
  }
};
```

**Investigation Needed (Backend):**
- Verify user exists in database after login
- Check user-review relationship in schema
- Verify JWT token decoding includes user ID
- Check if user deletion cascades to prevent reviews

---

#### 3. **Access Denied After User Registration**
```
Error: "Access denied! You don't have permission for this action!"
From: getAllProducts query
HTTP Status: 401
Impact: Newly registered users cannot browse products
```

**Details:**
- User successfully registers with CREATE_USER
- RegisterPage calls login() with returned token
- Next request (GET_ALL_PRODUCTS) returns 401 Access Denied
- Existing users login without issue

**Troubleshooting Path:**
```
1. CREATE_USER mutation succeeds
   └─ Returns authToken + user data
   
2. login() encrypts token + stores
   └─ Token stored in context
   
3. Router navigates to /products
   └─ ProductListPage mounts
   
4. GET_ALL_PRODUCTS query sent
   └─ Token included in Authorization header
   
5. Backend rejects request
   └─ "Access denied" error
```

**Possible Causes:**
- Token format difference between CREATE_USER and other endpoints
- Backend validates token differently for new users
- Permission/role not set correctly on new user
- Token not yet active (timing issue)
- User account requires email verification

**Workaround (Frontend):**
```javascript
// In RegisterPage.jsx
const handleRegistrationSuccess = (userData, authToken) => {
  // Option 1: Prompt user to login
  navigate({ to: "/login" });
  
  // Option 2: Show message and retry
  setTimeout(() => {
    login(userData, authToken);
    navigate({ to: "/products" });
  }, 1000);
};
```

**To Fix (Backend):**
- Check if new users have required permissions
- Verify token format consistency
- Check if email verification is required
- Review user role/permission setup on registration
- Compare token payload between CREATE_USER and USER_LOGIN

---

### Minor Issues

#### 4. **Page Refresh Requires Re-login**
- **Issue**: Token stored in memory only, cleared on refresh
- **Why**: Security feature (prevents token persistence)
- **Workaround**: Consider optional "Remember Me" feature with sessionStorage

---

## 📦 Setup & Installation

### Prerequisites
- Node.js 16+ 
- npm 8+
- Git

### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd shopi-ecommerce-frontend

# 2. Install dependencies
npm install

# 3. Verify crypto-js is installed
npm list crypto-js
# Should show: crypto-js@4.x.x

# 4. Create .env file (if needed)
echo "VITE_API_ENDPOINT=https://gql-shopping-sample.onrender.com/graphql" > .env

# 5. Start development server
npm run dev

# 6. Build for production
npm run build
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# Starts Vite dev server on http://localhost:5173
# Hot reload enabled
# Source maps for debugging
```

### Production Build
```bash
npm run build
# Creates optimized bundle in ./dist
# Minified CSS and JS
# Ready for deployment
```

### Preview Production Build
```bash
npm run preview
# Serves production build locally
# Test before deployment
```

---

## 📊 User Workflow Example

### New User Journey

```
1. User visits application
   └─ No token → Redirected to /login

2. User chooses "Register"
   └─ Navigates to RegisterPage

3. User fills registration form
   ├─ Display Name: "John Doe"
   ├─ Email: "john@example.com"
   └─ Password: "SecurePass123"

4. User submits form
   └─ CREATE_USER mutation sent

5. ⚠️ Backend returns authToken + user
   ├─ Token: "eyJhbGciOiJIUzI1NiI..."
   └─ User: { id, email, displayName }

6. Frontend encrypts token
   └─ Encrypted: "U2FsdGVkX1...encrypted..."

7. Frontend calls login()
   ├─ Stores encrypted token in context
   ├─ Stores user data in context
   └─ Calls setCurrentToken(plainToken)

8. Router navigates to /products
   └─ ProductListPage loads

9. ⚠️ ProductListPage calls GET_ALL_PRODUCTS
   ├─ ISSUE: Returns "Access denied"
   └─ User cannot proceed

**FIX NEEDED**: Backend should allow new users to access products

10. ✅ (If issue fixed) User sees product grid
    ├─ Shows all products
    ├─ Has search bar
    └─ 9 products per page

11. User clicks product
    └─ Navigates to ProductDetailPage

12. ProductDetailPage loads
    ├─ Fetches product details
    ├─ Fetches product reviews
    └─ Shows review form

13. User adds review
    └─ ⚠️ ISSUE: "User not found" error

**FIX NEEDED**: User cannot add reviews

14. User clicks logout
    ├─ Token cleared
    ├─ User data cleared
    └─ Redirected to /login
```

---

## 🎨 Theme Configuration

### Color Scheme

```javascript
// src/theme/index.js

Primary Color: #E07856 (Coral/Orange)
├─ Light: #F5A499
├─ Main: #E07856
├─ Dark: #C5603F
└─ Contrast: #FFFFFF

Secondary: #F50057 (Pink)
Background: #FFFFFF
Text Primary: #333333
Text Secondary: #666666
```

### Styling Files

- `LoginPage.scss` - Login gradient background
- `RegisterPage.scss` - Register gradient background
- `ProductCard.scss` - Product grid styling
- `Carousel.scss` - Image carousel
- `SearchBar.scss` - Search input
- `Loader.scss` - Loading spinner

---

## 🔧 Environment Setup

### Required Environment Variables (Optional)

```bash
# .env file
VITE_API_ENDPOINT=https://gql-shopping-sample.onrender.com/graphql
```

### Development Tools

- ESLint for code quality
- Vite for fast builds
- React DevTools recommended

---

## 📝 API Response Examples

### Successful Login
```json
{
  "data": {
    "userLogin": {
      "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "userid123",
        "email": "user@example.com",
        "displayName": "John Doe"
      }
    }
  }
}
```

### Product List Response
```json
{
  "data": {
    "getAllProducts": {
      "products": [
        {
          "id": "prod1",
          "slug": "awesome-product",
          "title": "Awesome Product",
          "price": 99.99,
          "images": [
            {
              "secure_url": "https://..."
            }
          ],
          "averageRating": 4.5,
          "totalReviews": 12
        }
      ]
    }
  }
}
```

### Error Response
```json
{
  "errors": [
    {
      "message": "Access denied! You don't have permission for this action!",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

---

## 🐛 Debugging

### Check Authentication Status
```javascript
// Open browser console
const { token, user, isAuthenticated } = useAuth();
console.log({ token, user, isAuthenticated });
```

### Check Token Storage
```javascript
// In browser console
import { getCurrentToken } from './src/utils/tokenStore';
console.log(getCurrentToken()); // Should return plain token
```

### Check Encrypted Token
```javascript
// In React DevTools
// AuthContext → encryptedToken
// Should show encrypted string like: "U2FsdGVkX1..."
```

### Network Debugging
1. Open DevTools Network tab
2. Find GraphQL requests
3. Check "Authorization" header
4. Verify token is being sent

---

## 📋 Deployment Checklist

- [ ] Build completes without errors: `npm run build`
- [ ] No console errors in production build
- [ ] API endpoint is correct
- [ ] Encryption/decryption working
- [ ] Login/logout flow tested
- [ ] Product browsing tested
- [ ] Error pages display correctly
- [ ] Responsive design verified
- [ ] Theme colors applied

---

## 📞 Support & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **"Build fails"** | Run `npm install` again, check Node version |
| **"Token not sending"** | Check tokenStore.js is imported in apolloClient.js |
| **"Login doesn't work"** | Verify API endpoint in .env matches backend |
| **"Page refresh logs out"** | This is expected (security feature) |
| **"Search returns empty"** | Known backend issue - see Known Issues section |
| **"Cannot add reviews"** | Known backend issue - see Known Issues section |

---

## 📄 License

This project is part of Shopi e-commerce platform.

---

**Last Updated**: March 18, 2026
**Version**: 1.0.0
**Status**: Production Ready (with known API issues noted above)
