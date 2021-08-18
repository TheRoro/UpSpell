<template>
  <LanguageDetails :chars="chars" original-name="Português" name="Portuguese" :image-url="imageUrl" />
</template>

<script>
export default {
  data () {
    return {
      chars: [
        {
          letter: 'á',
          name: 'A acento agudo'
        },
        {
          letter: 'é',
          name: 'E acento agudo'
        },
        {
          letter: 'í',
          name: 'I acento agudo'
        },
        {
          letter: 'ó',
          name: 'O acento agudo'
        },
        {
          letter: 'ú',
          name: 'U acento agudo'
        },
        {
          letter: 'à',
          name: 'A acento grave'
        },
        {
          letter: 'è',
          name: 'E acento grave'
        },
        {
          letter: 'ì',
          name: 'I acento grave'
        },
        {
          letter: 'ò',
          name: 'O acento grave'
        },
        {
          letter: 'ù',
          name: 'U acento grave'
        },
        {
          letter: 'ã',
          name: 'A til'
        },
        {
          letter: 'õ',
          name: 'O til'
        },
        {
          letter: 'â',
          name: 'A acento circunflexo'
        },
        {
          letter: 'ê',
          name: 'E acento circunflexo'
        },
        {
          letter: 'ô',
          name: 'O acento circunflexo'
        },
        {
          letter: 'ç',
          name: 'Cedilha'
        }
      ],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/1280px-Flag_of_Portugal.svg.png'
    }
  }
}
</script>
