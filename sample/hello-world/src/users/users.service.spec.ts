import * as mongoose from 'mongoose'
import { getModelToken } from 'nestjs-typegoose'
import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

mongoose.set('debug', true)

describe('UsersService', () => {
  let usersService: UsersService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: () => ({ a: 1 }),
          },
        },
        {
          provide: getModelToken('Account'),
          useValue: {},
        },
      ],
    }).compile()
    usersService = module.get<UsersService>(UsersService)
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = { a: 1 }
      // jest.spyOn(usersService, 'findAll').mockImplementation(async () => result)
      const res = await usersService.findAll()
      expect(res).toEqual(result)
    })
  })
})
