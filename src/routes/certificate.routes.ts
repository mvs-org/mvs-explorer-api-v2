import { Application } from 'express'
import { CertificateController } from '../controllers/certificate.controller'

export class CertificateRoutes {

  public certificateController: CertificateController = new CertificateController()

  public routes(app: Application): void {
    app.route('/certs').get(this.certificateController.getCertificates)
    app.route('/cert').get(this.certificateController.getCertificate)
    app.route('/info/cert').get(this.certificateController.info)
  }
}
