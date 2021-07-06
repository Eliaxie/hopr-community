import { log } from '@graphprotocol/graph-ts'
import { Announcement, ChannelUpdate } from '../generated/HoprChannels/HoprChannels'
import { Account, Channel } from '../generated/schema'
import { isAddress } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/keccak256'
import { arrayify } from '@ethersproject/bytes'

const ALPHABET = '0123456789abcdef'

export function u8aToHex(arr?: Uint8Array, prefixed: boolean = true): string {
  let result = prefixed ? '0x' : ''

  if (arr == undefined || arr.length == 0) {
    return result
  }
  const arrLength = arr.length

  for (let i = 0; i < arrLength; i++) {
    result += ALPHABET[arr[i] >> 4]
    result += ALPHABET[arr[i] & 15]
  }

  return result
}

export function u8aConcat(...list: (Uint8Array | undefined)[]): Uint8Array {
  if (list == undefined || list.length == 0) {
    return new Uint8Array()
  }
  if (list.length == 1) {
    return list[0] ? list[0].slice() : new Uint8Array()
  }
  let totalLength = 0

  const listLength = list.length
  for (let i = 0; i < listLength; i++) {
    if (list[i] == undefined) {
      continue
    }

    totalLength += list[i].length
  }

  const result = new Uint8Array(totalLength)
  let offset = 0

  for (let i = 0; i < listLength; i++) {
    if (list[i] == undefined) {
      continue
    }

    if (list[i] !== undefined) {
      result.set(list[i], offset)
      offset += list[i].length
    }
  }

  return result
}

export class Address {
  constructor(private arr: Uint8Array) {
    if (arr.length !== Address.SIZE) {
      throw new Error('Incorrect size Uint8Array for address')
    } else if (!isAddress(u8aToHex(arr))) {
      throw new Error('Incorrect Uint8Array for address')
    }
  }
  static get SIZE(): number {
    return 20
  }
  serialize() {
    return this.arr
  }
}

class Hash {
  constructor(private arr: Uint8Array) {
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(arr)) {
      throw Error(`Expected a Uint8Array but got a Buffer`)
    }

    if (arr.length != Hash.SIZE) {
      throw new Error('Incorrect size Uint8Array for hash')
    }
  }
  static SIZE = 32
  static create(...inputs: Uint8Array[]) {
    return new Hash(arrayify(keccak256(u8aConcat(...inputs))))
  }
  toHex(): string {
    return u8aToHex(this.arr)
  }
}

export function generateChannelId(source: Address, destination: Address) {
  return Hash.create(u8aConcat(source.serialize(), destination.serialize()))
}

export function handleAnnouncement(event: Announcement) {
  const account = new Account(event.params.account.toString())
  account.save()
}
export function handleChannelUpdate(event: ChannelUpdate) {
  const channelId = generateChannelId(new Address(event.params.source), new Address(event.params.destination))
  const channel = new Channel(channelId.toHex())
  channel.save()
}
