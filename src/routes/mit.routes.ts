import { Request, Response } from "express"
import { MITController } from '../controllers/mit.controller'

export class MITRoutes {

  public mitController : MITController =  new MITController()

  public routes(app): void {
    app.route('/mits').get(this.mitController.getMITs)
  }
}
