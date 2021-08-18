<template>
  <LanguageDetails :chars="chars" original-name="Español" name="Spanish" :image-url="imageUrl" />
</template>

<script>
export default {
  data () {
    return {
      chars: [
        {
          letter: 'á',
          name: 'A con tilde aguda'
        },
        {
          letter: 'é',
          name: 'E con tilde aguda'
        },
        {
          letter: 'í',
          name: 'I con tilde aguda'
        },
        {
          letter: 'ó',
          name: 'O con tilde aguda'
        },
        {
          letter: 'ú',
          name: 'U con tilde aguda'
        },
        {
          letter: 'ü',
          name: 'U con diéresis'
        },
        {
          letter: 'ñ',
          name: 'Eñe'
        }
      ],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/1200px-Bandera_de_Espa%C3%B1a.png'
    }
  }
}
</script>
