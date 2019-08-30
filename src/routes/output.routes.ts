import { Application } from 'express'
import { OutputController } from '../controllers/output.controller'
import { shortCacheSuccess } from '../helpers/cache.helper'

export class OutputRoutes {

  public outputController: OutputController = new OutputController()

  public routes(app: Application): void {
    app.route('/utxo').get(this.outputController.getUtxo)
    app.route('/output/:txid/:index').get(this.outputController.getOutput)
  }

}
