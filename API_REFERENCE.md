# API REFERENCE

Complete reference for all GraphQL queries and mutations used in Shopi Frontend.

---

## Base Configuration

```
Endpoint: https://gql-shopping-sample.onrender.com/graphql
Method: POST
Content-Type: application/json

Authentication:
  Header: Authorization
  Value: {JWT_TOKEN}
  Format: Plain token (no "Bearer" prefix)
  
Example Request:
  POST https://gql-shopping-sample.onrender.com/graphql
  Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  
  {
    "query": "mutation { userLogin(...) { authToken } }",
    "variables": { "email": "user@example.com", "password": "..." }
  }
```

---

## Authentication Mutations

### userLogin

**Purpose**: Authenticate regular user login

**Mutation**:
```graphql
mutation UserLogin($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    authToken
    user {
      id
      email
      displayName
    }
  }
}
```

**Variables**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response**:
```json
{
  "data": {
    "userLogin": {
      "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmODc5ZDBhNDBmZTRjMDAxMjQ1Njc4OSIsImVtYWlsIjoiHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2MDI1ODgzMzksImV4cCI6MTYwMzE5MzEzOX0.K7k...",
      "user": {
        "id": "5f879d0a40fe4c0012456789",
        "email": "user@example.com",
        "displayName": "John Doe"
      }
    }
  }
}
```

**Error Response** (Invalid Credentials):
```json
{
  "errors": [
    {
      "message": "Invalid email address or password",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

**Used In**: LoginPage (User mode)

**Frontend Implementation**:
```javascript
const [userLoginMutation] = useMutation(USER_LOGIN);

const handleLogin = async (email, password) => {
  try {
    const { data } = await userLoginMutation({
      variables: { email, password }
    });
    
    const { authToken, user } = data.userLogin;
    login(user, authToken); // AuthContext
    navigate({ to: "/products" });
  } catch (error) {
    setError(error.message);
  }
};
```

---

### adminLogin

**Purpose**: Authenticate admin user login

**Mutation**:
```graphql
mutation AdminLogin($email: String!, $password: String!) {
  adminLogin(email: $email, password: $password) {
    authToken
    user {
      email
    }
  }
}
```

**Variables**:
```json
{
  "email": "admin@example.com",
  "password": "adminpass123"
}
```

**Success Response**:
```json
{
  "data": {
    "adminLogin": {
      "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "email": "admin@example.com"
      }
    }
  }
}
```

**Used In**: LoginPage (Admin mode)

**Frontend Implementation**:
```javascript
const [adminLoginMutation] = useMutation(ADMIN_LOGIN);

const handleAdminLogin = async (email, password) => {
  try {
    const { data } = await adminLoginMutation({
      variables: { email, password }
    });
    
    const { authToken, user } = data.adminLogin;
    login({ ...user, role: "admin" }, authToken);
    navigate({ to: "/products" });
  } catch (error) {
    setError(error.message);
  }
};
```

---

### createUser

**Purpose**: Register new user account

**Mutation**:
```graphql
mutation CreateUser($payload: CreateUserPayload!) {
  createUser(payload: $payload) {
    accessToken
    authToken
    user {
      displayName
      email
      emailVerified
      sex
      tileDisplay
    }
  }
}
```

**Variables** (Payload Structure):
```json
{
  "payload": {
    "displayName": "Jane Smith",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "provider": "local"
  }
}
```

**CreateUserPayload Fields**:
- `displayName` (string, required): User's display name
- `email` (string, required): User's email address
- `password` (string, required): User's password
- `provider` (string, required): Auth provider ("local", "google", etc.)

**Success Response**:
```json
{
  "data": {
    "createUser": {
      "accessToken": "eyJhbGciOiJIUzI1NiI...",
      "authToken": "eyJhbGciOiJIUzI1NiI...",
      "user": {
        "displayName": "Jane Smith",
        "email": "jane@example.com",
        "emailVerified": false,
        "sex": null,
        "tileDisplay": null
      }
    }
  }
}
```

**Error Responses**:
```json
// Email already exists
{
  "errors": [{
    "message": "Email already registered",
    "extensions": { "code": "BAD_REQUEST" }
  }]
}

