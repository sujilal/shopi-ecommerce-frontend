# ARCHITECTURE & WORKFLOW DOCUMENTATION

## Application Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                    SHOPI FRONTEND ARCHITECTURE                     │
└────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │  Browser / User │
                         └────────┬────────┘
                                  │
                    ┌─────────────v──────────────┐
                    │    React Application       │
                    │  (Vite + React 19)         │
                    └─────────────┬──────────────┘
                                  │
            ┌─────────────────────┼──────────────────────┐
            │                     │                      │
        ┌───v────┐        ┌──────v──────┐       ┌───────v─────┐
        │  Pages │        │ Components  │       │   Context   │
        ├────────┤        ├─────────────┤       ├─────────────┤
        │ Login  │        │ Header      │       │ AuthContext │
        │Register│        │ Footer      │       │   (State)   │
        │Products│        │ ProductCard │       └─────────────┘
        │Details │        │ Carousel    │
        └────┬───┘        │ SearchBar   │
             │            │ ReviewItem  │
             │            └─────────────┘
             │                  │
             └──────────┬───────┘
                        │
              ┌─────────v─────────────┐
              │   GraphQL (Apollo)    │
              ├───────────────────────┤
              │ - Queries             │
              │ - Mutations           │
              │ - authLink            │
              │ - tokenStore bridge   │
              └──────────┬────────────┘
                         │
              ┌──────────v──────────┐
              │  Security Layer     │
              ├────────────────────┤
              │ - Encryption       │
              │ - Token Storage    │
              │ - Route Guards     │
              └──────────┬─────────┘
                         │
              ┌──────────v──────────────────────────┐
              │  External API (GraphQL)              │
              ├──────────────────────────────────────┤
              │ URL: gql-shopping-sample.onrender.  │
              │      com/graphql                     │
              │                                      │
              │ Requires Authorization header with   │
              │ JWT token                            │
              └──────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                     DATA FLOW IN SHOPI                            │
└───────────────────────────────────────────────────────────────────┘

1. LOGIN FLOW
═════════════════════════════════════════════════════════════════════

   User Input                  Component              AuthContext
   │                          │                      │
   ├─ Email ──────────────────→ LoginPage.jsx ──────→ useMutation
   └─ Password ────────────────→ handleSubmit() ────→ userLogin()
                                │                     │
                                └─────────────────────→ Apollo Client
                                                       │
                                                    GraphQL API
                                                     (Backend)
                                                       │
                                Result: authToken     │
                                + user data ←─────────┘
                                │
                    ┌───────────→ login(userData, authToken)
                    │            │
         ┌──────────┴────────────→ Encrypt token
         │                        │
         │        ┌───────────────→ Store encrypted in state
         │        │                │
         │        │        ┌───────→ setCurrentToken(plain)
         │        │        │        │
         ▼        ▼        ▼        ▼
    Context   Encrypted  tokenStore    
    ╔─────────╗ token    (memory)   
    ║ Ready   ║                     
    ║ to      ║ User data           
    ║ browse  ║                     
    ╚─────────╝ Token available     
       │       for API requests     
       │
       └─→ navigate("/products")


2. API REQUEST FLOW
═════════════════════════════════════════════════════════════════════

   Component              Apollo Client        Token Store      Backend
   │                     │                    │               │
   ├─ Query ─────────────→ GET_ALL_PRODUCTS   │               │
   │ (ProductListPage)    │                    │               │
   │                      ├─ authLink ────────→ getCurrentToken()
   │                      │  (middleware)      │               │
   │                      │                    ├─ Return token │
   │                      │ Add header:        │               │
   │                      │ Authorization: {..}               │
   │                      │                                   │
   │                      └───────────────────────────────────→ Parse JWT
   │                                                           │
   │                                                           ├─ Verify signature
   │                                                           │
   │                                                           ├─ Check expiry
   │                                                           │
   │                                    Result of query ←─────┤
   │                                    (products array)      │
   │                                    OR error (401, etc)   │
   │
   │← Apollo cache ←────────────────────────────────────────────┘
   │
   ├─ Update state
   │
   └─ Re-render component
     (Display products or error)


