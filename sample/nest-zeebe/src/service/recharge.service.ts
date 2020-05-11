import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { OrderModel, Order, IOrderModel } from '../model/order.model'
import { ZEEBE_CONNECTION_PROVIDER } from '@payk/nestjs-zeebe'
import { ZBClient } from 'zeebe-node'
import { revolver } from '../util'

@Injectable()
export class RechargeService {
  constructor(
    @InjectModel(Order) private readonly orderModel: OrderModel,
    @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbClient: ZBClient
  ) {}

  async recharge(orderId: string, amount: number): Promise<void> {
    const fOrder = await this.orderModel.findById(orderId)
    if (!fOrder) {
      const cOrder = new this.orderModel({ _id: orderId, amount })
      await cOrder.save()
    }
    revolver()
    // 模拟第三方异步回调
    setTimeout(() => {
      this.zbClient
        .publishMessage({
          correlationKey: orderId,
          messageId: orderId,
          name: Math.random() > 0.2 ? 'pay_success' : 'pay_fail',
          variables: {},
          timeToLive: 10000 // seconds
        })
        .then(console.log)
        .catch(console.error)
    }, 500)
  }

  async onSuccess(orderId: string): Promise<IOrderModel> {
    revolver()
    const order = await this.orderModel.findById(orderId)
    if (!order) throw new Error('order not found ' + orderId)
    await order.done()
    revolver()
    return order
  }

  async onFail(orderId: string): Promise<IOrderModel> {
    revolver()
    const order = await this.orderModel.findById(orderId)
    if (!order) throw new Error('order not found ' + orderId)
    await order.fail()
    revolver()
    return order
  }
}
