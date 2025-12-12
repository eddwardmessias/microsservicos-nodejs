import {fastify} from 'fastify'
import { randomUUID } from 'node:crypto'
import {fastifyCors} from '@fastify/cors'
import {z} from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { channel } from '../broker/channels/index.ts'
import { schema } from '../db/schema/index.ts'
import { db } from '../db/client.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors,{origin: '*'})


app.get('/health',()=>{
  return {status: 'ok'}
})

app.post('/orders',{
  schema: {
    body: z.object({
      amount: z.coerce.number()
    })
  }
},async(request,reply )=>{
  const {amount} =  request.body

  console.log('Creating an order with amount:', amount )

  channel.orders.sendToQueue('orders', Buffer.from(JSON.stringify({amount})))


  return reply.status(201).send()
})

app.listen({host: '0.0.0.0', port: 3003}).then(() => {
  console.log('[Orders] Server is running on port 3003\nhttp://localhost:3003')
})