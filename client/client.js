const Amqp = require("amqplib/callback_api");
const Rx = require("rx");

class HipchatQueueClient {
  constructor({ username, password, endpoint, queue }) {
    this._connectionString = `amqp://${username}:${password}@${endpoint}`;
    this._queue = queue;
    this._messages = new Rx.Subject();
  }

  get messages() { 
    return this._messages.asObservable();
  }

  connect() {
    return new Promise((resolve,reject) => {
      
      // Connect to the AMQP server

      Amqp.connect(process.env.AMQP_CONN, (err,conn) => {
        if (err) {
          reject(err);
          return;
        }

        // Create channel to recieve incoming messages

        conn.createChannel((err, channel) => {
          if (err) {
            reject(err);
            return;
          }

          // Recieve messages into the messages observable

          channel.consume(this._queue, msg => {
            this._messages.onNext(JSON.parse(msg.content.toString()));
          }, { noAck: true }, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });
    });
  }
};

module.exports = HipchatQueueClient;