import { request, genFixtures, prefix } from '../test-helper'
import { UserTemplate } from '../model-mock-template'

describe('AppController (e2e) find with fixtures ', () => {
  beforeAll(async function () {
    await genFixtures(UserTemplate, 1, 'User')
  })

  it('find all', () => {
    request.get(prefix + '/users').expect(200)
  })
})
