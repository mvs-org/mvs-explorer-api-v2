import { Application } from 'express'
import { VmController } from '../controllers/vm.controller'

export class VmRoutes {

  public vmController: VmController = new VmController()

  public routes(app: Application): void {
    app.route('/vm/swap').get(this.vmController.swap)
    app.route('/vm/estimate_gas').get(this.vmController.getGasEstimation)
  }

}
