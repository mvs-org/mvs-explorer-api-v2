import { Request, Response, Application } from "express"
import { MITController } from '../controllers/mit.controller'

export class MITRoutes {

  public mitController : MITController =  new MITController()

  public routes(app: Application): void {
    app.route('/mits').get(this.mitController.getMITs)
    app.route('/info/mit').get(this.mitController.info)
  }

}
