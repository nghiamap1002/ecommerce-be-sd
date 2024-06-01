const amqp = require("amqplib");

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const notiExchange = "notificationEx";
    const notiQueue = "notificationQueueProcess";

    const notiExchangeDLX = "notificationExDLX";
    const notiExchangeRoutingKeyDLX = "notiExchangeRoutingKeyDLX";

    await channel.assertExchange(notiExchange, "direct", { durable: true });

    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // allow all connect to this queue
      deadLetterExchange: notiExchangeDLX,
      deadLetterRoutingKey: notiExchangeRoutingKeyDLX,
    });

    await channel.bindQueue(queueResult.queue, notiExchange);

    const msg = "a new product";
    console.log(`product msg:: `, msg);

    channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "1000",
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(error, error);
  }
};

runProducer().catch((err) => console.log(err));
