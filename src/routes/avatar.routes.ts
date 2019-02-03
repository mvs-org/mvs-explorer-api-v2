import { Application } from "express"
import { AvatarController } from '../controllers/avatar.controller'
import { mediumCacheSuccess } from '../helpers/cache.helper'

export class AvatarRoutes {

  public avatarController : AvatarController =  new AvatarController()

  public routes(app: Application): void {
    app.route('/avatars').get(mediumCacheSuccess, this.avatarController.getAvatars)
    app.route('/info/avatar').get(mediumCacheSuccess, this.avatarController.info)
  }
}
