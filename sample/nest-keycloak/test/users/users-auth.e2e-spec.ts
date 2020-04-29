import { request } from '../test-helper'

describe('AppController (e2e)', () => {
  it('not login get 401 ', () => {
    return request.get('/users/hello').expect(401)
  })

  let token: string
  it('login get token', async () => {
    const { body } = await request.get('/users/login').expect(200)
    expect(body.data.token).not.toBeNull()
    token = body.data.token
    console.log('token', token)
  })

  it('hello is public for all user', () => {
    return request
      .get('/users/hello')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect({
        code: 0,
        data: 'Hello World!',
        message: 'success'
      })
  })

  it('get user info is only for user role', () => {
    return request.get('/users/info').set({ Authorization: `Bearer ${token}` }).expect(200)
  })

  it('get all user is not allowed', () => {
    return request.get('/users/').set({ Authorization: `Bearer ${token}` }).expect(406)
  })
})
