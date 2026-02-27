import { DashboardContainer } from '@core/modules/dashboard/infrastructure/container/DashboardContainer'
import { httpClient } from './http'

export const dashboardContainer = DashboardContainer.getInstance(httpClient)