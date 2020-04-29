import { request } from '../test-helper'

describe('users-redis.e2e-spec', () => {
  it('getAndSet', async () => {
    const res = await request.post('/users/getAndSet').expect(201)
  })

  it('mutex', async () => {
    const results = await Promise.all([
      request.get('/users/mutex').expect(200).expect([1, 2, 3, 4, 5]),
      request.get('/users/mutex').expect(500),
      request.get('/users/mutex').expect(500)
    ])
    let [res1, res2, res3] = results
    console.log('res1', res1.body)
    console.log('res2', res2.body)
    console.log('res3', res3.body)
  })

  it('buffer', async () => {
    const results = await Promise.all([
      request.get('/users/buffer').expect(200).expect([1, 2, 3, 4, 5]),
      request.get('/users/buffer').expect(200).expect([1, 2, 3, 4, 5]),
      request.get('/users/buffer').expect(200).expect([1, 2, 3, 4, 5])
    ])
    let [res1, res2, res3] = results
    console.log('res1', res1.body)
    console.log('res2', res2.body)
    console.log('res3', res3.body)
  })
})
