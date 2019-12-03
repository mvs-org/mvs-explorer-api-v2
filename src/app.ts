import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as mongoose from 'mongoose'
import { AvatarRoutes } from './routes/avatar.routes'
import { BlockRoutes } from './routes/block.routes'
import { CertificateRoutes } from './routes/certificate.routes'
import { MITRoutes } from './routes/mit.routes'
import { MSTRoutes } from './routes/mst.routes'
import { OutputRoutes } from './routes/output.routes'
import { TransactionRoutes } from './routes/transaction.routes'
import { AddressRoutes } from './routes/address.routes';
import { ElectionRoutes } from './routes/election.routes';

class App {

  public app: express.Application
  public transactionRoutes: TransactionRoutes = new TransactionRoutes()
  public OutputRoutes: OutputRoutes = new OutputRoutes()
  public avatarRoutes: AvatarRoutes = new AvatarRoutes()
  public addressRoutes: AddressRoutes = new AddressRoutes()
  public mitRoutes: MITRoutes = new MITRoutes()
  public mstRoutes: MSTRoutes = new MSTRoutes()
  public blockRoutes: BlockRoutes = new BlockRoutes()
  public certificateRoutes: CertificateRoutes = new CertificateRoutes()
  public electionRoutes: ElectionRoutes = new ElectionRoutes()
  public mongoUrl: string = (process.env.MONGO_URL) ? process.env.MONGO_URL : 'mongodb://localhost:27017/testnet'

  constructor() {
    this.app = express()
    this.config()
    this.transactionRoutes.routes(this.app)
    this.OutputRoutes.routes(this.app)
    this.avatarRoutes.routes(this.app)
    this.addressRoutes.routes(this.app)
    this.mitRoutes.routes(this.app)
    this.mstRoutes.routes(this.app)
    this.blockRoutes.routes(this.app)
    this.certificateRoutes.routes(this.app)
    this.electionRoutes.routes(this.app)
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
