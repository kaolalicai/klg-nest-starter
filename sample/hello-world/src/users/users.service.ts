import { Injectable } from '@nestjs/common'
import { User, UserModel, IUserModel } from './model/user.model'
import { InjectModel } from 'nestjs-typegoose'
import { AccountModel, Account, IAccountModel } from './model/account.model'
import { UserDto } from './users.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: UserModel,
    @InjectModel(Account) private readonly accountModel: AccountModel,
  ) {}

  async register(createUsersDto: UserDto): Promise<User> {
    const createdUser = new this.userModel(createUsersDto)
    const user = await createdUser.save()
    await user.registerSuccess()
    return user
  }

  async findAll(): Promise<IUserModel[]> {
    return this.userModel.find()
  }

  async getAccountAndUser(userId: string): Promise<IAccountModel> {
    const user = await this.userModel.findById(userId)
    if (!user) throw new Error('User not found ' + userId)
    const account = await this.accountModel.findOne({ userId: user.id })
    if (!account) throw new Error('Account not found ' + user.id)
    return account
  }
}
