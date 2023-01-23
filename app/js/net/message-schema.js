import { define, string, number, object, boolean } from 'superstruct'

export const TYPES = {
  CANNON: 'CANNON',
  CHAT: 'CHAT',
  PLAYER_UPDATE: 'PLAYER_UPDATE',
}

export const Message = define({
  type: string(),
  body: object(),
  meta: {
    timestamp: string(),
  },
})

export const PlayerUpdate = define({
  player: object(),
  position: {
    x: number(),
    y: number(),
    z: number(),
  },
  quaternion: {
    isQuaternion: boolean(),
    _x: number(),
    _y: number(),
    _z: number(),
    _w: number(),
  },
})

export const Cannon = define({
  player: object(),
})

export const Chat = define({
  from: string(),
  to: string(),
  message: string(),
})
