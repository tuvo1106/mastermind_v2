import { Status } from '../enums/status'

export interface appHealth {
  uptime: number
  status: Status
  timestamp: number
}
