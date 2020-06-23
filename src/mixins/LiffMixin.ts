import Vue from 'vue'
import Component from 'vue-class-component'
import { Action, State } from 'nuxt-property-decorator'
// import { Profile } from '@line/bot-sdk'
import consola from 'consola'
import {
  initLiff,
  getLiffVersion,
  getOS,
  isInClient,
  liffLogin
} from '~/plugins/liff'

@Component
export default class LiffMixin extends Vue {
  @Action liffInitializeCompleted: any
  @State liffInitialized!: boolean

  public async initializeLiff(): Promise<void> {
    consola.log('initializeLiff called!')
    if (this.liffInitialized === false) {
      const pageLiffId = process.env.LIFF_ID || ''
      const result = await initLiff(pageLiffId)
      if (result) {
        this.liffInitializeCompleted()
      }
    }
  }

  public async loginWithLiff() {
    await liffLogin()
  }

  public showLiffInfo() {
    if (this.liffInitialized) {
      consola.log('getLiffVersion', getLiffVersion())
      consola.log('getOS', getOS())
      consola.log('isInClient', isInClient())
    }
  }
}
