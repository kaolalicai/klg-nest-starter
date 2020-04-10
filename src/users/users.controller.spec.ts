import {getModelToken} from 'nestjs-typegoose'
import {Test} from '@nestjs/testing'
import {UsersController} from './users.controller'
import {UsersService} from './users.service'

describe('UsersController', () => {
  let usersController: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService,
        {
          provide: getModelToken('User'),
          useValue: {}
        }]
    }).compile()

    usersService = module.get<UsersService>(UsersService)
    usersController = module.get<UsersController>(UsersController)
  })

  describe('register', () => {
    it('register a user success', async () => {
      const userDto = {name: 'miao', phone: '13646876567'}
      const mockCallback = jest.fn()
      jest.spyOn(usersService, 'register').mockImplementation(mockCallback)

      await usersController.register(userDto)
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toBeCalledWith(userDto)
    })
  })
})
