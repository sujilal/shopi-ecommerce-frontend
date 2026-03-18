# TROUBLESHOOTING GUIDE

## Overview

This guide helps debug and understand the known issues in Shopi frontend and provides solutions.

---

## 🔴 Critical Issues

### Issue #1: searchHomeProducts Returns Empty Array

#### Problem Description

```
Query: searchHomeProducts(search: $search)
Expected: Array of products matching search term
Actual: Always returns [] (empty array)
Impact: Search functionality is broken - users cannot find products by name
```

#### Technical Details

```javascript
// This query always returns empty results
query SearchHomeProducts($search: String!) {
  searchHomeProducts(search: $search) {
    id
    slug
    title
    price
    images { secure_url }
    // ... more fields
  }
}

// Example: searchHomeProducts(search: "laptop")
// Returns: [] ❌ (should return laptop products)
```

#### Reproduction Steps

1. Go to ProductListPage
2. Type any search term in SearchBar (e.g., "laptop", "phone")
3. Press Enter or wait for debounced query
4. Observe: Results remain empty or show "No products found"

#### Root Cause Analysis

The issue is on the **backend**, not frontend:

```
Possible causes:
├─ 1. Search resolver not implemented correctly
├─ 2. Search index not created/populated
├─ 3. Database query filters incorrect
├─ 4. Field name mismatch (searching wrong table)
└─ 5. Query schema expects different parameter name
```

#### Current Frontend Behavior

```javascript
// ProductListPage.jsx - Search handling
const handleSearch = (searchTerm) => {
  if (searchTerm === "") {
    // Show all products (GET_ALL_PRODUCTS)
    fetchProducts();
  } else {
    // Try to search (SEARCH_PRODUCTS)
    // But always gets [] from backend
    const { data } = await client.query({
      query: SEARCH_PRODUCTS,
      variables: { search: searchTerm }
    });
    // data.searchHomeProducts = [] ❌
    setProducts([]); // No results
  }
};
```

#### Temporary Frontend Workaround

```javascript
// Option 1: Disable search, show all products
const handleSearch = (searchTerm) => {
  if (searchTerm === "") {
    fetchAllProducts();
  } else {
    // Workaround: Show message instead of empty results
    setShowMessage("Search feature is temporarily unavailable");
    // Or fetch all and filter client-side
    fetchAllProducts();
  }
};

// Option 2: Client-side filtering (temporary)
const handleSearch = (searchTerm) => {
  const allProducts = await fetchAllProducts();
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setProducts(filtered);
};

// Option 3: Hide search UI temporarily
<SearchBar disabled placeholder="Search coming soon" />
```

#### To Fix Backend

```javascript
// Backend resolver (pseudo-code)
// This is where the bug likely is:

const searchHomeProducts = async (_, { search }) => {
  // ❌ WRONG: Searching wrong table
  // const results = db.query(`SELECT * FROM products WHERE name LIKE '${search}'`);
  
  // ✅ CORRECT: Proper search implementation
  const results = await db.products.find({
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ]
  });
  
  return results;
};
```

#### Testing the Fix

Once backend is fixed:

```javascript
// Test in browser console
const { data } = await apolloClient.query({
  query: SEARCH_PRODUCTS,
  variables: { search: "laptop" }
});
console.log(data.searchHomeProducts.length); // Should be > 0
```

---

### Issue #2: addProductReview Throws "User Not Found" Error

#### Problem Description

```
Mutation: addProductReview(payload: ProductReviewsPayload!)
Error Message: "User not found. It appears that your account has been 
               removed from our records."
HTTP Status: 400 or 401
Impact: Users CANNOT add reviews to products
Timeline: Occurs after authenticated user submits review form
```

#### Technical Details

