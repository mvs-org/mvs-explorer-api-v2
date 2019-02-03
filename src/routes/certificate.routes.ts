import { CertificateController } from '../controllers/certificate.controller'

import * as options from 'apicache'
import { createClient } from 'redis'
import { config as redis_config, enabled as redis_enabled } from '../config/redis.js'
import { Application } from 'express';
const cache = options({
  redisClient: (redis_enabled) ? createClient(redis_config) : undefined,
  statusCodes: { include: [200] }
})
  .middleware
//Define cache rules to only cache if result was successfull
const hourCacheSuccess = cache('60 minutes'),
  longCacheSuccess = cache('5 minutes'),
  mediumCacheSuccess = cache('1 minutes'),
  shortCacheSuccess = cache('20 seconds')

export class CertificateRoutes {

  public certificateController: CertificateController = new CertificateController()

  public routes(app: Application): void {
    app.route('/certs').get(mediumCacheSuccess, this.certificateController.getCertificates)
    app.route('/info/cert').get(mediumCacheSuccess, this.certificateController.info)
  }
}
