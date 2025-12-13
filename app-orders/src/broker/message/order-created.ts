import  type { OrderCreatedMessage } from '../../../../contracts/messages/order-created-message.js';
import { channel } from "../channels/index.ts";

export function dispatchOrderCreate(data: OrderCreatedMessage) {

  channel.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)))
 
}