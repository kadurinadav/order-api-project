# Order Manager REST API

REST API for Yammie restaurant order management.

## Run the app

node server.js

## Run the tests

npm test

## API

#### /order
* `GET` : Get all orders

* `POST` : Create a new order

example of json order object to send in body of request (all fields required):

```{json}
{
    "customer_name": "Nadav kaduri",
    "phone-number": "0525673576", 
    "email": "nadav@gmail.com", 
    "address": "tchernichovsky 6/5, beer sheva", 
    "items": ["fries","burger","steak","lemonade"] 
}
```

#### /orders/:id
* `GET` : Get an order with specific id

* `PUT` : Update an order with specific id

example of json order object to send in body of request (all fields required):

```{json}
{
    "customer_name": "Nadav kaduri",
    "phone-number": "0525673576", 
    "email": "nadav@gmail.com", 
    "address": "tchernichovsky 6/5, beer sheva", 
    "items": ["fries","burger","steak","orange-juice"] 
}
```

* `DELETE` : Delete an order with specific id

#### /order/filter/lastday
* `GET` : Get all orders from the last day

