import { AppStatus } from '../../application/enums/appStatus'

export interface AppHealth {
  uptime: number
  status: AppStatus

  timestamp: number
}
