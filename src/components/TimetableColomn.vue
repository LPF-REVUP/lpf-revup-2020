<template lang="pug">
  v-container
    div(
      v-for="s in sessionsToShow"
      :key="s.id"
    )
      span {{ s.title }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import moment from 'moment'
import { EventSession } from '~/types'

@Component({
  components: {
    TimetableCell: () => import('@/components/TimetableCell.vue')
  }
})
export default class TimetableColomnComponent extends Vue {
  private static readonly COLORS = [
    '#2196F3',
    '#23BCD4',
    '#4CAF4F',
    '#673AB7',
    '#FD9800'
  ]

  @Prop({ type: Array, required: true }) readonly sessions!: Array<EventSession>
  @Prop({ type: String, required: true }) readonly areaId!: string
  @Prop({ type: Number, required: true }) readonly heightByHour!: number
  @Prop({ type: Object, required: true }) readonly from!: moment.Moment

  get sessionsToShow() {
    const sortedSessions = this.sessions
      .filter(s => s.area.id === this.areaId)
      .sort((a, b) => this.$moment(a.startsAt).diff(b.startsAt))
    const ret: Array<EventSession> = []
    const dummyEventSessionBase = {
      title: '',
      description: '',
      applicationPage: '',
      speakers: [],
      tags: [],
      applicantsMessage: ''
    }
    let fromIndex = this.from
    sortedSessions.forEach((s, index) => {
      this.setRandomColor(s)
      const startAt = this.$moment(s.startsAt)
      if (fromIndex.isBefore(startAt)) {
        const dummyEventSession = {
          id: index.toString(),
          area: this.area,
          startsAt: fromIndex.toDate(),
          endsAt: startAt.toDate(),
          ...dummyEventSessionBase
        }
        ret.push(dummyEventSession)
      }
      ret.push(s)
      fromIndex = this.$moment(s.endsAt)
    })
    console.log(ret)
    return ret
  }

  private setRandomColor(s: EventSession) {
    s.color =
      TimetableColomnComponent.COLORS[
        Math.floor(Math.random() * TimetableColomnComponent.COLORS.length)
      ]
  }

  get area() {
    return this.sessions.filter(s => s.area.id === this.areaId)[0].area
  }

  getSessionLength(s: EventSession) {
    const hours = this.$moment
      .duration(this.$moment(s.endsAt).diff(s.startsAt))
      .asHours()
    return hours * this.heightByHour
  }
}
</script>
