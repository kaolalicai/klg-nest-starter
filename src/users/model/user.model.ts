import {prop, DocumentType, ReturnModelType} from '@typegoose/typegoose'

export class User {
  @prop()
  name: string

  @prop({required: true, index: true, unique: true})
  phone: string

  @prop({default: false})
  isRegister: boolean

  async registerSuccess () {
    this.isRegister = true
  }
}

export type IUserModel = DocumentType<User>
export type UserModel = ReturnModelType<typeof User>
