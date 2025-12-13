import { orders } from "./channels/orders.ts";

orders.consume('orders',async (message) => {
  if(!message) return null;
  
  console.log(message?.content.toString());//vem como buffer
  
  orders.ack(message);

},{
  noAck: false,
})