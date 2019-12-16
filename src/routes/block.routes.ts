import { Application } from 'express'
import { BlockController } from '../controllers/block.controller'

export class BlockRoutes {

  public blockController: BlockController =  new BlockController()

  public routes(app: Application): void {
    app.route('/blocks').get(this.blockController.getBlocks)
    app.route('/height').get(this.blockController.getHeight)
    app.route('/block/fromtime/:timestamp').get(this.blockController.getHeightFromTimestamp)
  }
}
