import {request, genFixtures} from '../test-helper'
import {UserTemplate, AccountTemplate} from '../model-mock-template'

describe('AppController (e2e) multi db  ', () => {
  let user = null
  let userId: string = null
  beforeAll(async function () {
    // 自动生成 User fixture
    let userData = await genFixtures(UserTemplate, 1, 'User')
    user = userData[0]
    userId = user._id.toString()

    // 自动生成 Account fixture，并且通过 fixData 函数来修改值
    await genFixtures(AccountTemplate, 1, 'Account', (i, it) => {
      it.userId = userId
      return it
    })
  })

  it('find account', async () => {
    console.log('userId', userId)
    const {body} = await request
      .get('/users/account')
      .query({userId: userId})
      .expect(200)

    console.log('body', body)
    expect(body.data.userId).toEqual(userId)
  })
})
