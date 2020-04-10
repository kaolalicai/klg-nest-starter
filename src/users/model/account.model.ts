import {prop, DocumentType, ReturnModelType} from '@typegoose/typegoose'

export class Account {
  @prop({required: true, index: true})
  userId: string

  @prop({default: 0})
  balance: number
}

export type IAccountModel = DocumentType<Account>
export type AccountModel = ReturnModelType<typeof Account>
