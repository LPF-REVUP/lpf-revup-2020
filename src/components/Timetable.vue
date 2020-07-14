<template lang="pug">
  v-container
    v-row(no-gutters)
      v-col.mt-12(cols="1")
        v-sheet.text-right.mr-10(
          v-for="(hourLabel, index) in hourLabels"
          :key="hourLabel"
          :height="(index !== hourLabels.length - 1) ? heightByHour + 'px' : ''"
        ) {{ hourLabel }}
      v-col(
        v-for="areaid in areaIds"
        :key="areaid"
        no-gutters
      )
        timetable-colomn(
          :areaId="areaid"
          :sessions="sessions"
          :heightByHour="heightByHour"
          :from="minStartAt"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { EventSession } from '~/types'

@Component({
  components: {
    TimetableColomn: () => import('@/components/TimetableColomn.vue')
  }
})
export default class TimetableComponent extends Vue {
  @Prop({ type: Array, required: true }) readonly sessions!: Array<EventSession>

  get heightByHour() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 240
      case 'sm':
        return 240
      default:
        return 120
    }
  }

  get areaIds() {
    return ['tokyo', 'osaka', 'fukuoka']
  }

  get minStartAt() {
    return this.sessions
      .map(s => this.$moment(s.startsAt))
      .reduce((a, b) => (a.isBefore(b) ? a : b))
  }

  get hourLabels() {
    const minHour = this.minStartAt.hour()
    const max = this.sessions
      .map(s => this.$moment(s.endsAt))
      .reduce((a, b) => (a.isAfter(b) ? a : b))
    const maxHour = max.minute() ? max.hour() + 1 : max.hour()
    const ret = []
    for (let i = minHour; i <= maxHour; i++) {
      ret.push(i + ':00')
    }
    return ret
  }
}
</script>
