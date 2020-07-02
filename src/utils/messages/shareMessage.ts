import { FlexMessage, FlexBubble, FlexBox, FlexText } from '@line/bot-sdk'
import * as lodash from 'lodash'
const _ = lodash

function generateShareMessage(message: string): FlexMessage {
  const bubble = _.cloneDeep(messageBubble)
  const box: FlexBox = bubble.body!.contents[1] as FlexBox
  const text: FlexText = box.contents[0] as FlexText
  text.text! = message
  return {
    type: 'flex',
    altText: 'LPF REV UP 2020',
    contents: bubble
  }
}

const messageBubble: FlexBubble = {
  type: 'bubble',
  hero: {
    type: 'image',
    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
    size: 'full',
    aspectRatio: '20:13',
    aspectMode: 'cover'
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'LPF REV UP 2020',
        weight: 'bold',
        size: 'xl'
      },
      {
        type: 'box',
        layout: 'vertical',
        margin: 'lg',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text:
              '(仮)新しいプラットフォームの登場による人々の生活の劇的な変化、 そしてそれを実現する開発者が活躍できる世界の到来(仮)',
            size: 'md',
            wrap: true
          }
        ]
      }
    ]
  },
  footer: {
    type: 'box',
    layout: 'vertical',
    spacing: 'sm',
    contents: [
      {
        type: 'button',
        style: 'primary',
        height: 'sm',
        action: {
          type: 'uri',
          label: 'サイトを見る',
          uri: `https://liff.line.me/${process.env.LIFF_ID!}`
        }
      },
      {
        type: 'spacer',
        size: 'sm'
      }
    ],
    flex: 0
  }
}

export { generateShareMessage }
