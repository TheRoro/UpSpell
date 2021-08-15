<template>
  <LanguageDetails :chars="chars" original-name="Français" name="French" />
</template>

<script>
export default {
  data () {
    return {
      chars: [
        {
          letter: 'é',
          name: 'E accent aigu'
        },
        {
          letter: 'à',
          name: 'A accent grave'
        },
        {
          letter: 'è',
          name: 'E accent grave'
        },
        {
          letter: 'ù',
          name: 'U accent grave'
        },
        {
          letter: 'â',
          name: 'A accent circonflexe'
        },
        {
          letter: 'ê',
          name: 'E accent circonflexe'
        },
        {
          letter: 'î',
          name: 'I accent circonflexe'
        },
        {
          letter: 'ô',
          name: 'O accent circonflexe'
        },
        {
          letter: 'û',
          name: 'U accent circonflexe'
        },
        {
          letter: 'ç',
          name: 'C cédille'
        }
      ]
    }
  }
}
</script>
