<template>
  <LanguageDetails :chars="chars" original-name="Deutsch" name="German" :image-url="imageUrl" />
</template>

<script>
export default {
  data () {
    return {
      chars: [
        {
          letter: 'ä',
          name: 'A umlaut'
        },
        {
          letter: 'ö',
          name: 'O umlaut'
        },
        {
          letter: 'ü',
          name: 'U umlaut'
        },
        {
          letter: 'ß',
          name: 'Eszett/Scharfes S'
        }
      ],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/1000px-Flag_of_Germany.svg.png'
    }
  }
}
</script>
