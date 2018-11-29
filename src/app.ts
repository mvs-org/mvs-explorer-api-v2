import * as express from "express"
import * as bodyParser from "body-parser"
import { TransactionRoutes } from "./routes/transaction.routes"
import { AvatarRoutes } from "./routes/avatar.routes"
import { CertificateRoutes } from "./routes/certificate.routes"
import { MITRoutes } from "./routes/mit.routes"
import * as mongoose from "mongoose"

class App {

  public app: express.Application
  public transactionRoutes: TransactionRoutes = new TransactionRoutes()
  public avatarRoutes: AvatarRoutes = new AvatarRoutes()
  public mitRoutes: MITRoutes = new MITRoutes()
  public certificateRoutes: CertificateRoutes = new CertificateRoutes()
  public mongoUrl: string = (process.env.MONGO_URL) ? process.env.MONGO_URL : 'mongodb://localhost:27017/mvs'

  constructor() {
    this.app = express()
    this.config()
    this.transactionRoutes.routes(this.app)
    this.avatarRoutes.routes(this.app)
    this.mitRoutes.routes(this.app)
    this.certificateRoutes.routes(this.app)
    this.mongoSetup()
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json())
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }))
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true })
  }

}

export default new App().app
