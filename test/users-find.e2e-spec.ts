import {request, genUsers} from './test-helper'

describe('AppController (e2e) find with fixtures ', () => {
  beforeAll(async function () {
    await genUsers(10)
  })

  it('find all', () => {
    request
      .get('/users')
      .expect(200)
  })
})