```javascript
// This mutation fails with "User not found"
mutation AddProductReview($payload: ProductReviewsPayload!) {
  addProductReview(payload: $payload) {
    id
    review
    rating
    user { displayName }
    createdAt
  }
}

// Payload sent:
{
  productId: "product123",
  rating: 5,
  review: "Great product!",
  media: []
}

// Backend response:
{
  "errors": [{
    "message": "User not found. It appears that your account has been 
               removed from our records."
  }]
}
```

#### Reproduction Steps

1. Login successfully (can browse products)
2. Go to ProductDetailPage
3. Click "Add Review" button
4. Fill form: rating, review text
5. Click Submit
6. Observe: Error message appears ❌

#### Root Cause Analysis

The issue is on the **backend** when linking review to user:

```
Likely causes:
├─ 1. JWT token decode doesn't extract user ID
│  └─ Backend can't identify which user added review
│
├─ 2. User ID in token doesn't match database
│  └─ Token has ID "user123" but DB lookup returns null
│
├─ 3. User deleted between login and review submission
│  └─ Token valid, but user doesn't exist in DB
│
├─ 4. Database relationship not set up correctly
│  └─ Review table can't reference user
│
└─ 5. User permission/role prevents review creation
   └─ API checks user type before allowing review
```

#### Current Frontend Behavior

```javascript
// AddReviewDialog.jsx - Review submission
const handleSubmit = async () => {
  try {
    const { data } = await addProductReviewMutation({
      variables: {
        payload: {
          productId,
          rating: formData.rating,
          review: formData.review,
          media: formData.media
        }
      }
    });
    
    if (data) {
      // Success - refresh reviews
      onClose();
      refetchReviews();
    }
  } catch (error) {
    // ❌ Catches "User not found" error
    setError(error.message);
    // Error message displayed to user
  }
};
```

#### Temporary Frontend Workaround

```javascript
// Graceful error handling
const handleReviewError = (error) => {
  if (error.message.includes("User not found")) {
    // Show better message
    setError("Unable to add review. Please logout and login again.");
    
    // Option: Auto-logout on this error
    setTimeout(() => {
      logout(); // Clear auth
      navigate({ to: "/login" });
    }, 2000);
  } else {
    setError(error.message);
  }
};

// Or: Disable review feature
<Button disabled title="Review feature temporarily unavailable">
  Add Review
</Button>
```

#### To Fix Backend

```javascript
// Backend mutation (pseudo-code)
const addProductReview = async (_, { payload }, context) => {
  try {
    // ✅ Step 1: Extract user from JWT token
    const userId = context.user?.id; // From decoded JWT
    
    // ✅ Step 2: Verify user exists in database
    const user = await db.users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // ✅ Step 3: Verify product exists
    const product = await db.products.findById(payload.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    
    // ✅ Step 4: Create review with proper relationship
    const review = await db.reviews.create({
      productId: payload.productId,
      userId: userId,  // Link to user
      rating: payload.rating,
      review: payload.review,
      media: payload.media,
      createdAt: new Date()
    });
    
    // ✅ Step 5: Return review
    return review;
    
  } catch (error) {
    console.error("Review error:", error);
    throw error;
  }
};
```

#### Testing the Fix

```javascript
// Test review submission
try {
  const data = await apolloClient.mutate({
    mutation: ADD_PRODUCT_REVIEW,
    variables: {
      payload: {
        productId: "test-product",
        rating: 5,
        review: "Test review"
      }
    }
  });
  console.log("Review added:", data); // Should succeed
} catch (error) {
  console.error("Error:", error.message);
}
```

---

### Issue #3: Access Denied After User Registration

#### Problem Description

```
Scenario: New user registers → Logs in automatically → Redirects to /products
Error: "Access denied! You don't have permission for this action!"
Query: getAllProducts
HTTP Status: 401 Unauthorized
Impact: Newly registered users cannot browse products
Note: Existing users login fine
```

#### Technical Details

