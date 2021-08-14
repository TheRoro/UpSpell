<template>
  <div class="h-screen">
    <div class="bg-purple-700 h-1/3">
      <div class="h-full container mx-auto flex flex-wrap flex-col justify-center content-center px-4">
        <h1 class="text-8xl text-white font-black text-center py-4">
          {{ originalName }}
        </h1>
        <p class="text-3xl text-white font-bold text-center py-8">
          Special Characters for {{ name }}!
        </p>
      </div>
    </div>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3">
      <div v-for="char in chars" :key="char">
        <CharCard class="charCard" :char="char" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chars: {
      type: [Array],
      required: true
    },
    originalName: {
      type: [String],
      required: true
    },
    name: {
      type: [String],
      required: true
    }
  }
}
</script>

<style scoped>

  .charCard {
    transition: all .2s ease-in-out;
  }

  .charCard:hover {
    filter: brightness(.95);
    cursor: pointer;
  }

</style>
