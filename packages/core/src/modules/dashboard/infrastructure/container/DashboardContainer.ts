import {
  GetBrandCampaignSummaryUseCase,
  GetBrandCampaignTimelineUseCase,
  GetCollaborationTimelineUseCase,
  GetInfluencerDashboardUseCase,
  ListCampaignsUseCase,
  ListCollaborationsUseCase,
  ListInfluencerPayoutsUseCase,
  ListBrandProductsUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  CreateCampaignUseCase,
  UpdateCampaignUseCase,
  PublishCampaignUseCase,
  DeleteCampaignUseCase,
} from '../../application/use-cases'
import { DashboardApiClient } from '../api/DashboardApiClient'
import { DashboardRepository } from '../repositories/DashboardRepository'
import { HttpClient } from '@core/shared/services/http/HttpClient'

export class DashboardContainer {
  private static instance: DashboardContainer

  public getInfluencerDashboardUseCase: GetInfluencerDashboardUseCase
  public listInfluencerPayoutsUseCase: ListInfluencerPayoutsUseCase
  public listCampaignsUseCase: ListCampaignsUseCase
  public listCollaborationsUseCase: ListCollaborationsUseCase
  public getBrandCampaignSummaryUseCase: GetBrandCampaignSummaryUseCase
  public getBrandCampaignTimelineUseCase: GetBrandCampaignTimelineUseCase
  public getCollaborationTimelineUseCase: GetCollaborationTimelineUseCase

  public listBrandProductsUseCase: ListBrandProductsUseCase
  public createProductUseCase: CreateProductUseCase
  public updateProductUseCase: UpdateProductUseCase
  public deleteProductUseCase: DeleteProductUseCase

  public createCampaignUseCase: CreateCampaignUseCase
  public updateCampaignUseCase: UpdateCampaignUseCase
  public publishCampaignUseCase: PublishCampaignUseCase
  public deleteCampaignUseCase: DeleteCampaignUseCase

  private constructor(httpClient: HttpClient) {
    const api = new DashboardApiClient(httpClient)
    const repo = new DashboardRepository(api)

    this.getInfluencerDashboardUseCase = new GetInfluencerDashboardUseCase(repo)
    this.listInfluencerPayoutsUseCase = new ListInfluencerPayoutsUseCase(repo)
    this.listCampaignsUseCase = new ListCampaignsUseCase(repo)
    this.listCollaborationsUseCase = new ListCollaborationsUseCase(repo)
    this.getBrandCampaignSummaryUseCase = new GetBrandCampaignSummaryUseCase(repo)
    this.getBrandCampaignTimelineUseCase = new GetBrandCampaignTimelineUseCase(repo)
    this.getCollaborationTimelineUseCase = new GetCollaborationTimelineUseCase(repo)

    this.listBrandProductsUseCase = new ListBrandProductsUseCase(repo)
    this.createProductUseCase = new CreateProductUseCase(repo)
    this.updateProductUseCase = new UpdateProductUseCase(repo)
    this.deleteProductUseCase = new DeleteProductUseCase(repo)

    this.createCampaignUseCase = new CreateCampaignUseCase(repo)
    this.updateCampaignUseCase = new UpdateCampaignUseCase(repo)
    this.publishCampaignUseCase = new PublishCampaignUseCase(repo)
    this.deleteCampaignUseCase = new DeleteCampaignUseCase(repo)
  }

  static getInstance(httpClient: HttpClient) {
    if (!DashboardContainer.instance) {
      DashboardContainer.instance = new DashboardContainer(httpClient)
    }
    return DashboardContainer.instance
  }
}