```
Flow:
1. User fills registration form
   ├─ displayName: "John Doe"
   ├─ email: "john@example.com"
   └─ password: "SecurePass123"

2. CREATE_USER mutation sent
   ✅ Backend returns:
   ├─ authToken: "eyJhbGciOiJIUzI1NiI..."
   └─ user: { displayName, email, id }

3. Frontend calls login(userData, authToken)
   ├─ Encrypts token
   ├─ Stores in context
   └─ setCurrentToken(plainToken)

4. Router navigates to /products
   └─ ProductListPage mounts

5. GET_ALL_PRODUCTS query sent
   ├─ Token included in Authorization
   └─ ❌ Backend returns 401 "Access denied"

6. Error page displayed
   └─ User cannot proceed
```

#### Root Cause Analysis

Several factors could cause this:

```
Possibility A: Token Format Difference
├─ CREATE_USER returns different token format
├─ Token from CREATE_USER isn't valid for other endpoints
└─ Fix: Check token structure, use same JWT for all endpoints

Possibility B: Permission/Role Setup
├─ New users created without required role
├─ getAllProducts requires specific role
├─ New users don't have "user" role
└─ Fix: Set role to "user" on registration

Possibility C: Email Verification Required
├─ New users must verify email before accessing products
├─ User created but marked as unverified
├─ getAllProducts checks emailVerified flag
└─ Fix: Skip verification or auto-verify on signup

Possibility D: Timing Issue
├─ Token generated but not yet active in system
├─ Database commit hasn't completed
├─ Race condition between CREATE_USER and getAllProducts
└─ Fix: Add small delay before first request

Possibility E: Token Decoding Issue
├─ Backend decodes token differently for new users
├─ Secret key or algorithm mismatch
├─ JWT validation logic differs
└─ Fix: Ensure consistent JWT validation
```

#### Frontend Debugging Steps

```javascript
// 1. Check what token we got
console.log("Token from CREATE_USER:", authToken);
console.log("Token length:", authToken.length);

// 2. Decode token (in browser console)
const parts = authToken.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log("Token payload:", payload);
// Should contain: { id, email, iat, exp, ... }

// 3. Check if token is in context
const { token } = useAuth();
console.log("Token in context:", token);

// 4. Check if token is in tokenStore
import { getCurrentToken } from "@/utils/tokenStore";
console.log("Token in tokenStore:", getCurrentToken());

// 5. Manually check API call
fetch('https://gql-shopping-sample.onrender.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': authToken // Try plain token
  },
  body: JSON.stringify({
    query: `query { getAllProducts(filters: {query: null}) { products { id } } }`
  })
})
.then(r => r.json())
.then(d => console.log("Response:", d));
```

#### Current Frontend Behavior

```javascript
// RegisterPage.jsx
const handleRegisterSuccess = async (userData, authToken) => {
  try {
    // Call AuthContext login
    login(userData, authToken);
    
    // Immediately navigate
    navigate({ to: "/products" });
    
    // ISSUE: No validation that token works before redirecting
  } catch (error) {
    setError(error.message);
  }
};
```

#### Temporary Frontend Workaround

```javascript
// Option 1: Delay before redirect to allow server to catch up
const handleRegisterSuccess = async (userData, authToken) => {
  login(userData, authToken);
  
  // Wait 1 second before redirecting
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  navigate({ to: "/products" });
};

// Option 2: Auto-redirect to login page with message
const handleRegisterSuccess = async (userData, authToken) => {
  login(userData, authToken);
  
  // Show success message
  setMessage("Registration successful! Please log in.");
  
  // Redirect to login after 2 seconds
  setTimeout(() => {
    logout(); // Clear the token just created
    navigate({ to: "/login" });
  }, 2000);
};

// Option 3: Validate token before redirecting
const handleRegisterSuccess = async (userData, authToken) => {
  login(userData, authToken);
  
  // Try a simple query to validate token
  try {
    const { data } = await client.query({
      query: gql`{ getAllProducts(filters: {query: null}) { products { id } } }`
    });
    // Token works!
    navigate({ to: "/products" });
  } catch (error) {
    // Token doesn't work, show error
    setError("Registration completed but access issue detected. Please login manually.");
    logout();
    navigate({ to: "/login" });
  }
};
```

