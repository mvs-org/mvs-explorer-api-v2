import { Request, Response } from "express"
import { BlockController } from '../controllers/block.controller'

export class BlockRoutes {

  public blockController : BlockController =  new BlockController()

  public routes(app): void {
    app.route('/blocks').get(this.blockController.getBlocks)
  }
}