// Invalid email format
{
  "errors": [{
    "message": "Invalid email format",
    "extensions": { "code": "BAD_REQUEST" }
  }]
}

// Password too weak
{
  "errors": [{
    "message": "Password must be at least 8 characters",
    "extensions": { "code": "BAD_REQUEST" }
  }]
}
```

**Used In**: RegisterPage

**Frontend Implementation**:
```javascript
const [createUserMutation] = useMutation(CREATE_USER);

const handleRegister = async (displayName, email, password) => {
  try {
    const { data } = await createUserMutation({
      variables: {
        payload: {
          displayName,
          email,
          password,
          provider: "local"
        }
      }
    });
    
    const { authToken, user } = data.createUser;
    login(user, authToken);
    navigate({ to: "/products" });
  } catch (error) {
    setError(error.message);
  }
};
```

**⚠️ Known Issue**: After successful registration, token may not work with getAllProducts query. See TROUBLESHOOTING.md - Issue #3.

---

## Product Queries

### getAllProducts

**Purpose**: Fetch all available products with optional filters

**Query**:
```graphql
query GetAllProducts {
  getAllProducts(filters: { query: null }) {
    products {
      id
      views
      category
      currency
      approved
      slug
      title
      images {
        secure_url
      }
      stockCount
      quantityRemaining
      inStock
      live
      featured
      showStock
      video {
        secure_url
      }
      type
      brand
      color
      description
      price
      negotiable
      isAddedToFavs
      averageRating
      totalReviews
      percentageDiscount
      attributes
      createdAt
    }
  }
}
```

**Variables**: None (optional filters: query)

**Success Response**:
```json
{
  "data": {
    "getAllProducts": {
      "products": [
        {
          "id": "6048f21d8b6f3c0012abc123",
          "slug": "awesome-laptop",
          "title": "Awesome Laptop Pro",
          "price": 999.99,
          "currency": "USD",
          "images": [
            {
              "secure_url": "https://example.com/image1.jpg"
            }
          ],
          "averageRating": 4.5,
          "totalReviews": 12,
          "inStock": true,
          "stockCount": 50,
          "description": "High-performance laptop...",
          "brand": "TechBrand",
          ...more fields
        }
      ]
    }
  }
}
```

**Authentication**: ✅ Required (JWT token in Authorization header)

**Pagination**: Manual pagination (implemented via offset/limit in resolver)
- Currently fetching ALL products at once
- 9 products displayed per page (client-side pagination)

**Used In**: ProductListPage

**Frontend Implementation**:
```javascript
const { data: productsData, loading, error } = useQuery(GET_ALL_PRODUCTS);

useEffect(() => {
  if (productsData?.getAllProducts?.products) {
    const allProducts = productsData.getAllProducts.products;
    // Pagination logic
    const itemsPerPage = 9;
    const paginatedProducts = allProducts.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
    setProducts(paginatedProducts);
  }
}, [productsData, currentPage]);
```

---

### searchHomeProducts

**Purpose**: Search products by keyword

**Query**:
```graphql
query SearchHomeProducts($search: String!) {
  searchHomeProducts(search: $search) {
    id
    views
    category
    currency
    approved
    slug
    title
    images {
      secure_url
    }
    stockCount
    quantityRemaining
    inStock
    live
    featured
    showStock
    video {
      secure_url
    }
    type
    brand
    color
    description
    price
    negotiable
    isAddedToFavs
    averageRating
    totalReviews
    percentageDiscount
    attributes
    createdAt
  }
}
```

**Variables**:
```json
{
  "search": "laptop"
}
```

**Success Response** (Expected):
```json
{
  "data": {
    "searchHomeProducts": [
      {
        "id": "6048f21d8b6f3c0012abc123",
        "slug": "awesome-laptop",
        "title": "Awesome Laptop Pro",
        "price": 999.99,
        "images": [{ "secure_url": "https://..." }],
        ...more fields
      }
    ]
  }
}
```

**Actual Response** (⚠️ BUG):
```json
{
  "data": {
    "searchHomeProducts": []  // Always empty!
  }
}
```

**Authentication**: ✅ Required

**⚠️ Known Issue**: Always returns empty array. See TROUBLESHOOTING.md - Issue #1

**Used In**: ProductListPage (SearchBar debounced search)

**Frontend Implementation**:
```javascript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useCallback(
  debounce((term) => {
    if (term) {
      client.query({
        query: SEARCH_PRODUCTS,
        variables: { search: term }
      }).then(({ data }) => {
        // ❌ data.searchHomeProducts = [] (empty)
        setProducts(data.searchHomeProducts);
      });
    }
  }, 300),
  []
);

