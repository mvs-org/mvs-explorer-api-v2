import { Application } from "express"
import { AvatarController } from '../controllers/avatar.controller'

export class AvatarRoutes {

  public avatarController : AvatarController =  new AvatarController()

  public routes(app: Application): void {
    app.route('/avatars').get(this.avatarController.getAvatars)
    app.route('/avatar/info').get(this.avatarController.info)
  }
}
