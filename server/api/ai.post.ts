// https://platform.openai.com/docs/api-reference/chat/create

const storage = useStorage()
export default defineEventHandler(async (event) => {
  const { message } = await readBody(event)
  const session = await useSession(event, { password: 'asdaswarawf' })

  const key = `${session.id}:messages`
  const messages = ((await storage.getItem(key)) as Array<any>) || []

  // const data = await newclient('/v1/chat/completions', {body: {}})
  const data = await $openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant for an AI-powered social media image generator.',
      },
      {
        role: 'user',
        content: message,
      },
    ],
  })

  const response = data?.data?.choices[0]?.message
  messages.push({ role: 'assistant', content: response?.content })

  await storage.setItem(key, messages)

  return response
})