const handleSearchChange = (value) => {
  setSearchTerm(value);
  debouncedSearch(value);
};
```

---

### getProductBySlug

**Purpose**: Fetch detailed product information by slug

**Query**:
```graphql
query GetProductBySlug($slug: String!) {
  getProductBySlug(slug: $slug) {
    id
    slug
    title
    price
    description
    category
    brand
    color
    images {
      secure_url
    }
    video {
      secure_url
    }
    shop {
      owner
    }
    inStock
    stockCount
    averageRating
    totalReviews
    type
    negotiable
    attributes
    createdAt
    updatedAt
  }
}
```

**Variables**:
```json
{
  "slug": "awesome-laptop"
}
```

**Success Response**:
```json
{
  "data": {
    "getProductBySlug": {
      "id": "6048f21d8b6f3c0012abc123",
      "slug": "awesome-laptop",
      "title": "Awesome Laptop Pro",
      "price": 999.99,
      "description": "High-performance laptop with...",
      "category": "Electronics",
      "brand": "TechBrand",
      "color": "Silver",
      "images": [
        {
          "secure_url": "https://example.com/laptop-1.jpg"
        },
        {
          "secure_url": "https://example.com/laptop-2.jpg"
        }
      ],
      "video": {
        "secure_url": "https://example.com/demo.mp4"
      },
      "shop": {
        "owner": "TechStore"
      },
      "inStock": true,
      "stockCount": 50,
      "averageRating": 4.5,
      "totalReviews": 12,
      "type": "Electronics",
      "negotiable": false,
      "attributes": ["RAM:16GB", "Storage:512GB SSD"],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-03-18T14:20:00Z"
    }
  }
}
```

**Error Response** (Product not found):
```json
{
  "data": {
    "getProductBySlug": null
  }
}
```

**Authentication**: ✅ Required

**Used In**: ProductDetailPage

**Frontend Implementation**:
```javascript
const { slug } = useParams(); // From route
const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
  variables: { slug }
});

if (loading) return <Loader />;
if (error) return <ErrorPage error={error} />;
if (!data?.getProductBySlug) return <NotFound />;

const product = data.getProductBySlug;
return (
  <Box>
    <Carousel images={product.images} />
    <Typography variant="h4">{product.title}</Typography>
    <Typography variant="h6" color="primary">
      ${product.price}
    </Typography>
    {/* ... more UI */}
  </Box>
);
```

---

### getProductReviews

**Purpose**: Fetch all reviews for a specific product

**Query**:
```graphql
query GetProductReviews($productId: String!) {
  getProductReviews(productId: $productId) {
    reviewList {
      id
      review
      rating
      user {
        displayName
        image
      }
      likes
      dislikes
      media {
        secure_url
      }
      createdAt
      updatedAt
    }
  }
}
```

**Variables**:
```json
{
  "productId": "6048f21d8b6f3c0012abc123"
}
```

**Success Response**:
```json
{
  "data": {
    "getProductReviews": {
      "reviewList": [
        {
          "id": "review_001",
          "review": "Great product! Works as expected.",
          "rating": 5,
          "user": {
            "displayName": "John Doe",
            "image": "https://example.com/avatar.jpg"
          },
          "likes": 8,
          "dislikes": 0,
          "media": [
            {
              "secure_url": "https://example.com/review-image.jpg"
            }
          ],
          "createdAt": "2024-01-10T08:30:00Z",
          "updatedAt": "2024-01-10T08:30:00Z"
        },
        {
          "id": "review_002",
          "review": "Good quality but shipping took long.",
          "rating": 4,
          "user": {
            "displayName": "Jane Smith",
            "image": "https://example.com/avatar2.jpg"
          },
          "likes": 5,
          "dislikes": 1,
          "media": [],
          "createdAt": "2024-01-08T14:15:00Z",
          "updatedAt": "2024-01-08T14:15:00Z"
        }
      ]
    }
  }
}
```

**Empty Reviews Response**:
```json
{
  "data": {
    "getProductReviews": {
      "reviewList": []
    }
  }
}
```

**Authentication**: ✅ Required

**Used In**: ProductDetailPage (Reviews tab)

**Frontend Implementation**:
```javascript
const { data: reviewsData } = useQuery(GET_PRODUCT_REVIEWS, {
  variables: { productId: product.id },
  skip: !product?.id // Skip until product ID available
});

