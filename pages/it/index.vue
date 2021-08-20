<template>
  <LanguageDetails :chars="chars" original-name="Italiano" name="Italian" :image-url="imageUrl" />
</template>

<script>
export default {
  data () {
    return {
      chars: [
        {
          letter: 'à',
          name: 'A accento grave'
        },
        {
          letter: 'è',
          name: 'E accento grave'
        },
        {
          letter: 'ì',
          name: 'I accento grave'
        },
        {
          letter: 'ò',
          name: 'O accento grave'
        },
        {
          letter: 'ù',
          name: 'U accento grave'
        },
        {
          letter: 'é',
          name: 'E accento acuto'
        }
      ],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1500px-Flag_of_Italy.svg.png'
    }
  }
}
</script>
