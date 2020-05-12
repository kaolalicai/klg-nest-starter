import { request } from '../test-helper'

describe('users-mock-auth.e2e-spec.ts', () => {
  it('not login is ok ', () => {
    return request.get('/users/hello').expect(200)
  })

  it('hello is public for all user', () => {
    return request.get('/users/hello').expect(200).expect({
      code: 0,
      data: 'Hello World!',
      message: 'success'
    })
  })

  it('get user is ok', () => {
    return request.get('/users/info').expect(200)
  })

  it('get all user is ok', () => {
    return request.get('/users/').expect(200)
  })
})
