// app.controller.ts
import { Controller, Inject, Logger, Post, Body } from '@nestjs/common'
import { RechargeService } from './service/recharge.service'
import { ZBClient, CompleteFn, Job, DeployWorkflowResponse } from 'zeebe-node'
import { ZEEBE_CONNECTION_PROVIDER, ZeebeWorker } from '@payk/nestjs-zeebe'
import { Ctx, Payload } from '@nestjs/microservices'
import { ObjectId } from '@kalengo/mongoose'

export type RechargeDataFlow = {
  orderId: string
  amount: number
}

@Controller()
export class AppController {
  private logger = new Logger(AppController.name)

  constructor(
    private readonly rechargeService: RechargeService,
    @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbClient: ZBClient
  ) {}

  @Post('/deployFLow')
  async deployFLow(): Promise<DeployWorkflowResponse> {
    const res = await this.zbClient.deployWorkflow('./flows/recharge.bpmn')
    this.logger.debug('DeployWorkflowResponse', JSON.stringify(res))
    return res
  }

  // Use the client to create a new workflow instance
  @Post('/recharge')
  async recharge(@Body('nums') nums: number): Promise<number> {
    nums = nums || 1
    for (let i = 0; i < nums; i++) {
      const orderId = ObjectId().toString()
      const amount = Math.ceil(Math.random() * 100)
      const res = await this.zbClient.createWorkflowInstance(
        'recharge-process',
        {
          amount,
          orderId
        }
      )
      this.logger.debug('CreateWorkflowInstanceResponse', JSON.stringify(res))
    }
    return nums
  }

  // Subscribe to events of type 'payment-service
  @ZeebeWorker('pay_service')
  async paymentService(
    @Payload() job: Job<RechargeDataFlow, any>,
    @Ctx() complete: CompleteFn<any>
  ) {
    console.log('Payment-service, Task variables', job.variables)
    const { orderId, amount } = job.variables
    await this.rechargeService.recharge(orderId, amount)
    // Task worker business logic goes here
    complete.success({ pay: 'success' })
  }

  // Subscribe to events of type 'inventory-service and create a worker with the options as passed below (zeebe-node ZBWorkerOptions)
  @ZeebeWorker('recharge_success_service', {
    maxJobsToActivate: 5,
    timeout: 300
  })
  async rechargeSuccess(
    @Payload() job: Job<RechargeDataFlow, any>,
    @Ctx() complete: CompleteFn<any>
  ) {
    console.log('recharge_success_service, Task variables', job.variables)
    const { orderId } = job.variables
    await this.rechargeService.onSuccess(orderId)
    complete.success()
  }

  @ZeebeWorker('recharge_fail_service', { maxJobsToActivate: 5, timeout: 300 })
  async rechargeFail(
    @Payload() job: Job<RechargeDataFlow, any>,
    @Ctx() complete: CompleteFn<any>
  ) {
    console.log('recharge_fail_service, Task variables', job.variables)
    const { orderId } = job.variables
    await this.rechargeService.onFail(orderId)
    complete.success()
  }
}
