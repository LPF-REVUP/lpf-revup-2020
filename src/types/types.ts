declare global {
  interface Window {
    liff: any
    VConsole: any
  }
}

export interface HeadInfo {
  title?: string
  description?: string
  ogImagePath?: string
}

export interface Tag {
  id: string
  name: string
}

export interface Area {
  id: string
  name: string
}

export interface Image {
  url: string
}

export interface Speaker {
  id: string
  firstNameJp: string
  familyNameJp: string
  firstNameEn: string
  familyNameEn: string
  title: string
  affiliation: string
  profile: string
  image: Image
  sessions: Array<EventSession>
  twitter: string
  facebook: string
}

export interface EventSession {
  id: string
  title: string
  description: string
  area: Area
  startsAt: Date
  endsAt: Date
  applicationPage: string
  speakers: Array<Speaker>
  tags: Array<Tag>
}

export enum RankEnum {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export interface Sponsor {
  id: string
  name: string
  link: string
  image: Image
  rank: RankEnum
}

class BaseError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = new.target.name
    // 下記の行はTypeScriptの出力ターゲットがES2015より古い場合(ES3, ES5)のみ必要
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class LiffError extends BaseError {
  constructor(public code: string, message: string) {
    super(message)
  }
}
