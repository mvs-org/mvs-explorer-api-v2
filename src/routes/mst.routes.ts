import { Application } from 'express'
import { MSTController } from '../controllers/mst.controller'
import { mediumCacheSuccess } from '../helpers/cache.helper'

export class MSTRoutes {

  public mstController: MSTController =  new MSTController()

  public routes(app: Application): void {
    app.route('/mst').get(mediumCacheSuccess, this.mstController.getMSTs)
  }

}
