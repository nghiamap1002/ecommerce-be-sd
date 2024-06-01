"use strict";

const amqp = require("amqplib");

const consumerOrderedMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "ordered-queued-message";

    channel.assertQueue(queueName, { durable: true });

    for (let i = 0; i < 10; i++) {
      const message = `ordered-queued-message::${i}`;
      console.log(message);
      channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
    }

    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    console.log(error, error);
  }
};

consumerOrderedMessage().catch((err) => console.log(err, "err"));
