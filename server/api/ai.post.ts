// https://platform.openai.com/docs/api-reference/chat/create
import * as agents from '@/agents'

const storage = useStorage()
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!Object.keys(agents).includes(`${body.agent}Agent`)) {
    throw new Error(`${body.agent} Agent does not exist`)
  }

  const session = await useSession(event, { password: 'asdaswarawf' })

  const key = `${session.id}:messages`
  const messages = ((await storage.getItem(key)) as Array<any>) || []
  messages.push({ role: 'user', content: body.message })

  // const data = await newclient('/v1/chat/completions', {body: {}})
  const data = await $openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [],
    temperature: body.temperature || 1,
    // @ts-expect-error checking above if agent exists
    ...agents[`${body.agent}Agent`](body),
  })

  const response = data?.data?.choices[0]?.message
  messages.push({ role: 'assistant', content: response?.content })

  await storage.setItem(key, messages)

  return response
})
