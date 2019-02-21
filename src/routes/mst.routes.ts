import { Application } from 'express'
import { MSTController } from '../controllers/mst.controller'
import { longCacheSuccess, mediumCacheSuccess } from '../helpers/cache.helper'

export class MSTRoutes {

  public mstController: MSTController =  new MSTController()

  public routes(app: Application): void {
    app.route('/msts').get(mediumCacheSuccess, this.mstController.getMSTs)
    app.route('/info/mst').get(mediumCacheSuccess, this.mstController.info)
    app.route('/msts/special').get(longCacheSuccess, this.mstController.getSpecialMSTs)
  }

}
