<template>
  <figure class="bg-gray-100 rounded-xl py-8 m-8 sm:m-4 md:m-8" @click="copyChar(char)">
    <div class="py-8 space-y-4">
      <blockquote class="rounded-full">
        <h1 class="text-5xl font-semibold text-center">
          {{ char }}
        </h1>
        <input id="testing-code" type="hidden" :value="char">
      </blockquote>
    </div>
  </figure>
</template>

<script>
export default {
  props: {
    char: {
      type: [String],
      required: true
    }
  },
  methods: {
    copyChar (char) {
      const elem = document.createElement('textarea')
      elem.value = char
      document.body.appendChild(elem)
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
    }
  }
}
</script>
