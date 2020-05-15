import { request, prefix } from '../test-helper'

describe('AppController (e2e) error handle ', () => {
  it('get err', async () => {
    const res = await request.get(prefix + '/users/err').expect(500)
    console.log('res status', res.status)
    console.log('res body', res.body)
    expect(res.status).toEqual(500)
    expect(res.body).toEqual({
      code: 1,
      message: 'Business Error',
      url: '/api/v1/users/err'
    })
  })
})
