/**
 * mock js 的语法 见 https://github.com/nuysoft/Mock/wiki/Syntax-Specification
 */
import {ObjectId} from './ObjectId'
import * as Mock from 'mockjs'

export const UserTemplate = {
  _id: () => ObjectId(),
  'name': () => Mock.Random.first(),
  phone: /1\d{10}/
}

export const AccountTemplate = {
  _id: () => ObjectId(),
  userId: () => ObjectId(),
  'balance|10-100': 1
}
