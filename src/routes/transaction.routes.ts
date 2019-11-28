import { Application } from 'express'
import { TransactionController } from '../controllers/transaction.controller'

export class TransactionRoutes {

  public transactionController: TransactionController = new TransactionController()

  public routes(app: Application): void {
    app.route('/txs').get(this.transactionController.getTransactions)
    app.route('/addresses/txs').get(this.transactionController.getAddressesTransactions)
    app.route('/block/txs').get(this.transactionController.getBlockTxs)
  }

}
