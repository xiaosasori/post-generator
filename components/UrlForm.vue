<script setup lang="ts">
const props = defineProps<{
  url: string
  temperature: number
}>()
defineEmits(['submit'])
const form = reactive({
  url: props.url,
  temperature: props.temperature,
})
</script>

<template>
  <form class="mb-10" @submit.prevent="$emit('submit', form)">
    <div class="flex">
      <input
        v-model="form.url"
        placeholder="Full Article URL"
        class="input input-bordered w-full max-w-full rounded-r-none"
        type="text"
      />
      <button class="btn rounded-l-none">Generate Announcements</button>
    </div>
    <TemperatureSelector v-model="form.temperature" />
  </form>
</template>
