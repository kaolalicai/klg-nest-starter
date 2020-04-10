import {Injectable} from '@nestjs/common'
import {CreateUsersDto} from './dto/create-users.dto'
import {User, UserModel, IUserModel} from './model/user.model'
import {InjectModel} from 'nestjs-typegoose'
import {AccountModel, Account, IAccountModel} from './model/account.model'

@Injectable()
export class UsersService {
  constructor (
    @InjectModel(User) private readonly userModel: UserModel,
    @InjectModel(Account) private readonly accountModel: AccountModel
  ) {
  }

  async register (createUsersDto: CreateUsersDto): Promise<User> {
    const createdUser = new this.userModel(createUsersDto)
    const user = await createdUser.save()
    await user.registerSuccess()
    return user
  }

  async findAll (): Promise<IUserModel[]> {
    return this.userModel.find()
  }

  async getAccountAndUser (userId: string): Promise<IAccountModel> {
    let user = await this.userModel.findById(userId)
    return this.accountModel.findOne({userId: user.id})
  }
}
