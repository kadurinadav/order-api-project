const request = require('supertest');
const assert = require('assert');
const app = require('../routes/order');
const e = require('express');
const fun = require('../helperfunc');

//************ API Tests **************/

// Create - add new order test
describe('POST /order', function() {
    it('should add order when all fields in request body are valid - status code 200', function() 
    {
      return request(app)
        .post('/order')
        .send({
            "customer_name": "Nadav kaduri",
            "phone-number": "0525673576",
            "email": "nadav@gmail.com",
            "address": "tchernichovsky 6/5, beer sheva",
            "items": ["fries","burger"]
            })
        // check status code 200
        .expect(200)
        .then(response => {
            // check that new order was added successfully to the database
            orderID = response.body["orderID"]
            orders = fun.getOrderData()
            var containsNewOrder = false
            if(orders.hasOwnProperty(orderID))
                containsNewOrder = true
            assert.equal(containsNewOrder, true)
            assert.equal(orders[orderID]["customer_name"], "Nadav kaduri")
            assert.equal(orders[orderID]["phone-number"], "0525673576")
            assert.equal(orders[orderID]["email"], "nadav@gmail.com")
            assert.equal(orders[orderID]["address"], "tchernichovsky 6/5, beer sheva")
            assert.deepStrictEqual(orders[orderID]["items"], ["fries","burger"])
        })      
    });

    it('should return an error if one or more fields are incorrect or miss - status code 400', function() 
    {
        return request(app)
        .post('/order')
        .send({
            "customer_name": "Nadav kaduri",
            "phone-number": "0525673576",
            "email": "nadavgmail.com",
            "items": ["fries","burger"]
            })
        // check status code 400
        .expect(400)     
    });
});

// Read - get order with specific id test
describe('GET /order/:id', function() 
{
    it('should return an order if valid id is passed - status code 200', function() 
    {  
        return request(app)
        .get('/order/' + `${orderID}`)
        // check status code 200
        .expect(200)
        .then(response => {
            // check that there exist an order with that order id in the database
            orders = fun.getOrderData()
            var containsID = false
            if(orders.hasOwnProperty(orderID))
            containsID = true
            assert.equal(containsID, true)
            // check that we got the correct order
            assert.equal(response.body["customer_name"], "Nadav kaduri")
            assert.equal(response.body["phone-number"], "0525673576")
            assert.equal(response.body["email"], "nadav@gmail.com")
            assert.equal(response.body["address"], "tchernichovsky 6/5, beer sheva")
            assert.deepStrictEqual(response.body["items"], ["fries","burger"])
        })
    });

    it('should return an error when valid id is passed but does not exist - status code 404', function() 
    {
        return request(app)
        .get('/order/c2bd727f-fbc3-42ac-90a5-4590556343c8s')
        // check status code 404
        .expect(404)
        .then(response => {
            // check that an order with that order id is not exist in the database
            orders = fun.getOrderData()
            var notContainsID = true
            if(orders.hasOwnProperty("c2bd727f-fbc3-42ac-90a5-4590556343c8s"))
                notContainsID = false
            assert.equal(notContainsID, true)
        })
    });
});

// Read - get all orders test
describe('GET /order', function() 
{
    it('should return all orders - status code 200', function() 
    {
        return request(app)
        .get('/order')
        // check status code 200
        .expect(200)
        .then(response => {
            orders = fun.getOrderData()
            // check that we got all orders from datebase
            assert.equal(Object.keys(orders).length, Object.keys(response.body).length)
        })
    });
});

// Read - get all orders from the last day test
describe('GET /order/filter/lastday', function() 
{
    it('should return all orders from the last day - status code 200', function() 
    {
        return request(app)
        .get('/order/filter/lastday')
        // check status code 200
        .expect(200)
        .then(response => {
            orders = fun.getOrderData()
            const currDate = fun.getDate()
            // check that all orders we got is from last day
            isCorrectDay = true
            for(order in response.body){
                if(response.body[order]["date"] != currDate){
                    isCorrectDay = false
                    break
                }
            }
            assert.equal(isCorrectDay, true)
            // check that we not missed order from last day and did not returned it
            orderCounter = 0
            for(order in orders){
                if(orders[order]["date"] == currDate)
                    orderCounter++
            }
            assert.equal(orderCounter, Object.keys(response.body).length)
        })
    });
});