3. REVIEW SUBMISSION FLOW
═════════════════════════════════════════════════════════════════════

   User Input                Component           AuthContext     Backend
   │                        │                   │               │
   ├─ Rating ───────────────→ AddReviewDialog   │               │
   ├─ Review text ─────────→ handleSubmit() ───→ useMutation    │
   ├─ Media (optional) ────→ addProductReview() │               │
   │                        │                   ├─ GET token ──→ GraphQL API
   │                        │                   │               │
   │                        │                   │        Validate
   │                        │                   │        + Store review
   │                        │                   │               │
   │                        │← Response ←──────────────────────┤
   │                        │                                   │
   │ ✅ Success OR          │                                   │
   │ ⚠️ Error (User not found) ←────────────────────────────────┘
   │
   ├─ If Success: Close dialog, refresh reviews
   └─ If Error: Show error message
```

---

## Component Hierarchy

```
┌──────────────────────────────────────────────────────┐
│                    App.jsx                          │
│        (ThemeProvider + CssBaseline)                │
└────────────────────┬─────────────────────────────────┘
                     │
         ┌───────────v────────────┐
         │  AuthProvider          │
         │  (AuthContext)         │
         └───────────┬────────────┘
                     │
         ┌───────────v────────────┐
         │  RouterProvider        │
         │  (TanStack Router)     │
         └───────────┬────────────┘
                     │
         ┌───────────v────────────┐
         │  RootLayout            │
         │  (Route Protection)    │
         └───────────┬────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
    ┌────v────┐          ┌───────v──────┐
    │ Public  │          │  Protected   │
    │ Routes  │          │   Routes     │
    ├─────────┤          ├──────────────┤
    │ /login  │          │ /products    │◄───┐
    │ /register          │ /product/:id │    │
    └─────────┘          └──────────────┘    │
                              │              │
                ┌─────────────┴────────────┐ │
                │                          │ │
         ┌──────v────────┐      ┌─────────v─┴─────┐
         │ LoginPage     │      │ ProductListPage │
         │ + Header      │      │ + Header        │
         │ + Footer      │      │ + SearchBar     │
         └──────┬────────┘      │ + ProductCards  │
                │               │ + Pagination    │
                │               │ + Footer        │
                │               └────────┬────────┘
                │                        │
                │               ┌────────v────────┐
                │               │ProductDetailPage│
                │               │ + Header        │
                │               │ + Carousel      │
                │               │ + Reviews       │
                │               │ + AddReviewDialog
                │               │ + Footer        │
                │               └─────────────────┘
                │
         ┌──────v────────┐
         │ RegisterPage  │
         │ + Header      │
         │ + Footer      │
         └───────────────┘

Component Props Flow:
─────────────────────────────────────────────────────

ProductListPage
    │
    ├─→ Header (user: Context)
    ├─→ SearchBar (onSearch callback)
    ├─→ ProductCard[] (products, onProductClick)
    │   └─→ Images, Title, Price, Rating
    ├─→ Pagination (currentPage, totalPages)
    └─→ Footer

ProductDetailPage
    │
    ├─→ Header (user: Context)
    ├─→ Carousel (images)
    ├─→ Product Details (title, price, etc)
    ├─→ ReviewItem[] (reviews)
    ├─→ AddReviewDialog (onReviewSubmit)
    └─→ Footer
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│          REACT CONTEXT STATE TREE                       │
└─────────────────────────────────────────────────────────┘

AuthContext (Global)
│
├─ user
│  ├─ id: string
│  ├─ email: string
│  ├─ displayName: string
│  └─ role: 'user' | 'admin'
│
├─ encryptedToken: string (encrypted JWT)
│  └─ Decrypted on demand via getToken()
│
├─ isAuthenticated: boolean
│  └─ Derived from !!encryptedToken
│
├─ loading: boolean
│  └─ Not currently used
│
├─ error: string | null
│  └─ Authentication errors
│
└─ Functions:
   ├─ login(userData, token)
   │  └─ Called after successful auth
   │
   ├─ register(userData, token)
   │  └─ Called after successful signup
   │
   ├─ logout()
   │  └─ Called on user logout
   │
   ├─ getToken()
   │  └─ Returns decrypted plain token
   │
   └─ setError(error)
      └─ Sets error message


Local Component States
──────────────────────

LoginPage.jsx
├─ formData: { email, password }
├─ error: string
├─ loginType: 'user' | 'admin'
└─ userRole: string

RegisterPage.jsx
├─ formData: { displayName, email, password }
├─ confirmPassword: string
└─ error: string

ProductListPage.jsx
├─ products: Product[]
├─ searchTerm: string
├─ currentPage: number
├─ itemsPerPage: number (9)
├─ loading: boolean
└─ error: string

ProductDetailPage.jsx
├─ product: Product
├─ reviews: Review[]
├─ loading: boolean
└─ error: string

