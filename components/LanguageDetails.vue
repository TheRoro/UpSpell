<template>
  <div class="h-screen">
    <Banner :title="originalName" :sub-title="`Special Characters for ${name.toLowerCase()}`" />
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 py-14">
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
  },
  head () {
    const name = this.name
    const originalName = this.originalName
    return {
      title: `${name} UpSpell`,
      meta: [
        { hid: 'description', name: 'description', content: `${name} | ${originalName} UpSpell - Special Characters` }
      ]
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
