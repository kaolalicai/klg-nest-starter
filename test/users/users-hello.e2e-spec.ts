import {request} from '../test-helper'
const prefix = '/api/v1'

describe('AppController (e2e)', () => {

  it('hello', () => {
    return request
      .get(prefix + '/users/hello')
      .expect(200)
      .expect({
        'code': 0,
        'data': 'Hello World!',
        'message': 'success'
      })
  })
})
