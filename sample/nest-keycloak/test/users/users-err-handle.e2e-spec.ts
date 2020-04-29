import { request, prefix } from '../test-helper'

describe('AppController (e2e) error handle ', () => {
  it('get err', async () => {
    const res = await request.get(prefix + '/users/err').expect(403)
    console.log('res status', res.status)
    console.log('res body', res.body)
    expect(res.status).toEqual(403)
    expect(res.body).toEqual({ code: 403, message: 'Forbidden' })
  })
})
