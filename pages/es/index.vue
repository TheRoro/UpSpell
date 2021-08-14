<template>
  <LanguageDetails :chars="chars" original-name="Español" name="spanish" />
</template>

<script>
export default {
  data () {
    return {
      chars: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ']
    }
  }
}
</script>
