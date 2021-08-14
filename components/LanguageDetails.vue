<template>
  <div class="h-screen">
    <Banner :title="originalName" :sub-title="`Special Characters for ${name}`" />
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4 mx-20 my-10">
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
