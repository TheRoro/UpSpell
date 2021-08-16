<template>
  <figure class="max-w-full w-72 bg-gray-100 rounded-xl m-auto p-8 mt-14 px-2" @click="alertLang(route)">
    <img class="w-32 h-32 rounded-full mx-auto" :src="imageUrl" :alt="name" width="384" height="512">
    <div class="pt-6 space-y-4">
      <blockquote>
        <p class="text-lg font-semibold text-center">
          {{ name }}
        </p>
      </blockquote>
    </div>
  </figure>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: [String],
      required: true
    },
    name: {
      type: [String],
      required: true
    },
    route: {
      type: [String],
      required: true
    }
  },
  methods: {
    alertLang (route) {
      this.$router.push({
        path: `${route}`
      })
    }
  }
}
</script>
