const amqp = require("amqplib");
const message = "con cho minhanh";
const queueName = "test-topic";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(message));

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(error, error);
  }
};

runProducer().catch((err) => console.log(err));
