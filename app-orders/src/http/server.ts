import '@opentelemetry/auto-instrumentations-node/register'
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
import { ca } from 'zod/locales'
import { dispatchOrderCreate } from '../broker/message/order-created.ts'

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
},async (request,reply)=>{
  const {amount} =  request.body

  console.log('Creating an order with amount:', amount )

  dispatchOrderCreate({
    orderId: randomUUID(),
    amount,
    customer: {
      id: '4589eb72-a0e1-4d20-a958-7f5a71f03b4b'
    }
  })

  await db.insert(schema.orders).values({
    id: randomUUID(),
    customerId: '0ccdc0c3-5687-490b-b2c9-a1710b486f17',
    amount,
  })

  return reply.status(201).send()

})

app.listen({host: '0.0.0.0', port: 3003}).then(() => {
  console.log('[Orders] Server is running on port 3003\nhttp://localhost:3003')
})