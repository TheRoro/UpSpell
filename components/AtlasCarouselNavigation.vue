<template>
  <AtlasNavigation
    :back-label="previous.label"
    :back-to="previous.to"
    :forward-label="next.label"
    :forward-to="next.to"
    :label="`${currentLabel} carousel navigation`"
  />
</template>

<script setup lang="ts">
import type { PrimaryNavigationSection } from '~/data/primaryNavigation'
import {
  getAdjacentPrimaryNavigation,
  primaryNavigationItems,
} from '~/data/primaryNavigation'

const props = defineProps<{
  currentSection: PrimaryNavigationSection
}>()

const currentLabel = primaryNavigationItems.find(
  item => item.section === props.currentSection,
)?.label ?? props.currentSection
const { previous, next } = getAdjacentPrimaryNavigation(props.currentSection)
</script>
