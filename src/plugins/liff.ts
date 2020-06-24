import {
  LiffContextData,
  LIFFErrorObject,
  scanCodeResult,
  Friendship
} from 'liff-type'
import { Profile } from '@line/bot-sdk'
import consola from 'consola'
import { LiffError } from '@/types'

export function initLiff(pageLiffId: string): Promise<boolean> {
  return new Promise(resolve => {
    window.liff
      .init({ liffId: pageLiffId })
      .then(() => {
        consola.log('LIFF initialized!')
        resolve(true)
      })
      .catch((error: LIFFErrorObject) => {
        consola.warn('LIFF initialization failed', error)
        resolve(false)
      })
  })
}

export function getLineProfile(): Promise<Profile> {
  return new Promise(resolve => {
    window.liff
      .getProfile()
      .then((profile: Profile) => {
        consola.log('liff.getProfile success!')
        resolve(profile)
      })
      .catch((error: LIFFErrorObject) => {
        consola.warn('liff.getProfile failed', error)
        throw new LiffError(error.code, error.message)
      })
  })
}

export function getFriendship(): Promise<boolean> {
  return new Promise(resolve => {
    window.liff
      .getFriendship()
      .then((friendship: Friendship) => {
        consola.log('liff.getFriendship success!', friendship)
        resolve(friendship.friendFlag)
      })
      .catch((error: LIFFErrorObject) => {
        consola.warn('liff.getFriendship failed', error)
        throw new LiffError(error.code, error.message)
      })
  })
}

export function getOS(): string {
  return window.liff.getOS()
}

export function getLiffLanguage(): string {
  return window.liff.getLanguage()
}

export function getLiffVersion(): string {
  return window.liff.getVersion()
}

export function isInClient(): boolean {
  return window.liff.isInClient()
}

export function isLineLoggedIn(): boolean {
  return window.liff.isLoggedIn()
}

export function isLiffApiAvailable(apiName: string): boolean {
  return window.liff.isApiAvailable(apiName)
}

export function getLiffAccessToken(): string {
  return window.liff.getAccessToken()
}

export function getLiffContext(): LiffContextData {
  return window.liff.getContext()
}

export function liffLogin(redirectUri?: string) {
  return window.liff.login({
    redirectUri
  })
}

export function liffLogout() {
  return window.liff.logout()
}

export function openWindow(url: string, external?: boolean) {
  return window.liff.openWindow({
    url,
    external
  })
}

export function sendMessage() {
  window.liff
    .sendMessages([
      {
        type: 'text',
        text: 'Hello, World!'
      }
    ])
    .then(() => {
      consola.log('message sent')
    })
    .catch((error: LIFFErrorObject) => {
      consola.log('error', error)
    })
}

export function scanCode(): Promise<string | null> {
  return new Promise(resolve => {
    if (window.liff.scanCode) {
      window.liff.scanCode().then((value: scanCodeResult) => {
        consola.log('Scanned text', value)
        resolve(value.value)
      })
    } else {
      resolve(null)
    }
  })
}

export function shareTargetPicker(): Promise<boolean> {
  return new Promise(resolve => {
    window.liff
      .shareTargetPicker([
        {
          type: 'text',
          text: 'Hello, World! from shareTargetPicker'
        }
      ])
      .then(() => {
        consola.log('ShareTargetPicker was launched')
        resolve(true)
      })
      .catch((error: LIFFErrorObject) => {
        consola.warn('Failed to launch ShareTargetPicker', error)
        resolve(false)
      })
  })
}
