import { Application } from 'express'
import { BlockchainController } from '../controllers/blockchain.controller'

export class BlockchainRoutes {

  public blockchainController: BlockchainController =  new BlockchainController()

  public routes(app: Application): void {
    app.route('/fee').get(this.blockchainController.getDefaultFee)
  }

}