const reviews = reviewsData?.getProductReviews?.reviewList || [];

return (
  <Box>
    <Typography variant="h6">Customer Reviews ({reviews.length})</Typography>
    {reviews.map(review => (
      <ReviewItem key={review.id} review={review} />
    ))}
  </Box>
);
```

---

## Product Mutations

### addProductReview

**Purpose**: Submit a review for a product

**Mutation**:
```graphql
mutation AddProductReview($payload: ProductReviewsPayload!) {
  addProductReview(payload: $payload) {
    id
    review
    product {
      id
    }
    user {
      displayName
      image
    }
    rating
    likes {
      image
      lastMessage {
        content
      }
    }
    dislikes {
      lastMessage {
        content
      }
    }
    media {
      secure_url
    }
    isImages
    createdAt
    updatedAt
  }
}
```

**Variables** (ProductReviewsPayload):
```json
{
  "payload": {
    "productId": "6048f21d8b6f3c0012abc123",
    "rating": 5,
    "review": "Excellent product! Highly recommended.",
    "media": []
  }
}
```

**ProductReviewsPayload Fields**:
- `productId` (string, required): ID of product being reviewed
- `rating` (number, required): Rating 1-5
- `review` (string, required): Review text
- `media` (array, optional): Images/media files

**Success Response**:
```json
{
  "data": {
    "addProductReview": {
      "id": "review_003",
      "review": "Excellent product! Highly recommended.",
      "product": {
        "id": "6048f21d8b6f3c0012abc123"
      },
      "user": {
        "displayName": "Current User",
        "image": "https://example.com/avatar.jpg"
      },
      "rating": 5,
      "likes": [],
      "dislikes": [],
      "media": [],
      "isImages": false,
      "createdAt": "2024-03-18T15:45:00Z",
      "updatedAt": "2024-03-18T15:45:00Z"
    }
  }
}
```

**Error Response** (⚠️ BUG):
```json
{
  "errors": [
    {
      "message": "User not found. It appears that your account has been removed from our records.",
      "extensions": {
        "code": "INTERNAL_ERROR"
      }
    }
  ]
}
```

**Authentication**: ✅ Required

**⚠️ Known Issue**: Always returns "User not found" error. See TROUBLESHOOTING.md - Issue #2

**Used In**: ProductDetailPage (AddReviewDialog component)

**Frontend Implementation**:
```javascript
const [addProductReviewMutation] = useMutation(ADD_PRODUCT_REVIEW);

const handleSubmitReview = async (rating, review, media) => {
  try {
    const { data } = await addProductReviewMutation({
      variables: {
        payload: {
          productId: product.id,
          rating: parseInt(rating),
          review,
          media // Can be empty array
        }
      }
    });
    
    // Success
    onClose(); // Close dialog
    refetch(); // Refresh reviews
    showMessage("Review added successfully!");
    
  } catch (error) {
    if (error.message.includes("User not found")) {
      showError("Unable to add review. Please logout and login again.");
      // Could auto-logout here
    } else {
      showError(error.message);
    }
  }
};
```

---

## Query Patterns

### Dependent Queries

Some queries depend on data from previous queries:

```javascript
// Pattern: Query 2 waits for Query 1 result

// Step 1: Get product by slug
const { data: productData } = useQuery(GET_PRODUCT_BY_SLUG, {
  variables: { slug: "awesome-laptop" }
});

// Step 2: Get reviews - needs product ID from step 1
const { data: reviewsData } = useQuery(GET_PRODUCT_REVIEWS, {
  variables: { productId: productData?.getProductBySlug?.id },
  skip: !productData?.getProductBySlug?.id // Don't run until ID available
});

