import { Application } from "express"
import { MITController } from '../controllers/mit.controller'
import { mediumCacheSuccess } from '../helpers/cache.helper'

export class MITRoutes {

  public mitController : MITController =  new MITController()

  public routes(app: Application): void {
    app.route('/mits').get(mediumCacheSuccess, this.mitController.getMITs)
    app.route('/info/mit').get(mediumCacheSuccess, this.mitController.info)
  }

}
