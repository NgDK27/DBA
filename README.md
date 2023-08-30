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

Category in mongodb: {

    {"_id":{"$oid":"64e32957735672ab7fd0a678"},"id":{"$numberInt":"1"},"name":"Clothes","__v":{"$numberInt":"0"}},

    {"_id":{"$oid":"64e32957735672ab7fd0a67a"},"id":{"$numberInt":"2"},"name":"Food","__v":{"$numberInt":"0"}},

    {"_id":{"$oid":"64e32a9e2e4e5ec65f8d0901"},"id":{"$numberInt":"3"},"name":"Books","__v":{"$numberInt":"0"}},

    {"_id":{"$oid":"64e3246b573a79dc4a2b8786"},"id":{"$numberInt":"4"},"name":"Electronics","__v":{"$numberInt":"0"}},

}

4 categories rn: 1:clothes, 2:food, 3:books, 4:electronics

openssl genpkey -algorithm RSA -out private.key
openssl req -new -key private.key -out localhost.csr -subj "/CN=localhost"
