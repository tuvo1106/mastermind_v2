import { Status } from '../../application/enums/status'

export interface AppHealth {
  uptime: number
  status: Status
  timestamp: number
}