AddReviewDialog.jsx
├─ open: boolean
├─ formData: { rating, review, media[] }
├─ loading: boolean
└─ error: string
```

---

## Request/Response Cycle

```
┌──────────────────────────────────────────────────────┐
│     COMPLETE REQUEST/RESPONSE CYCLE                 │
└──────────────────────────────────────────────────────┘

STEP 1: User Action Triggers Request
─────────────────────────────────────────────────────

Component renders → User interacts → Event handler fires
                   (click, submit, etc)
                                    ↓
                          handleAction() called
                          │
                    Query/Mutation defined
                    (GraphQL AST from .js file)
                                    │
                          useMutation/useQuery hook
                          executes request


STEP 2: Apollo Client Processing
─────────────────────────────────────────────────────

Apollo Link Chain:
│
├─→ authLink (setContext)
│   │
│   ├─ Read current token from tokenStore
│   │  getCurrentToken()
│   │
│   ├─ Add Authorization header
│   │  headers.authorization = token
│   │
│   └─ Return headers object
│
└─→ httpLink
    │
    ├─ Serialize query to string
    │
    ├─ Merge with variables
    │  { query: "...", variables: {...} }
    │
    └─ POST to GraphQL endpoint


STEP 3: Network Request
─────────────────────────────────────────────────────

HTTP POST Request
├─ URL: https://gql-shopping-sample.onrender.com/graphql
├─ Method: POST
├─ Headers:
│  ├─ Content-Type: application/json
│  └─ Authorization: eyJhbGc... (plain JWT)
└─ Body: { query, variables }


STEP 4: Backend Processing
─────────────────────────────────────────────────────

Backend receives request
│
├─ Extract Authorization header
├─ Verify JWT signature
├─ Decode JWT to get user info
├─ Check user permissions
├─ Execute resolver function
├─ Query/mutate database
├─ Format response
└─ Send back to client


STEP 5: Response Handling
─────────────────────────────────────────────────────

Apollo Client receives response
│
├─ Check for GraphQL errors
│  ├─ If errors → Extract error messages
│  └─ If data → Process data
│
├─ Update Apollo Cache
│  ├─ Store in InMemoryCache
│  └─ Merge with existing data
│
├─ Trigger component re-render
│  ├─ Call render function with new data
│  └─ Component re-renders
│
└─ Update UI
   ├─ Display data
   ├─ Show loading states
   └─ Display error messages if any


STEP 6: Error Handling
─────────────────────────────────────────────────────

If error occurs:

Type 1: Network Error
└─ Connection failed
   → Show "Connection failed" message
   → Allow retry

Type 2: GraphQL Error (4XX)
├─ 401 Unauthorized
│  └─ Token invalid/expired
│     → Clear token
│     → Redirect to login
│
├─ 400 Bad Request
│  └─ Invalid input
│     → Show validation error
│
└─ Other
   └─ Show error message to user

Type 3: Application Error
└─ Missing field, null pointer, etc
   → Show generic error message
   → Log to console


STEP 7: Response Data Flow (Success)
─────────────────────────────────────────────────────

Data returned from API
│
├─ Apollo caches result
├─ Component state updated
├─ Re-render triggered
│
Component Render:
├─ Read data from context/state
├─ Transform/format data
├─ Render JSX
├─ Return React elements
│
Browser Renders:
├─ Update DOM
├─ Apply CSS styles
├─ Execute animations
└─ Display to user
```

---

## Router & Navigation Flow

```
┌───────────────────────────────────────────────────────┐
│    ROUTING & NAVIGATION FLOW                          │
└───────────────────────────────────────────────────────┘

Router Configuration (TanStack Router)
────────────────────────────────────────────────────────

Root
│
├─ Layout: RootLayout.jsx (Protected)
│  │
│  └─ routeTree
│     │
│     ├─ Route: /
│     │  └─ Redirect to /login (if not auth)
│     │  └─ Redirect to /products (if auth)
│     │
│     ├─ Route: /login
│     │  ├─ Guard: publicGuard (must NOT be authenticated)
│     │  ├─ Component: LoginPage.jsx
│     │  └─ Redirect to /products if already logged in
│     │
│     ├─ Route: /register
│     │  ├─ Guard: publicGuard (must NOT be authenticated)
│     │  ├─ Component: RegisterPage.jsx
│     │  └─ Redirect to /products if already logged in
│     │
│     ├─ Route: /products
│     │  ├─ Guard: protectedGuard (must BE authenticated)
│     │  ├─ Component: ProductListPage.jsx
│     │  ├─ Error: AccessDenied page (if not authenticated)
│     │  └─ Redirect to /login if not auth
│     │
│     └─ Route: /product/:slug
│        ├─ Guard: protectedGuard (must BE authenticated)
│        ├─ Component: ProductDetailPage.jsx
│        ├─ Param: slug (product identifier)
│        └─ Redirect to /login if not auth


