<template>
  <div class="h-screen">
    <div class="bg-purple-700 h-1/3">
      <div class="h-full container mx-auto flex flex-wrap flex-col justify-center content-center px-4">
        <h1 class="text-8xl text-white font-black text-center py-4">
          UpSpell
        </h1>
        <p class="text-3xl text-white font-bold text-center py-8">
          Special Characters for all languages!
        </p>
      </div>
    </div>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3">
      <div v-for="lang in languages" :key="lang.name">
        <LanguageCard class="langCard" :name="lang.name" :image-url="lang.imageUrl" :route="lang.route" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      languages: [
        { name: 'Français', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Flag_of_France.png/1200px-Flag_of_France.png', route: 'fr' },
        { name: 'Español', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/1200px-Bandera_de_Espa%C3%B1a.png', route: 'es' },
        { name: 'Português', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg', route: 'pt' }
      ]
    }
  }
}
</script>

<style scoped >
  h1 {
    font-family: 'Lato', sans-serif;
  }

  .langCard {
    transition: all .2s ease-in-out;
  }

  .langCard:hover {
    filter: brightness(.95);
    cursor: pointer;
  }
</style>
