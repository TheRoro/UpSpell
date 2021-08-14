<template>
  <div class="bg-blue-500 sm:py-24 sm:px-8 py-14 px-2">
    <div class="h-full container mx-auto flex flex-wrap flex-col justify-center content-center px-4">
      <h1 class="sm:text-8xl text-6xl text-white font-black text-center py-4">
        {{ title }}
      </h1>
      <p class="sm:text-3xl text-xl text-white font-bold text-center py-8">
        {{ subTitle }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: [String],
      required: true
    },
    subTitle: {
      type: [String],
      required: true
    }
  }
}
</script>
