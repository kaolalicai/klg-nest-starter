import {INestApplication} from '@nestjs/common'
import {request} from '../test-helper'

describe('AppController (e2e)', () => {
  let app: INestApplication

  it('hello', () => {
    return request
      .get('/users/hello')
      .expect(200)
      .expect({
        "code": 0,
        "data": "Hello World!",
        "message": "success"
      })
  })
})
