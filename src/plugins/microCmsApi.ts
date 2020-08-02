import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import consola from 'consola'
import { Speaker, EventSession, Sponsor } from '~/types'

const myPlugin: Plugin = ({ $axios }, inject) => {
  $axios.onRequest(config => {
    config.headers.common['X-API-KEY'] = process.env.MC_API_KEY
  })
  inject('microCmsApi', new MicroCmsAPI($axios))
}
export default myPlugin

export class MicroCmsAPI {
  private readonly limit = 50

  constructor(private axios: NuxtAxiosInstance) {}

  async getSpeakers(): Promise<Array<Speaker>> {
    const response = await this.axios.get(
      `${process.env.MC_API_BASE_URL}/speakers/?limit=${this.limit}`
    )
    return response.data.contents
  }

  async getSpeaker(id: string): Promise<Speaker> {
    const response = await this.axios.get(
      `${process.env.MC_API_BASE_URL}/speakers/${id}`
    )
    return response.data
  }

  async getEventSessions(): Promise<Array<EventSession>> {
    const response = await this.axios.get(
      `${process.env.MC_API_BASE_URL}/sessions/?limit=${this.limit}`
    )
    return response.data.contents
  }

  async getEventSession(id: string): Promise<EventSession> {
    const response = await this.axios.get(
      `${process.env.MC_API_BASE_URL}/sessions/${id}`
    )
    return response.data
  }

  async getRelatedEventSessions(session: EventSession): Promise<Array<EventSession>> {
    let filters = []
    // same area 
    filters.push(`area[equals]${session.area.id}`)
    // contains same tag
    session.tags.forEach(tag => {
      filters.push(`tags[contains]${tag.id}`)
    })
    const query = 'filters=' + filters.join('[or]')
    consola.log('Related sessions query', query)
    const response = await this.axios.get(
      `${process.env.MC_API_BASE_URL}/sessions?${query}`
    )
    return (<Array<EventSession>> response.data.contents).filter(s => s.id !== session.id)
  }

  async getSponsors(): Promise<Array<Sponsor>> {
    const response = await this.axios.get(
      `${process.env.MC_API_BASE_URL}/sponsors/?limit=${this.limit}`
    )
    return response.data.contents
  }
}
