import { Configuration, OpenAIApi } from 'openai'

const config = useRuntimeConfig()

const openAiConfig = new Configuration({
  apiKey: config.openaiApiKey,
})

export const $openai = new OpenAIApi(openAiConfig)

export const newclient = $fetch.create({
  method: 'POST',
  baseURL: 'https://api.openai.com',
  headers: {
    Authorization: `Bearer ${config.openaiApiKey}`,
  },
})
