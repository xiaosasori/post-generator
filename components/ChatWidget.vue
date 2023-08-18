<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { Message, User } from '~~/types'

const me = ref<User>({
  id: 'user',
  avatar: '/avatar.jpg',
  name: 'You',
})
const bot = ref<User>({
  id: 'assistant',
  avatar: '/bot.jpg',
  name: 'Botman',
})

const users = computed(() => [me.value, bot.value])

const messages = useSessionStorage<Message[]>('messages', [])

const usersTyping = ref<User[]>([])

const messagesForAPI = computed(() =>
  messages.value.map((m) => ({
    role: m.userId,
    content: m.text,
  })),
)

const { chat } = useChatAi({ agent: 'customerSupport' })
async function handleNewMessage(message: Message) {
  try {
    messages.value.push(message)
    usersTyping.value.push(bot.value)
    // const res = await fetchWithTimeout('/api/ai', {
    //   method: 'POST',
    //   body: { message: message.text },
    // })
    const res = await chat({ messages: messagesForAPI.value })
    if (!res || !res.choices[0].message?.content) return
    messages.value.push({
      id: nanoid(),
      createdAt: new Date(),
      text: res.choices[0].message?.content,
      userId: 'assistant',
    })
  } catch (err) {
    messages.value.push({
      id: nanoid(),
      createdAt: new Date(),
      text: 'There was a problem and I could not come up with a response',
      userId: 'assistant',
    })
  }
  usersTyping.value = []
}
</script>

<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    :users-typing="usersTyping"
    @new-message="handleNewMessage"
  />
</template>