Navigation Examples
────────────────────────────────────────────────────────

1. User visits "/" (root)
   │
   ├─ RootLayout checks isAuthenticated
   │  │
   │  ├─ Token NOT found? → Redirect to /login
   │  └─ Token found? → Redirect to /products
   │
   └─ Component renders based on auth state


2. User clicks "Login" button from RegisterPage
   │
   ├─ navigate({ to: "/login" })
   ├─ Router matches /login route
   ├─ publicGuard checks authentication
   │  └─ User not yet logged in ✓ (allowed)
   │
   ├─ LoginPage component mounts
   │  ├─ State initialized
   │  └─ Form rendered
   │
   └─ Component displayed to user


3. User submits login form
   │
   ├─ handleSubmit() fires
   ├─ GraphQL mutation executed
   ├─ Backend validates credentials
   ├─ Token returned on success
   │
   ├─ login(userData, authToken) called
   │  ├─ Token encrypted + stored
   │  ├─ User data saved
   │  └─ setCurrentToken(plainToken)
   │
   ├─ navigate({ to: "/products" })
   ├─ Router matches /products route
   ├─ protectedGuard checks authentication
   │  └─ Token exists ✓ (allowed)
   │
   ├─ ProductListPage component mounts
   │  ├─ GET_ALL_PRODUCTS query fired
   │  ├─ Token included in Authorization header
   │  ├─ Backend returns products
   │  └─ Component displays grid
   │
   └─ User sees product list


4. User clicks product card
   │
   ├─ onClick handler fires
   ├─ navigate({ to: `/product/${slug}` })
   ├─ Router matches /product/:slug
   ├─ protectedGuard validates auth ✓
   │
   ├─ ProductDetailPage mounts
   │  ├─ GET_PRODUCT_BY_SLUG query
   │  ├─ GET_PRODUCT_REVIEWS query
   │  ├─ Both queries auto-include token
   │  └─ Data loads
   │
   └─ Product details + reviews displayed


5. User clicks logout (Header menu)
   │
   ├─ logout() function called
   │  ├─ encryptedToken cleared
   │  ├─ user data cleared
   │  └─ clearCurrentToken()
   │
   ├─ navigate({ to: "/login" })
   ├─ Router matches /login
   ├─ RootLayout detects !isAuthenticated
   │  └─ Allows access (public route)
   │
   └─ LoginPage displayed


Guard Logic Detailed
─────────────────────────────────────────────────────

protectedGuard():
   ├─ Call isAuthenticated()
   │  └─ Checks getCurrentToken()
   │
   ├─ If NO token
   │  └─ throw new Error("UNAUTHENTICATED_REDIRECT")
   │     ├─ Router catches error
   │     ├─ Redirects to /login
   │     └─ User cannot proceed
   │
   └─ If token EXISTS
      └─ Continue navigation
         └─ Allow access to protected route


publicGuard():
   ├─ Call isAuthenticated()
   │
   ├─ If token EXISTS
   │  └─ throw new Error("AUTHENTICATED_REDIRECT")
   │     ├─ Router catches error
   │     ├─ Redirects to /products
   │     └─ User already logged in
   │
   └─ If NO token
      └─ Continue navigation
         └─ Allow access to public route
```

---

## Error Handling Flow

```
┌───────────────────────────────────────────────────────┐
│      ERROR HANDLING IN SHOPI                          │
└───────────────────────────────────────────────────────┘

Error Sources
─────────────────────────────────────────────────────

1. Network Errors
   ├─ Connection timeout
   ├─ Server unreachable
   ├─ DNS resolution failed
   └─ Internet disconnected

2. GraphQL Errors
   ├─ 400 Bad Request
   │  └─ Invalid query/mutation
   ├─ 401 Unauthorized
   │  └─ Invalid/missing token
   └─ 500 Server Error
      └─ Backend error

3. Validation Errors
   ├─ Invalid email format
   ├─ Password too short
   └─ Required field missing

4. Application Errors
   ├─ Data not found
   ├─ Unexpected response format
   └─ Navigation errors


Error Handling Strategy
─────────────────────────────────────────────────────

