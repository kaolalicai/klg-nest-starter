import {request} from '../test-helper'

describe('AppController (e2e) with db ', () => {
  it('register', () => {
    return request
      .post('/users/register')
      .send({name: 'nick', phone: '12345'})
      .expect(201)
      .expect({
        'code': 0,
        'message': 'success'
      })
  })
})
