import {request, genFixtures} from '../test-helper'
import {UserTemplate} from '../model-mock-template'
const prefix = '/api/v1'

describe('AppController (e2e) find with fixtures ', () => {
  beforeAll(async function () {
    await genFixtures(UserTemplate, 1, 'User')
  })

  it('find all', () => {
    request
      .get(prefix + '/users')
      .expect(200)
  })
})
