import Vue from 'vue'
import Component from 'vue-class-component'
import consola from 'consola'
import axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import { EventSession, ConnpassResponse } from '~/types'

@Component
export default class ConnpassEventMixin extends Vue {
  /**
   * セッション情報にあるConnpass イベントURL からEventId を取得する
   * @param session EventSession
   */
  public getConnpassEventIdFromEventSession(session: EventSession): string {
    const url = new URL(session.applicationPage)
    const connpassEventId = url.pathname.split('/')[2]
    return connpassEventId
  }

  /**
   * セッションの申込者数を取得し、申込者メッセージに変換する
   * @param sessions 取得対象のセッション一覧
   */
  public async getEventApplicantInfo(
    sessions: Array<EventSession>
  ): Promise<Array<EventSession>> {
    consola.log('getConnpassEventInfo called!', sessions)
    try {
      // Get Connpass EventID for each EventSession
      const connpassEventIds = sessions.map(s =>
        this.getConnpassEventIdFromEventSession(s)
      )
      const connpassResponse: AxiosResponse<ConnpassResponse> = await axios.get(
        '/.netlify/functions/connpass',
        {
          params: {
            count: connpassEventIds.length,
            event_id: connpassEventIds
          },
          paramsSerializer: params =>
            qs.stringify(params, { arrayFormat: 'repeat' })
        }
      )
      consola.log('ConnpassResponse', connpassResponse)
      sessions.forEach(eventSession => {
        const connpassEventId = this.getConnpassEventIdFromEventSession(
          eventSession
        )
        const connpassEvent = connpassResponse.data.events.find(
          connpassEvent => connpassEventId === connpassEvent.event_id.toString()
        )
        if (connpassEvent) {
          const applicantCount = connpassEvent.accepted + connpassEvent.waiting
          eventSession.applicantsMessage = connpassEvent.limit
            ? applicantCount + '/' + connpassEvent.limit + '人'
            : applicantCount + '人'
        } else {
          eventSession.applicantsMessage = '取得できませんでした'
        }
      })
    } catch (error) {
      consola.error('Could not get Connpass event info', error)
      sessions.forEach(s => {
        s.applicantsMessage = '取得できませんでした'
      })
    }
    return sessions
  }
}
