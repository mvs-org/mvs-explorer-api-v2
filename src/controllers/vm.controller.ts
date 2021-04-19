import { Request, Response } from 'express'
import { ResponseError, ResponseSuccess } from './../helpers/message.helper'

export class VmController {

  async swap(req: Request, res: Response) {
    const result = {
      "minVersion": process.env.SWAP_REQUIRED_WALLET_VERSION || '0.10.3',
      "open": process.env.SWAP_OPEN || false,
      "showWarning": process.env.SHOW_SWAP_WARNING || true,
      "minQuantity": process.env.SWAP_MIN_QUANTITY || 100000000,
    }
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
    res.json(new ResponseSuccess(result))
  }

  async getGasEstimation(req: Request, res: Response) {
    const result = {"fast": 20.0, "fastest": 30.0, "safeLow": 10.0, "average": 10.0, "block_time": 12.057692307692308, "blockNum": 11803048, "speed": 0.8989777452468977, "safeLowWait": 9.4, "avgWait": 3.3, "fastWait": 0.4, "fastestWait": 0.4, "gasPriceRange": {"1500": 0.4, "1480": 0.4, "1460": 0.4, "1440": 0.4, "1420": 0.4, "1400": 0.4, "1380": 0.4, "1360": 0.4, "1340": 0.4, "1320": 0.4, "1300": 0.4, "1280": 0.4, "1260": 0.4, "1240": 0.4, "1220": 0.6, "1200": 0.9, "1180": 1.1, "1160": 1.2, "1140": 2.8, "1120": 5.4, "1100": 201.0, "1080": 201.0, "1060": 201.0, "1040": 201.0, "1020": 201.0, "1000": 201.0, "980": 201.0, "960": 201.0, "940": 201.0, "920": 201.0, "900": 201.0, "880": 201.0, "860": 201.0, "840": 201.0, "820": 201.0, "800": 201.0, "780": 201.0, "760": 201.0, "740": 201.0, "720": 201.0, "700": 201.0, "680": 201.0, "660": 201.0, "640": 201.0, "620": 201.0, "600": 201.0, "580": 201.0, "560": 201.0, "540": 201.0, "520": 201.0, "500": 201.0, "480": 201.0, "460": 201.0, "440": 201.0, "420": 201.0, "400": 201.0, "380": 201.0, "360": 201.0, "340": 201.0, "320": 201.0, "300": 201.0, "280": 201.0, "260": 201.0, "240": 201.0, "220": 201.0, "200": 201.0, "190": 201.0, "180": 201.0, "170": 201.0, "160": 201.0, "150": 201.0, "140": 201.0, "130": 201.0, "120": 201.0, "110": 201.0, "100": 201.0, "90": 201.0, "80": 201.0, "70": 201.0, "60": 201.0, "50": 201.0, "40": 201.0, "30": 201.0, "20": 201.0, "10": 201.0, "8": 201.0, "6": 201.0, "4": 201.0, "1130": 3.3, "1110": 9.4}}
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    res.json(result)
  }

}
