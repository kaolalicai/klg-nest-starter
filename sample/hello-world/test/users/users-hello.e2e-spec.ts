import { request } from '../test-helper'

describe('AppController (e2e)', () => {
  it('hello', () => {
    return request.get('/users/hello').expect(200).expect({
      code: 0,
      data: 'Hello World!',
      message: 'success',
    })
  })
})
