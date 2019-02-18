import { Application } from 'express'
import { CertificateController } from '../controllers/certificate.controller'
import { longCacheSuccess } from '../helpers/cache.helper'

export class CertificateRoutes {

  public certificateController: CertificateController = new CertificateController()

  public routes(app: Application): void {
    app.route('/certs').get(longCacheSuccess, this.certificateController.getCertificates)
    app.route('/info/cert').get(longCacheSuccess, this.certificateController.info)
  }
}
