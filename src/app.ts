import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as mongoose from 'mongoose'
import { AvatarRoutes } from './routes/avatar.routes'
import { BlockRoutes } from './routes/block.routes'
import { CertificateRoutes } from './routes/certificate.routes'
import { MITRoutes } from './routes/mit.routes'
import { MSTRoutes } from './routes/mst.routes'
import { TransactionRoutes } from './routes/transaction.routes'

class App {

  public app: express.Application
  public transactionRoutes: TransactionRoutes = new TransactionRoutes()
  public avatarRoutes: AvatarRoutes = new AvatarRoutes()
  public mitRoutes: MITRoutes = new MITRoutes()
  public mstRoutes: MSTRoutes = new MSTRoutes()
  public blockRoutes: BlockRoutes = new BlockRoutes()
  public certificateRoutes: CertificateRoutes = new CertificateRoutes()
  public mongoUrl: string = (process.env.MONGO_URL) ? process.env.MONGO_URL : 'mongodb://localhost:27017/mvs'

  constructor() {
    this.app = express()
    this.config()
    this.transactionRoutes.routes(this.app)
    this.avatarRoutes.routes(this.app)
    this.mitRoutes.routes(this.app)
    this.mstRoutes.routes(this.app)
    this.blockRoutes.routes(this.app)
    this.certificateRoutes.routes(this.app)
    this.mongoSetup()
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json())
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.all('/*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      res.header('Content-Type', 'application/json')
      next()
    })
  }

  private mongoSetup(): void {
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true })
  }

}

export default new App().app
