import { TransactionController } from '../controllers/transaction.controller'
import { Application } from 'express';
import { shortCacheSuccess } from '../helpers/cache.helper';

export class TransactionRoutes {

  public transactionController : TransactionController =  new TransactionController()

  public routes(app:Application): void {
    app.route('/txs').get(shortCacheSuccess, this.transactionController.getTransactions)
  }

}
