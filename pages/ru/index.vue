<template>
  <LanguageDetails :chars="chars" original-name="Русский язык" name="Russian" :image-url="imageUrl" />
</template>

<script>
export default {
  data () {
    return {
      chars: [
        {
          letter: 'а',
          name: 'а'
        },
        {
          letter: 'б',
          name: 'бэ'
        },
        {
          letter: 'в',
          name: 'вэ'
        },
        {
          letter: 'г',
          name: 'гэ'
        },
        {
          letter: 'д',
          name: 'дэ'
        },
        {
          letter: 'е',
          name: 'е'
        },
        {
          letter: 'ё',
          name: 'ё'
        },
        {
          letter: 'ж',
          name: 'же'
        },
        {
          letter: 'з',
          name: 'зэ'
        },
        {
          letter: 'и',
          name: 'и'
        },
        {
          letter: 'й',
          name: 'и краткое'
        },
        {
          letter: 'к',
          name: 'ка'
        },
        {
          letter: 'л',
          name: 'эль'
        },
        {
          letter: 'м',
          name: 'эм'
        },
        {
          letter: 'н',
          name: 'эн'
        },
        {
          letter: 'о',
          name: 'о'
        },
        {
          letter: 'п',
          name: 'пэ'
        },
        {
          letter: 'р',
          name: 'эр'
        },
        {
          letter: 'с',
          name: 'эс'
        },
        {
          letter: 'т',
          name: 'тэ'
        },
        {
          letter: 'у',
          name: 'у'
        },
        {
          letter: 'ф',
          name: 'эф'
        },
        {
          letter: 'х',
          name: 'ха'
        },
        {
          letter: 'ц',
          name: 'це'
        },
        {
          letter: 'ч',
          name: 'че'
        },
        {
          letter: 'ш',
          name: 'ша'
        },
        {
          letter: 'щ',
          name: 'ща'
        },
        {
          letter: 'ъ',
          name: 'твёрдый знак'
        },
        {
          letter: 'ы',
          name: 'ы'
        },
        {
          letter: 'ь',
          name: 'мягкий знак'
        },
        {
          letter: 'э',
          name: 'э'
        },
        {
          letter: 'ю',
          name: 'ю'
        },
        {
          letter: 'я',
          name: 'я'
        }
      ],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/1280px-Flag_of_Russia.svg.png'
    }
  }
}
</script>
