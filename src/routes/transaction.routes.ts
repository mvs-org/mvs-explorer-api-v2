import { Request, Response } from "express"
import { TransactionController } from '../controllers/transaction.controller'

export class TransactionRoutes {

  public transactionController : TransactionController =  new TransactionController()

  public routes(app): void {
    app.route('/txs').get(this.transactionController.getTransactions)
  }

}
