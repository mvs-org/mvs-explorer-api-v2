import { BlockController } from '../controllers/block.controller'
import { shortCacheSuccess } from '../helpers/cache.helper'
import { Application } from 'express';

export class BlockRoutes {

  public blockController : BlockController =  new BlockController()

  public routes(app:Application): void {
    app.route('/blocks').get(shortCacheSuccess, this.blockController.getBlocks)
  }
}
