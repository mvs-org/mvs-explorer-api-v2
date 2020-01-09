import { Application } from 'express'
import { ElectionController } from '../controllers/election.controller'

export class ElectionRoutes {

  public ElectionController: ElectionController = new ElectionController()

  public routes(app: Application): void {
    app.route('/election/info').get(this.ElectionController.getInfo)
    app.route('/election/votes').get(this.ElectionController.getVotes)
    app.route('/election/result').get(this.ElectionController.getResult)
    app.route('/election/rewards').get(this.ElectionController.getRewards)
    app.route('/election/revote/:hash').get(this.ElectionController.getRevote)
  }

}
