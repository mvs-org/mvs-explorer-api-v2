import { Application } from 'express'
import { MSTController } from '../controllers/mst.controller'

export class MSTRoutes {

  public mstController: MSTController =  new MSTController()

  public routes(app: Application): void {
    app.route('/msts').get(this.mstController.getMSTs)
    app.route('/info/mst').get(this.mstController.info)
    app.route('/msts/special').get(this.mstController.getSpecialMSTs)
  }

}
