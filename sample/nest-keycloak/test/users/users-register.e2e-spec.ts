import { request, testModule, prefix } from '../test-helper'
import { UsersService } from '../../src/users/users.service'

describe('AppController (e2e) with db ', () => {
  it('register with service mock', async () => {
    const usersService = testModule.get<UsersService>(UsersService)
    const spy = jest
      .spyOn(usersService, 'register')
      .mockImplementation(async () => ({ mock: true } as any))

    console.log('prefix', prefix)
    const { body } = await request
      .post(prefix + '/users/register')
      .send({ name: 'nick', phone: '12345' })
      .expect(201)
      .expect({
        code: 0,
        message: 'success',
        data: {
          mock: true
        }
      })
    console.log('body', body)
    expect(spy).toHaveBeenCalled()
    // 一定要 restore 不然会影响其他测试
    spy.mockRestore()
  })

  it('register', async () => {
    const { body } = await request
      .post(prefix + '/users/register')
      .send({ name: 'nick', phone: '12345' })
      .expect(201)
    expect(body.code).toEqual(0)
    expect(body.message).toEqual('success')
    expect(body.data.name).toEqual('nick')
  })

  it('find all', () => {
    request.get(prefix + '/users').expect(200)
  })
})
