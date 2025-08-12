# Picasso's Gallery
An e-commerce platform for art enthusiasts to discover and purchase authentic paintings.
The platform bridges the gap between art lovers and genuine products through a seamless browsing, ordering, and checkout experience.

## Demo Link
[Live Demo](https://ecommerce-frontend-steel-two.vercel.app/)

## Quick Start 
```
git clone https://github.com/Suryansh764/ecommerce-frontend.git
cd ecommerce-frontend
npm install
npm run dev
```

## Technologies 
- React.js
- React Router
- Node.js
- Express
- MongoDB
- Postman (API Testing)

## Demo Video
Watch a quick 5-minute walkthrough of Picasso’s Gallery:<br>
[Loom Video Link](https://www.loom.com/share/1ccb03699319452e8993cc7f10079cf3?sid=143ca010-9330-4a6f-92be-f58a62bdcf07)

## Features

### NavBar

- Brand logo, search bar, profile, wishlist, and cart icons.
- Clicking on a category card navigates to its specific product section.

### HomePage

- Category cards with clickable navigation.
- Hero image showcasing featured art.
- Two “Coming Soon” sections for future expansion.
- Browse All Collection button to view the full product listing.

### CategorySpecificPage

- Products displayed as well-aligned cards.
- Sort by price or alphabetical order.
- Minimum stock slider filter.
- “View Details” button for each product.

### ProductListingPage

- Complete product list with filter and sort options (category, price, name, stock).
- Wishlist button on each card.
- Clicking a card opens the product’s detailed page.

### ProductDetailsPage

- Displays name, artist, category, price, stock, material, size, tags, and description.
- Buy Now and Add to Wishlist buttons.

### WishlistPage

- Lists all wishlisted products.
- Add to cart or remove from wishlist.

### CartPage

- Product quantity update, delete, or move to wishlist.

- Shipping address selection (fetched from backend) or add new address form.

- Payment method selection, item summary, and order confirmation.

- “Proceed to Checkout” button.

### ProfilePage

- Dynamic user details.

- Quick navigation to wishlist and orders.

- Saved addresses section with edit/delete functionality.

### OrdersPage

- Lists past orders with ID, timestamp, payment, shipping, and summary.

- Clicking an order opens detailed product info.

## API References 

### POST /api/products
Post a product <br>
Body: <br>
```
{
  "title": "Mona Lisa",
  "description": "Famous painting",
  "price": 1000,
  "image": "https://example.com/image.jpg",
  "artist": "Leonardo da Vinci",
  "dimensions": "77 cm × 53 cm",
  "material": "Oil on poplar",
  "category": "64f1ab23456789abcd123456",
  "stock": 5,
  "tags": ["classic", "museum"]
}
```

### GET /api/products

Query params:<br>

category (optional, ObjectId) — filter products by category.<br>

Response:
```
{
  "data": {
    "products": [
      { "_id": "...", "title": "..." }
    ]
  }
}
```
### GET /api/products/:productId
Get Product by ID<br>
Response:
```
{
  "data": {
    "product": { "_id": "...", "title": "..." }
  }
}
```

### POST /api/categories
Create Category<br>
Body:
```
{
  "name": "Abstract",
  "description": "Abstract art category"
}
```

### GET /api/categories
Get All Categories

### GET /api/categories/:categoryId
Get Category by ID

### POST /api/addresses
Add Addresses (Bulk)<br>
Body:
```
{
  "addresses": [
    {
      "user": "64f1ab23456789abcd123456",
      "street": "123 Main St",
      "city": "Paris",
      "country": "France"
    }
  ]
}
```

### PUT /api/users/:userId/address
Replaces user's full address list.
### DELETE /api/users/:userId/address/:addressId
Delete Address
### POST /api/users
Create Users (Bulk)<br>
Body:
```
[
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

### GET /api/users/:userId
Returns user with wishlist and addresses populated.

### POST /api/wishlist
Add to Wishlist<br>
Body:
```
{
  "userId": "64f1ab23456789abcd123456",
  "productId": "64f1bc3456789abcd123457"
}
```
### GET /api/wishlist/:userId
Get Wishlist

### POST /api/wishlist/remove
Remove from Wishlist

### GET /api/cart/:userId
Get Cart

### POST /api/cart/update
Updates or adds a product with a specific quantity.

### POST /api/cart/remove
Remove Cart Item
### GET /api/orders/:userId
Get Orders for User
### POST /api/orders
Place Order<br>
Body:
```
{
  "user": "64f1ab23456789abcd123456",
  "shippingAddress": "64f1cd23456789abcd123458",
  "paymentMethod": "Paid",
  "items": [
    { "product": "64f1bc3456789abcd123457", "quantity": 2 }
  ]
}
```

## Contact 
For bugs or feature requests, please reach out to: kontact2suryanshsks@gmail.com





