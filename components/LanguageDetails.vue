<template>
  <div class="h-screen">
    <div v-if="copied" class="fixed p-3 bg-yellow-300 m-2 rounded copied-card font-medium">
      Copied to clipboard
    </div>
    <Banner :title="originalName" :sub-title="`Special Characters for ${name.toLowerCase()}`" />
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 py-14">
      <div v-for="char in chars" :key="char.name">
        <CharCard class="charCard" :char="char" :copied="copied" @myEvent="copyClick" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
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
    },
    imageUrl: {
      type: [String],
      required: true
    }
  },
  data () {
    return {
      copied: false
    }
  },
  head () {
    const name = this.name
    const originalName = this.originalName
    return {
      title: `${name} UpSpell`,
      meta: [
        { hid: 'description', name: 'description', content: `${name} | ${originalName} UpSpell - Special Characters` },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content: `${name} | ${originalName} UpSpell - Special Characters`
        },
        {
          hid: 'og:image',
          property: 'og:image',
          name: 'og:image',
          content: this.imageUrl
        }
      ]
    }
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift' || e.key === 'CapsLock') {
        const modifiedArr = this.$props.chars.map((item) => {
          item.letter = this.swapCase(item.letter)
          return item
        })
        Vue.set(this.$props.chars, modifiedArr)
      }
    })
  },
  methods: {
    copyClick () {
      this.copied = !this.copied
    },
    swapCase (char) {
      if (char === char.toUpperCase()) {
        return char.toLowerCase()
      } else {
        return char.toUpperCase()
      }
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

  .copied-card {
    animation: fade 1.5s ease-in-out;
    animation-fill-mode: forwards;
    box-shadow: 0 3px #F59E0B;
  }

@keyframes fade {
    0% {
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    70% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>
