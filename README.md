post: /login

get: /logout

customer:

post: /customers/register

get: /customers/getAllProducts (minPrice, maxPrice, search, sortField, sortOrder)

get: /customers/getProduct/:id

get: /customers/getAllOrders

get: /customers/getOrder/:id

post: /customer/addCart

post: /customer/placeOrder (will still go through for eligible product)

put: /updateStatus/:id (update order's status)

admin:

post: /admins/register

get: /admins/categories

get: /admins/categories/:id

post: /admins/categories

put: /admins/categories/:id

delete: /admins/categories/:id (only with no products)

post: /admins/warehouses

get: /admins/warehouses/ (all warehouses)

get: /admins/warehouses/:id

put: /admins/warehouses/:id

delete: /admins/warehouses/:id (only with no products) (name)

post: admins/moveProducts

seller:

post: /sellers/register

post: /sellers/createProduct

put: /sellers/products/:id

delete: /sellers/products/:id

get: /getAllProducts

get: /getProduct/:id

post: /sendInbound

Category in mongodb:
const categorySchema = new mongoose.Schema({
  categoryId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  attributes: [
    {
      key: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
});

openssl genpkey -algorithm RSA -out private.key

openssl req -new -key private.key -out localhost.csr -subj "/CN=localhost"

openssl x509 -req -days 365 -in localhost.csr -signkey private.key -out certificate.crt
