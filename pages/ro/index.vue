<template>
  <LanguageDetails :chars="chars" original-name="Română" name="Romanian" :image-url="imageUrl" />
</template>

<script>
export default {
  data () {
    return {
      chars: [
        {
          letter: 'ă',
          name: 'A căciula'
        },
        {
          letter: 'â',
          name: 'A circumflexul'
        },
        {
          letter: 'î',
          name: 'I circumflexul'
        },
        {
          letter: 'ș',
          name: 'S virgulița'
        },
        {
          letter: 'ț',
          name: 'T virgulița'
        }
      ],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/1280px-Flag_of_Romania.svg.png'
    }
  }
}
</script>