// Results automatically combined when both queries complete
const product = productData?.getProductBySlug;
const reviews = reviewsData?.getProductReviews?.reviewList;
```

### Query Caching

Apollo Client automatically caches query results:

```javascript
// First call - fetches from API
const { data: data1 } = useQuery(GET_ALL_PRODUCTS);

// Second call - returns from cache (same query)
const { data: data2 } = useQuery(GET_ALL_PRODUCTS);
// data1 === data2 (same object from cache)

// Refetch to update cache
const { refetch } = useQuery(GET_ALL_PRODUCTS);
refetch(); // Forces fresh API call
```

---

## Error Codes Reference

| Code | HTTP Status | Meaning | Action |
|------|-------------|---------|--------|
| UNAUTHENTICATED | 401 | Token missing or invalid | Redirect to login |
| FORBIDDEN | 403 | User lacks permission | Show error page |
| BAD_REQUEST | 400 | Invalid input/query | Check query validity |
| NOT_FOUND | 404 | Resource doesn't exist | Show 404 page |
| INTERNAL_ERROR | 500 | Server error | Show generic error, retry |
| NETWORK_ERROR | N/A | Connection failed | Check internet, retry |

---

## Best Practices

### 1. Always Include Error Handling

```javascript
const { data, loading, error } = useQuery(QUERY);

if (loading) return <Loader />;
if (error) return <ErrorAlert error={error} />;
if (!data) return <NoData />;

return <Component data={data} />;
```

### 2. Use Proper Variable Types

```javascript
// ✅ Correct
useQuery(SEARCH_PRODUCTS, {
  variables: { search: "laptop" } // string
});

// ❌ Wrong
useQuery(SEARCH_PRODUCTS, {
  variables: { search: 123 } // number
});
```

### 3. Skip Queries When Not Ready

```javascript
// ✅ Correct - wait for productId
useQuery(GET_PRODUCT_REVIEWS, {
  variables: { productId },
  skip: !productId
});

// ❌ Wrong - runs with undefined productId
useQuery(GET_PRODUCT_REVIEWS, {
  variables: { productId: undefined }
});
```

### 4. Refetch After Mutations

```javascript
const { refetch } = useQuery(GET_PRODUCT_REVIEWS);
const [addReview] = useMutation(ADD_PRODUCT_REVIEW);

const handleAddReview = async () => {
  await addReview({ variables: { payload } });
  await refetch(); // Update UI with new review
};
```

---

## Testing API Calls

### Using cURL

```bash
# Login to get token
curl -X POST https://gql-shopping-sample.onrender.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { userLogin(email: \"user@example.com\", password: \"pass123\") { authToken } }"
  }'

# Use token in next requests
TOKEN="eyJhbGciOiJIUzI1NiI..."

curl -X POST https://gql-shopping-sample.onrender.com/graphql \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ getAllProducts(filters: {query: null}) { products { id title } } }"
  }'
```

### Using GraphQL Playground

1. Visit: https://gql-shopping-sample.onrender.com/graphql
2. Set Authorization header in bottom-left panel:
   ```json
   {
     "Authorization": "YOUR_TOKEN"
   }
   ```
3. Write queries/mutations in main editor
4. Click Play button to execute

---

## Summary Table

| Query/Mutation | Type | Auth Required | Status | Used In |
|---|---|---|---|---|
| userLogin | Mutation | ❌ No | ✅ Working | LoginPage |
| adminLogin | Mutation | ❌ No | ✅ Working | LoginPage |
| createUser | Mutation | ❌ No | ⚠️ Issue #3 | RegisterPage |
| getAllProducts | Query | ✅ Yes | ✅ Working | ProductListPage |
| searchHomeProducts | Query | ✅ Yes | ❌ Issue #1 | SearchBar |
| getProductBySlug | Query | ✅ Yes | ✅ Working | ProductDetailPage |
| getProductReviews | Query | ✅ Yes | ✅ Working | ProductDetailPage |
| addProductReview | Mutation | ✅ Yes | ❌ Issue #2 | AddReviewDialog |
