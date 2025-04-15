The application will start by default on http://localhost:3000.
API Endpoints
Hardcoded OTP: For demonstration purposes, the OTP sent for both login and signup is hardcoded as 1234.

Authentication (/auth)

Handles user registration/login initiation and OTP verification to get a JWT.
Signup (POST /auth/signup)
Body: { "phone_number": "...", "first_name": "...", "last_name": "..." }
Response (200 OK): { "message": "User created. OTP sent..." }
Response (409 Conflict): If phone number exists.

Login (POST /auth/login)
Body: { "phone_number": "..." }
Response (200 OK): { "message": "OTP sent..." }
Response (404 Not Found): If user doesn't exist or is inactive.

Verify OTP (POST /auth/verify-otp)
Body: { "phone_number": "...", "otp": "1234" }
Response (200 OK): { "message": "...", "user": {...}, "token": "JWT_TOKEN" }
Response (401 Unauthorized): If OTP is invalid.
Response (404 Not Found): If user not found.


Products (/products)
Requires Authorization: Bearer <JWT_TOKEN> header for all endpoints.

Create Product (POST /products)
Body: { "name": "...", "detail": "...", "category": "...", "section": "..." }
Response (201 Created): Created product object.

Get All Products (GET /products)
Response (200 OK): Array of product objects.

Get Product by ID (GET /products/:id)
Response (200 OK): Single product object.
Response (400 Bad Request): Invalid ID format.
Response (404 Not Found): Product not found.

Get Products by Category (GET /products/category/:categoryName)
Response (200 OK): Object with sections as keys and arrays of products as values. Example: { "SectionA": [...], "SectionB": [...] }

Update Product (PATCH /products/:id)
Body: { "field_to_update": "new_value", ... }
Response (200 OK): Updated product object.
Response (400/404): Invalid ID or product not found.

Delete Product (DELETE /products/:id)
Response (200 OK): { "message": "Product ... deleted" }
Response (400/404): Invalid ID or product not found.