// PUT - update order with specific id test
describe('PUT /order/:id', function() {
    it('should update the existing order with that id - status code 200', function() 
    {
      return request(app)
        .put('/order/' + `${orderID}`)
        .send({
            "customer_name": "Nadav kaduri",
            "phone-number": "0525673576",
            "email": "nadav@gmail.com",
            "address": "tchernichovsky 6/5, beer sheva",
            "items": ["fries","burger","lemonade"]
            })
        // check status code 200
        .expect(200)
        .then(response => {
            // check that order was updated successfully
            orders = fun.getOrderData()
            assert.equal(orders[orderID]["customer_name"], "Nadav kaduri")
            assert.equal(orders[orderID]["phone-number"], "0525673576")
            assert.equal(orders[orderID]["email"], "nadav@gmail.com")
            assert.equal(orders[orderID]["address"], "tchernichovsky 6/5, beer sheva")
            assert.equal(orders[orderID]["items"][0], "fries")
            assert.equal(orders[orderID]["items"][1], "burger")
            assert.equal(orders[orderID]["items"][2], "lemonade")

        })      
    });

    it('should return an error if one or more fields are incorrect or miss - status code 400', function() 
    {
        return request(app)
        .put('/order/' + `${orderID}`)
        .send({
            "customer_name": "Nadav kaduri",
            "phone-number": "0525673576",
            "email": "nadavgmail.com",
            "items": ["fries","burger"]
            })
        // check status code 400
        .expect(400)
        .then(response => {
            // check that order was not updated 
            orders = fun.getOrderData()
            assert.equal(orders[orderID]["customer_name"], "Nadav kaduri")
            assert.equal(orders[orderID]["phone-number"], "0525673576")
            assert.equal(orders[orderID]["email"], "nadav@gmail.com")
            assert.equal(orders[orderID]["address"], "tchernichovsky 6/5, beer sheva")
            assert.equal(orders[orderID]["items"][0], "fries")
            assert.equal(orders[orderID]["items"][1], "burger")
        })    
    });

    it('should return an error if id is not found - status code 404', function() 
    {
        return request(app)
        .put('/order/c2bd727f-fbc3-42ac-90a5-4590556343c8s')
        .send({
            "customer_name": "Nadav kaduri",
            "phone-number": "0525673576",
            "email": "nadav@gmail.com",
            "address": "tchernichovsky 6/5, beer sheva",
            "items": ["fries","burger", "lemonade"]
            })
        // check status code 404
        .expect(404)
        .then(response => {
            // check that an order with that order id is not exist in the database
            orders = fun.getOrderData()
            var notContainsID = true
            if(orders.hasOwnProperty("c2bd727f-fbc3-42ac-90a5-4590556343c8s"))
                notContainsID = false
            assert.equal(notContainsID, true)
        })   
    });
});

// Delete - delete order with specific id test
describe('DELETE /order/:id', function() {
    it('should delete requested order with that id - status code 200', function() 
    {
      return request(app)
        .delete('/order/' + `${orderID}`)
        // check status code 200
        .expect(200)
        .then(response => {
            // check that order was deleted successfully from the database
            orders = fun.getOrderData()
            var containsOrder = false
            if(orders.hasOwnProperty(orderID))
                containsNewOrder = true
            assert.equal(containsOrder, false)
        })      
    });

    it('should return an error if id is not found - status code 404', function() 
    {
        return request(app)
        .delete('/order/' + `${orderID}`)
        // check status code 404
        .expect(404)
        .then(response => {
            // check that an order with that order id is not exist in the database
            orders = fun.getOrderData()
            var notContainsID = true
            if(orders.hasOwnProperty("c2bd727f-fbc3-42ac-90a5-4590556343c8"))
                notContainsID = false
            assert.equal(notContainsID, true)
        })     
    });
});