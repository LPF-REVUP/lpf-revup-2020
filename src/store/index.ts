import { MutationTree, ActionTree } from 'vuex'
import { Profile } from '@line/bot-sdk'
import { RootState } from '~/types'

export const state = (): RootState => ({
  liffInitialized: false,
  errorMessage: ''
})

export const mutations: MutationTree<RootState> = {
  setLiffInitialized(state: RootState, flag: boolean): void {
    state.liffInitialized = flag
  },
  setLineProfile(state: RootState, profile: Profile): void {
    if (profile) state.lineProfile = profile
  },
  setErrorMessage(state: RootState, message: string): void {
    state.errorMessage = message
  }
}

export const actions: ActionTree<RootState, RootState> = {
  liffInitializeCompleted: ({ commit }) => {
    commit('setLiffInitialized', true)
  },
  loggedInByLineLogin: ({ commit }, profile: Profile) => {
    commit('setLineProfile', profile)
  },
  showErrorMessage: ({ commit }, message: string) => {
    commit('setErrorMessage', message)
  },
  resetMessage: ({ commit }) => {
    commit('setErrorMessage', '')
  }
}
