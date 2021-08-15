<template>
  <figure class="max-w-full w-72 bg-gray-100 rounded-xl m-auto mt-14 py-16" @click="copyChar(char)">
    <div class="space-y-4">
      <blockquote>
        <p class="text-6xl font-semibold text-center">
          {{ char.letter }}
        </p>
      </blockquote>
    </div>
    <div class="pt-6 space-y-4">
      <blockquote>
        <p class="text-lg font-semibold text-center">
          {{ char.name }}
        </p>
      </blockquote>
    </div>
    <input id="testing-code" type="hidden" :value="char">
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
      elem.value = char.letter
      document.body.appendChild(elem)
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
    }
  }
}
</script>
