<template>
  <div class="h-screen">
    <Banner title="UpSpell" sub-title="Language Special Characters" />
    <div
      class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 py-14"
    >
      <div v-for="lang in languages" :key="lang.name">
        <LanguageCard
          class="langCard"
          :name="lang.name"
          :image-url="lang.imageUrl"
          :route="lang.route"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      languages: [
        {
          name: "Français",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Flag_of_France.png/1200px-Flag_of_France.png",
          route: "fr"
        },
        {
          name: "Español",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/1200px-Bandera_de_Espa%C3%B1a.png",
          route: "es"
        },
        {
          name: "Português",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/1280px-Flag_of_Portugal.svg.png",
          route: "pt"
        },
        {
          name: "Italiano",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1500px-Flag_of_Italy.svg.png",
          route: "it"
        },
        {
          name: "Română",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/1280px-Flag_of_Romania.svg.png",
          route: "ro"
        },
        {
          name: "Deutsch",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/1000px-Flag_of_Germany.svg.png",
          route: "de"
        },
        {
          name: "Русский язык",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/1280px-Flag_of_Russia.svg.png",
          route: "ru"
        }
      ]
    };
  }
};
</script>

<style scoped>
.langCard {
  transition: all 0.2s ease-in-out;
}

.langCard:hover {
  filter: brightness(0.95);
  cursor: pointer;
}
</style>
