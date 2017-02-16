# Hipchat Web Queue

This package is designed to create a simple tunnel for hipchat messages from a publicly exposed server which can be subscribed to by an internal server. It acts as an HTTP server which will accept POST requests from from a hipchat web hook, and will pipe those into a RabbitMq exchange.

## Setup

* Set up a rabbitMq server, and (with proper secutity settings in place) expose its port publicly
* Set up a rabbitMq exchange called "hipchat_messages" and a user with write access to that exchange
* Set up a server to act as the public HTTP server (can be the same one as the rabbitMq server) with node.js installed
* Clone this repository and run app.js with environment variable AMQP_CONN set to an amqp connection URL (I.E. "amqp://user:pass@my.rabbitmq.server")
* You're good to go! I reccomend using PM2 to manage the node.js process and environment variables for the server

## Usage

* Add a hipchat "BYO" addon and list your server with path /message/:routingKey (I.E. http://my.http.server/message/sample) for the POST url.
* Add a rabbitMq queue, and bind it to the "hipchat_messages" exchange with the routing key set as the routing key used above.
* Add a rabbitMq user with read access to that queue
* Install and use the node.js client library below

## Client

Installation:
```
npm install hipchat-webqueue-client --save
```

Usage:

```javascript
const HipchatQueueClient = require("hipchat-webqueue-client");

const queue = new HipchatQueueClient({ username: "user", password: "password", endpoint: "my.rabbitmq.server", queue: "sample" });

queue.messages.subscribe(msg => console.log(msg));

queue.connect().then(() => console.log("Connected"));
```

Construct the client with an object with the following properties:
* username: RabbitMq username with read access to the queue
* password: RabbitMq password
* endpoint: RabbitMq domain name
* queue: RabbitMq queue to read from

The messages property exposes an Rx Observable which can be subscribed to to recieve messages. No actual messages will be recieved until connect() is called. The connect() method returns a promise which resolves once the queue has been sucessfully subscribed to.
