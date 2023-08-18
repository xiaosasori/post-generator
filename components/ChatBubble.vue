<script setup lang="ts">
// @ts-expect-error no types for markdownit
import Markdown from 'vue3-markdown-it'
import type { Message, User } from '@/types'

defineProps<{
  user?: User
  message?: Message
  myMessage?: boolean
}>()
</script>

<template>
  <div
    class="chat"
    :class="{
      'chat-end': myMessage,
      'chat-start': !myMessage,
    }"
  >
    <div class="avatar chat-image">
      <div class="w-10 rounded-full">
        <img :src="user?.avatar" alt="avatar" />
      </div>
    </div>
    <div class="chat-header mb-2">
      <strong>{{ user?.name }}</strong>
      &nbsp;
      <time v-if="message" class="text-xs opacity-50">{{
        useTimeAgo(message?.createdAt)
      }}</time>
    </div>
    <div
      class="chat-bubble prose prose-sm w-full max-w-max bg-white py-0 dark:bg-gray-900"
      :class="{
        'bg-gray-600 text-white dark:bg-gray-700 dark:text-inherit': myMessage,
      }"
    >
      <slot>
        <Markdown :source="message?.text" class="w-full" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
:deep(code) {
  background: none;
  @apply w-full overflow-x-auto;
}
:deep(pre) {
  @apply w-full overflow-x-auto dark:bg-[rgba(0,0,0,.3)];
}
</style>
