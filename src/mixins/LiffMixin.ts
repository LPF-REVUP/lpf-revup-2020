import Vue from 'vue'
import Component from 'vue-class-component'
// import { Profile } from '@line/bot-sdk'
import consola from 'consola'
import { Profile } from '@line/bot-sdk'
import { appStateStore } from '~/store'
import {
  initLiff,
  getLiffVersion,
  getOS,
  isInClient,
  liffLogin,
  isLineLoggedIn,
  getLineProfile,
  getFriendship,
  openWindow
} from '~/plugins/liff'

@Component
export default class LiffMixin extends Vue {
  public async initializeLiff(): Promise<void> {
    consola.log('initializeLiff called!')
    if (!appStateStore.liffInitialized) {
      const pageLiffId = process.env.LIFF_ID || ''
      const result = await initLiff(pageLiffId)
      if (result) {
        appStateStore.initializeLiffCompleted()
      }
    }
  }

  public async loginWithLiff() {
    if (!isLineLoggedIn()) {
      await liffLogin()
    } else {
      const profile: Profile = await getLineProfile()
      consola.log('got Profile in loginWithLiff', profile)
      appStateStore.loggedInByLineLogin(profile)
    }
  }

  canUseLiffApi(): boolean {
    let result: boolean = false
    if (appStateStore.liffInitialized && isLineLoggedIn()) {
      result = true
    }
    return result
  }

  public async loadLineProfile(): Promise<void> {
    if (this.canUseLiffApi() && !appStateStore.lineProfile) {
      // getProfile
      const profile: Profile = await getLineProfile()
      consola.log('got Profile in loadLineProfile', profile)
      appStateStore.loggedInByLineLogin(profile)
    }
  }

  public async hasFriendshipWithBot(): Promise<boolean> {
    let result = false
    if (this.canUseLiffApi()) {
      result = await getFriendship()
    }
    return result
  }

  public openWindow(url: string, external: boolean): void {
    openWindow(url, external)
  }

  public showLiffInfo(): void {
    if (appStateStore.liffInitialized) {
      consola.log('getLiffVersion', getLiffVersion())
      consola.log('getOS', getOS())
      consola.log('isInClient', isInClient())
      consola.log('isLineLoggedIn', isLineLoggedIn())
    }
  }
}