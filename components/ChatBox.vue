<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { Message, User } from '@/types'

const props = withDefaults(
  defineProps<{
    messages: Message[]
    users: User[]
    me: User
    usersTyping?: User[]
  }>(),
  {
    usersTyping: () => [],
  },
)

const emit = defineEmits<{
  (e: 'newMessage', payload: Message): void
}>()

const textMessage = ref('')
function sendMessage() {
  emit('newMessage', {
    id: nanoid(),
    userId: props.me.id,
    createdAt: new Date(),
    text: textMessage.value,
  })
  textMessage.value = ''
}

const isOpen = ref(false)

function getUser(id: string) {
  return props.users.find((user) => user.id === id)
}

const messageBox = ref<HTMLElement>()
watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    if (messageBox.value)
      messageBox.value.scrollTop = messageBox.value.scrollHeight
  },
)
</script>

<template>
  <div class="fixed bottom-[10px] right-[10px]">
    <button
      v-show="!isOpen"
      class="rounded bg-blue-500 p-3"
      @click="isOpen = true"
    >
      <IconChat class="h-8 w-8 text-white" />
    </button>
    <div
      v-if="isOpen"
      class="box w-[450px] overflow-hidden rounded bg-gray-300 dark:bg-gray-800"
    >
      <header
        class="flex items-center justify-between bg-gray-200 px-4 dark:bg-gray-900"
      >
        Customer Support Chat
        <button class="p-4 pr-0" @click="isOpen = false">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </header>
      <!-- messages -->
      <div ref="messageBox" class="messages max-h-[80vh] overflow-y-scroll p-4">
        <ChatBubble
          v-for="message in messages"
          :key="message.id"
          :user="getUser(message.userId)"
          :message="message"
          :my-message="message.userId === me.id"
        />

        <ChatBubble v-for="user in usersTyping" :key="user.id" :user="user">
          <AppLoading />
        </ChatBubble>
      </div>
      <footer class="p-2">
        <input
          v-model="textMessage"
          type="text"
          class="input block w-full px-2"
          placeholder="Type your message"
          @keypress.enter.exact.prevent="sendMessage"
        />
        <div class="h-6 px-2 py-1 text-sm italic">
          <span v-if="usersTyping.length">
            {{ usersTyping.map((user) => user.name).join(' and ') }}
            {{ usersTyping.length === 1 ? 'is' : 'are' }} typing
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>
