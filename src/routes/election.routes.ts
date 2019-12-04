import { Application } from 'express'
import { ElectionController } from '../controllers/election.controller'

export class ElectionRoutes {

  public ElectionController: ElectionController = new ElectionController()

  public routes(app: Application): void {
    app.route('/election/candidates').get(this.ElectionController.getCandidates)
    app.route('/election/votes').get(this.ElectionController.getVotes)
    app.route('/election/result').get(this.ElectionController.getResult)
  }

}
