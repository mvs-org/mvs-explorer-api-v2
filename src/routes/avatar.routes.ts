import { Request, Response } from "express"
import { AvatarController } from '../controllers/avatar.controller'

export class AvatarRoutes {

  public avatarController : AvatarController =  new AvatarController()

  public routes(app): void {
    app.route('/avatars').get(this.avatarController.getAvatars)
  }
}
