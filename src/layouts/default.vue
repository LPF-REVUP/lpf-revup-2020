<template lang="pug">
  v-app
    v-app-bar(fixed app flat color="white")
      v-toolbar-title.black--text
        nuxt-link(to="/") {{title}}
      v-spacer
      v-btn.black--text(text small) SPEAKERS
      v-btn.black--text(text small) SCHEDULE
      v-btn.black--text(text small) SPONSORS
      v-btn.registration-button.white-text(tile dark color="#777676") 受付/REGISTRATION
    v-content
      nuxt
    v-footer(padless)
      v-card.flex(flat tile)
        v-card-text.footer-link-area.text-center
          v-btn.footer-button.white--text(text small) 個人情報保護方針
          v-btn.footer-button.white--text(text small) LINK1
          v-btn.footer-button.white--text(text small) LINK2
          v-btn.footer-button.white--text(text small) LINK3
        v-card-text.copylight.text-center.white--text &copy; {{title}}
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  title = 'LPF REV UP 2020'
}
</script>

<style scoped>
.v-btn {
  font-size: 14px;
  font-weight: normal;
}

.registration-button {
  margin-left: 31px;
  background: rgba(0, 0, 0, 0.25);
}

.footer-link-area {
  height: 54px;
  background: rgba(0, 0, 0, 0.2);
}

.footer-button {
  margin-top: -3px;
}

.copylight {
  height: 52px;
  font-size: 14px;
  line-height: 22px;
  background: rgba(0, 0, 0, 0.32);
}
</style>
