import { Application } from 'express'
import { TransactionController } from '../controllers/transaction.controller'
import { shortCacheSuccess } from '../helpers/cache.helper'

export class TransactionRoutes {

  public transactionController: TransactionController = new TransactionController()

  public routes(app: Application): void {
    app.route('/txs').get(this.transactionController.getTransactions)
    app.route('/addresses/txs').get(this.transactionController.getAddressesTransactions)
  }

}