#### To Fix Backend

```javascript
// Backend registration (pseudo-code)
const createUser = async (_, { payload }) => {
  try {
    // 1. Validate input
    validateEmail(payload.email);
    validatePassword(payload.password);
    
    // 2. Check if user exists
    const existing = await db.users.findOne({ email: payload.email });
    if (existing) throw new Error("User already exists");
    
    // 3. Hash password
    const hashedPassword = await hashPassword(payload.password);
    
    // 4. Create user with defaults
    const user = await db.users.create({
      email: payload.email,
      password: hashedPassword,
      displayName: payload.displayName,
      provider: payload.provider,
      role: "user",  // ✅ Set role
      emailVerified: true,  // ✅ Auto-verify for now
      createdAt: new Date()
    });
    
    // 5. Generate token using SAME method as userLogin
    const authToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // 6. Return token and user
    return {
      authToken, // ← Same format as userLogin
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }
    };
    
  } catch (error) {
    throw new Error(error.message);
  }
};
```

#### Testing the Fix

```javascript
// Test registration -> automatic product access
1. Navigate to /register
2. Fill form with:
   - displayName: "TestUser"
   - email: "test@example.com"
   - password: "Test123!@#"
3. Submit
4. Should see product list immediately
5. Verify: Check user in database
   - role: "user"
   - emailVerified: true
6. Verify: Token works
   - Open DevTools
   - Check Authorization header sent in next request
```

---

## 🟡 Minor Issues

### Issue #4: Page Refresh Requires Re-login

#### Description

```
Behavior: User browses products → Refreshes page → Logged out
Expected: Stay logged in
Actual: Redirected to login
Reason: Token stored in memory only, cleared on refresh
```

#### Why This Happens

```javascript
// AuthContext stores token in React state (memory)
const [encryptedToken, setEncryptedToken] = useState(null);

// On page refresh:
1. Browser window.location is reloaded
2. All JavaScript cleared
3. React remounts from scratch
4. AuthContext resets to initial state (null)
5. Token lost

// No localStorage fallback to restore it
```

#### Is This a Bug?

No - **it's a security feature**

```
Security Benefits:
✅ XSS-proof (token can't be stolen by scripts)
✅ No persistent disk storage
✅ Auto-logout on refresh
✅ Reduces token exposure window

Trade-offs:
⚠️ Poor user experience (must re-login)
⚠️ Loss of state on F5
⚠️ Irritating for development
```

#### Optional "Remember Me" Fix

```javascript
// If you want optional persistence:

// AuthContext.jsx
const login = (userData, authToken, rememberMe = false) => {
  const encrypted = encryptToken(authToken);
  setEncryptedToken(encrypted);
  setUser(userData);
  
  // Optional: Store in sessionStorage (auto-cleared on browser close)
  if (rememberMe) {
    sessionStorage.setItem("_token", encrypted);
    sessionStorage.setItem("_user", JSON.stringify(userData));
  }
};

// On component mount
useEffect(() => {
  const stored = sessionStorage.getItem("_token");
  if (stored) {
    setEncryptedToken(stored);
    setUser(JSON.parse(sessionStorage.getItem("_user")));
  }
}, []);

// LoginPage.jsx
<FormControlLabel
  control={<Checkbox />}
  label="Remember me"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>

// On submit
login(userData, authToken, rememberMe);
```

---

## 🟢 Testing & Validation

### How to Test Each Issue

#### Test Issue #1 (Search)

