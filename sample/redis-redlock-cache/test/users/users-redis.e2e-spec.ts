import {request} from '../test-helper'

describe('users-redis.e2e-spec', () => {

  it('getAndSet', async () => {
    const res = await request
      .post('/users/getAndSet')
      .expect(201)
  })
})
