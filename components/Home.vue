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
      <LanguageCard name="French" image-url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Flag_of_France.png/1200px-Flag_of_France.png" />
      <LanguageCard name="Spanish" image-url="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/1200px-Bandera_de_Espa%C3%B1a.png" />
      <LanguageCard />
      <LanguageCard />
      <LanguageCard />
      <LanguageCard />
    </div>
    <div class="container mx-auto">
      biti
    </div>
    <h1 class="font-bold bg-blue-100">
      ÀÂÉÈÊËÎÏÔÙÛÜÇçüûùôïîëêèéâà
    </h1>
  </div>
</template>

<style scoped>
  h1 {
    font-family: 'Lato', sans-serif;
  }
</style>
