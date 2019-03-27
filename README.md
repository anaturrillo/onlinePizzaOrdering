# Node.js Master Class Homework Assignment #2

## API documentation:


### Flow
To run the API you need to add a config.js file in the app folder. 
In this file you need to export an object with to folowing structure (if you want, populated according to the environment the app is running in):
```
{
  port: [PORT],
  hashingSecret: [HASH SECRET],
  adminToken: [An admin token],
  paymentApiKey: [payment tool api key],
  mailDomain: [mailing tool domain],
  mailApiKey: [mailing tool api key]
}

```

The intended api flow is as follows:
As an admin (you will need an admin token):
- Create menu items

As a user:
1) create User
2) log user (you'll be given a token)
3) create cart (cart will be create with user email, only one cart is allowed per user)
4) add items to cart.
5) make the order (user will be charged and will receive an email with details of his ordering)

### Services:

```POST /user ```
Creates a user.
Required fields: 
- __body:__ name, email, address, password

```GET /user?email=[user email] ```
Returns the requested user.
Required fields:
- __headers:__ token [admin or user token]
- __query:__ email

```PUT /user ```
Edits user fields.
Required fields: 
- __headers:__ token [admin or user token]
- __body:__ email, one of: name, address, password

```DELETE /user?email=[user email] ```
Remove selected user.
Required fields:
- __headers:__ token [admin or user token]
- __query:__ email

```GET /users ```
Lits all users.
Required fields:
- __headers:__ token [admin]

```POST /token ``` || ```POST /login ```
Creates a session, returns user token. 
Required fields:
- __body:__ email
- __body:__ password


```DELETE /token ``` || ```POST /logout ```
Creates a session, returns user token. 
Required fields:
- __query:__ email
- __headers:__ token [admin or user token]

```POST /menuItem ```
Creates a menu item.
Required fields:
- __headers:__ token [admin]
- __body:__ name
- __body:__ price
- __body:__ description

```PUT /menuItem ```
Edits a menu item.
Required fields:
- __headers:__ token [admin]
- __body:__ one of: name, price, description 
- __query:__ id [item id to edit]

```GET /menuItem ```
Retrieves a menu item.
Required fields:
- __headers:__ token [admin or user token]
- __body:__ one of: name, price, description 
- __query:__ id [item id to edit]
- __query:__ email [user email if is not admin]

```GET /menuItems ```
Lists all menu items.
Required fields:
- __headers:__ token [admin or user token]
- __query:__ email [user email if is not admin]

```DELETE /menuItem ```
Edits a menu item.
Required fields:
- __headers:__ token [admin]
- __query:__ id [item id to remove]


```POST /cart ```
Creates a new cart. Only one cart is allowed per user.
Required fields:
- __headers:__ token [user]
- __body:__ email

```GET /cart ```
Retrieves a cart. Cart id will match user email.
Required fields:
- __headers:__ token [user]
- __query:__ email

```PUT /cart/add ```
Adds an item to the user's cart.
Required fields:
- __headers:__ token [user]
- __body:__ email
- __body:__ item.itemId
- __body:__ item.amount

```PUT /cart/remove ```
Removes an item from user's cart.
Required fields:
- __headers:__ token [user]
- __body:__ email
- __body:__ id [cart's item id]

```DELETE /cart ```
Removes user's cart.
Required fields:
- __headers:__ token [user]
- __query:__ email

```POST /payment ```
Process cart payment.
Required fields:
- __headers:__ token [user]
- __headers:__ payment_token [token created with payment processing tool]
- __body:__ email
