/**
 * mock js 的语法 见 https://github.com/nuysoft/Mock/wiki/Syntax-Specification
 */
const Mock = require('mockjs')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const UserTemplate = {
  _id: () => ObjectId(),
  'name':() => Mock.Random.first(),
  phone: /1\d{10}/,
  'balance|10-100': 1
}

console.log('aa', Mock.mock(UserTemplate))