LOGIN PAGE
──────────
try {
  ├─ Validate form inputs
  │  └─ Show inline validation errors
  │
  ├─ Execute login mutation
  │  │
  │  ├─ If mutation error
  │  │  └─ Catch in catch block
  │  │
  │  └─ If mutation success
  │     ├─ Validate token
  │     ├─ Store token
  │     └─ Navigate to /products
  │
} catch (error) {
  └─ Display error message
     └─ User can retry


PRODUCT LIST PAGE
─────────────────
useQuery(GET_ALL_PRODUCTS) → useQuery hook
│
├─ Query executes
│  ├─ Sends Authorization header
│  ├─ Backend validates token
│  └─ Returns data or error
│
├─ If loading
│  └─ Show <Loader /> component
│
├─ If error
│  ├─ Check error type
│  │
│  ├─ If 401 Unauthorized
│  │  ├─ Show "Access Denied" page
│  │  ├─ Show logout button
│  │  └─ logout() on button click
│  │
│  ├─ If network error
│  │  ├─ Show "Connection failed" message
│  │  └─ Allow retry
│  │
│  └─ Else (other error)
│     └─ Show generic error message
│
└─ If success
   └─ Display products


PRODUCT DETAIL PAGE
───────────────────
Two queries: GET_PRODUCT_BY_SLUG + GET_PRODUCT_REVIEWS

Response Handling:
│
├─ Both successful
│  └─ Display product + reviews
│
├─ Product query fails, reviews fails
│  └─ Show error page
│
├─ Product query succeeds, reviews fails
│  └─ Display product, show "Reviews unavailable"
│
└─ Product query fails, reviews succeeds
   └─ Show "Product not found" error


ADD REVIEW DIALOG
────────────────
Form submission:
│
├─ Validate form
│  └─ Show validation errors
│
├─ Submit mutation
│  │
│  ├─ Network error
│  │  └─ Show "Please check your connection"
│  │
│  ├─ GraphQL error: "User not found"
│  │  └─ Show "Unable to add review"
│  │
│  └─ Success
│     ├─ Close dialog
│     ├─ Refresh reviews
│     └─ Show success message
│
└─ User can retry or cancel


Error Display Pattern
──────────────────────

1. Inline Validation (Form Fields)
   └─ Below input field
   └─ Input border highlighted in red
   └─ Clear when user starts typing

2. Alert Messages (Form Level)
   └─ Above form
   └─ Red background (#error color)
   └─ Dismissible by user

3. Page-Level Errors (Authorization)
   └─ Full page error state
   └─ Header + Footer intact
   └─ Logout button available
   └─ Clear next steps

4. Toast/Snackbar (Success)
   └─ Bottom of screen
   └─ Green background
   └─ Auto-dismiss after 3s

5. Loading States
   ├─ Skeleton screens (placeholders)
   ├─ Spinner overlay (blocking)
   └─ Disabled buttons (preventing double-submit)


Specific Error Messages
───────────────────────

"Access denied! You don't have permission for this action!"
├─ Cause: 401 Unauthorized (invalid/missing token)
├─ Display: Full page error with Header/Footer
├─ Action: Show "Logout" button
└─ Fix: User logs out and logs back in

"User not found. It appears that your account has been removed..."
├─ Cause: User deleted or token contains invalid user ID
├─ Display: Dialog error message
├─ Action: Allow user to dismiss / retry
└─ Fix: User logs out and registers/logs in again

"Empty search results"
├─ Cause: searchHomeProducts returns []
├─ Display: Message "No products found"
├─ Action: Show browse all products button
└─ Fix: Backend issue - search doesn't work yet

"Network Error: Failed to fetch"
├─ Cause: Connection failed / API unreachable
├─ Display: Alert message with retry button
├─ Action: Allow user to retry request
└─ Fix: Check internet connection / API status
```

---

## Component Lifecycle & Hooks

```
┌──────────────────────────────────────────────────┐
│   COMPONENT LIFECYCLE                            │
└──────────────────────────────────────────────────┘

Login Page Lifecycle
────────────────────

1. MOUNT
   ├─ Initial state created
   │  ├─ formData: { email: "", password: "" }
   │  ├─ loginType: "user"
   │  └─ error: ""
   │
   └─ Component renders UI
      └─ Form inputs displayed


2. USER INTERACTION
   ├─ User types email
   ├─ onChange event fires
   ├─ setFormData({ ...formData, email })
   └─ Component re-renders
      └─ Input value updated


3. FORM SUBMISSION
   ├─ Form.onSubmit fires
   ├─ preventDefault()
   ├─ Validate inputs
   ├─ Execute mutation
   │  ├─ Loading state true
   │  └─ Submit button disabled
   │
   └─ Await response


4. LOGIN SUCCESS
   ├─ Token returned from backend
   ├─ login(userData, token) called
   │  ├─ Update AuthContext state
   │  └─ Emit update to all consumers
   │
   ├─ navigate({ to: "/products" })
   ├─ RootLayout detects isAuthenticated = true
   └─ ProductListPage mounts


5. LOGIN FAILURE
   ├─ Error returned by backend
   ├─ Catch block catches error
   ├─ setError(error.message)
   ├─ Component re-renders
   │  └─ Error alert displayed
   │
   └─ User can retry


Product List Page Lifecycle
───────────────────────────

1. MOUNT
   ├─ useAuth() hook called
   │  └─ Get token from AuthContext
   │
   ├─ useQuery(GET_ALL_PRODUCTS) fires
   │  ├─ authLink adds Authorization header
   │  └─ Query sends to backend
   │
   └─ Initial render shows <Loader/>


2. QUERY LOADING
   ├─ Component state: loading = true
   ├─ UI shows spinner or skeleton
   └─ User sees "Loading products..."


3. DATA ARRIVES
   ├─ useQuery updates with data
   ├─ products state updated
   ├─ Component re-renders
   └─ Product grid displayed


4. USER SEARCHES
   ├─ Search input onChange fires
   ├─ setSearchTerm(value)
   ├─ Search query debounced (300ms)
   │
   ├─ SEARCH_PRODUCTS query executes
   │  ├─ authLink includes token
   │  └─ Sends search parameter
   │
   ├─ Results update
   └─ Grid updates with new products


5. USER CLICKS PRODUCT
   ├─ onClick handler fires
   ├─ navigate({ to: `/product/${slug}` })
   ├─ Router changes location
   ├─ RootLayout processes route change
   ├─ ProductDetailPage component mounts
   └─ ProductListPage unmounts (cleanup)


6. UNMOUNT
   ├─ Cleanup effects
   ├─ Pending queries cancelled
   └─ Memory freed


Product Detail Page Lifecycle
──────────────────────────────

1. MOUNT
   ├─ Get slug from route params
   ├─ useAuth() for token
   │
   ├─ useQuery(GET_PRODUCT_BY_SLUG, { variables: { slug } })
   ├─ useQuery(GET_PRODUCT_REVIEWS, { variables: { productId } })
   │  └─ Wait for product ID from first query
   │
   ├─ authLink adds Authorization header to both
   └─ Both queries execute


2. LOADING STATE
   ├─ Both queries loading
   ├─ Component shows spinner
   └─ "Loading product details..."


3. PRODUCT LOADED
   ├─ First query returns product
   ├─ productId extracted
   ├─ Second query triggers with productId
   │  └─ Automatic dependency (Apollo caching)
   │
   └─ State updated, component re-renders


4. REVIEWS LOADED
   ├─ Second query returns reviews
   ├─ Reviews rendered below product
   ├─ Carousel initializes with images
   └─ Add Review button available


5. USER ADDS REVIEW
   ├─ "Add Review" button clicked
   ├─ AddReviewDialog opens (modal)
   ├─ User fills form
   ├─ Submit fires
   │
   ├─ addProductReview mutation executes
   │  ├─ authLink adds token
   │  ├─ Payload: { productId, rating, review, media }
   │  └─ Sends to backend
   │
   ├─ If success
   │  ├─ Dialog closes
   │  ├─ Reviews query refetches
   │  ├─ New review appears in list
   │  └─ Show success message
   │
   └─ If error
      ├─ Dialog shows error
      ├─ User can retry or close
      └─ Original reviews still visible


6. UNMOUNT
   ├─ Dialog closed if open
   ├─ Queries cancelled
   └─ Memory freed
```

---

## Summary

This comprehensive documentation covers:

1. **Architecture** - How components, services, and APIs connect
2. **Data Flow** - How data moves through the application
3. **Component Hierarchy** - Component tree and relationships
4. **State Management** - How state is organized
5. **Request Cycle** - Complete flow from user action to UI update
6. **Routing** - Navigation and route guards
7. **Error Handling** - How errors are caught and displayed
8. **Lifecycle** - Component mounting, updating, unmounting phases

Use this as a reference when:
- Adding new features
- Debugging issues
- Onboarding new developers
- Refactoring components
- Understanding token flow
