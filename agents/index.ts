// register all training files here
// util function for creating trainings with proper typing
import type { CreateChatCompletionRequest } from 'openai'

export * from './customerSupportAgent'
export * from './facebookAgent'
export * from './twitterAgent'

// and register types here
export type Agent = 'facebook' | 'twitter' | 'customerSupport'

export default function createAgent(
  training: (
    context: Record<string, any>,
  ) => Partial<CreateChatCompletionRequest>,
) {
  return training
}
