## Server
For details on the server, see https://github.com/edamtoft/HipchatWebQueue/

## Node.js Client

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
