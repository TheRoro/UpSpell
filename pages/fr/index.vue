<template>
  <LanguageDetails :chars="chars" original-name="Français" name="french" />
</template>

<script>
export default {
  data () {
    return {
      chars: ['é', 'à', 'è', 'ù', 'â', 'ê', 'î', 'ô', 'û', 'ç']
    }
  }
}
</script>
