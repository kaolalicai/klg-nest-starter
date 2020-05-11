import { prop, DocumentType, ReturnModelType } from '@typegoose/typegoose'

export class Order {
  @prop({ required: true, index: true })
  amount!: number

  @prop({ required: true, index: true, default: 'pending' })
  status!: string

  async done(this: IOrderModel) {
    this.status = 'done'
    await this.save()
  }

  async fail(this: IOrderModel) {
    this.status = 'fail'
    await this.save()
  }
}

export type IOrderModel = DocumentType<Order>
export type OrderModel = ReturnModelType<typeof Order>
