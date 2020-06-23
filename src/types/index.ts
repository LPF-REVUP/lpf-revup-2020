import { Profile } from '@line/bot-sdk'
export * from './types'

export interface RootState {
  lineProfile?: Profile
  liffInitialized: boolean
  errorMessage: string
}