```bash
# Step 1: With GET_ALL_PRODUCTS (works)
curl -X POST https://gql-shopping-sample.onrender.com/graphql \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getAllProducts(filters: {query: null}) { products { id title } } }"
  }'
# Should return products ✅

# Step 2: With SEARCH_PRODUCTS (broken)
curl -X POST https://gql-shopping-sample.onrender.com/graphql \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { searchHomeProducts(search: \"laptop\") { id title } }"
  }'
# Returns [] ❌
```

#### Test Issue #2 (Reviews)

```bash
# Step 1: Login and get token ✅
# Step 2: Get product ID from getAllProducts ✅
# Step 3: Try to add review ❌

curl -X POST https://gql-shopping-sample.onrender.com/graphql \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { addProductReview(payload: {productId: \"product-id\", rating: 5, review: \"test\"}) { id } }"
  }'
# Returns: "User not found" error ❌
```

#### Test Issue #3 (Registration)

```bash
# Step 1: Register new user ✅
# Step 2: Get token from response ✅
# Step 3: Try GET_ALL_PRODUCTS with new token ❌

curl -X POST https://gql-shopping-sample.onrender.com/graphql \
  -H "Authorization: NEWLY_REGISTERED_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getAllProducts(filters: {query: null}) { products { id } } }"
  }'
# Returns: 401 Unauthorized ❌
```

---

## 📊 Issue Summary Table

| Issue | Severity | Impact | Root Cause | Frontend Fix | Backend Fix |
|-------|----------|--------|-----------|--------------|-------------|
| Search Returns [] | 🔴 Critical | Users can't find products | Search resolver | Show "Feature unavailable" | Fix resolver query |
| User Not Found | 🔴 Critical | Users can't add reviews | User lookup fails | Auto logout on error | Fix user relationship |
| New User Access Denied | 🔴 Critical | New users can't browse | Token/role issue | Delay redirect | Set user role correctly |
| Refresh Logs Out | 🟡 Minor | Poor UX | By design | Add "Remember Me" | N/A (security feature) |

---

## 📝 Debugging Checklist

When issues occur, check:

- [ ] Is user authenticated? Check `useAuth()` hook
- [ ] Is token valid? Decode in console: `atob(token.split('.')[1])`
- [ ] Is token sent in headers? Check Network tab, Authorization header
- [ ] What's the exact error message? Copy from console or Network tab
- [ ] Has this worked before? Check git history for recent changes
- [ ] Is backend running? Can you reach the API?
- [ ] Is GraphQL query correct? Test in GraphQL Playground
- [ ] Did backend recently change? Ask backend developer about changes

---

## 🔍 Console Debugging

```javascript
// Quick debugging in browser console

// 1. Check auth state
const { token, user, isAuthenticated } = useAuth?.();
console.log({ token, user, isAuthenticated });

// 2. Check token storage
import { getCurrentToken } from "@/utils/tokenStore";
console.log("Token in store:", getCurrentToken());

// 3. Decode token
const decode = (token) => JSON.parse(atob(token.split('.')[1]));
console.log("Token decoded:", decode(token));

// 4. Check context state (requires React DevTools)
// Open React DevTools → Components → AuthProvider
// Look for encryptedToken, user state

// 5. Check Apollo cache
window.__APOLLO_CLIENT__.cache.data.data
```

---

## 🚀 Reporting Issues

When reporting a new issue:

1. **Title**: Clear, concise description
2. **Steps to Reproduce**: Exact steps to trigger issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Error Message**: Copy exact error from console
6. **Screenshots**: Show error UI
7. **Environment**: Browser, OS, Node version
8. **API Requests**: Show network requests in Developer Tools

---

## 📋 Next Steps

- [ ] Fix search resolver (Backend)
- [ ] Fix user review relationship (Backend)
- [ ] Fix new user permissions (Backend)
- [ ] Consider "Remember Me" feature (Frontend/optional)
- [ ] Add better error messages (Frontend)
- [ ] Add loading states (Frontend)
- [ ] Test all flows (Everyone)
