// path: src/lib/api.ts
import {
  AuthApi,
  UsersApi,
  AdminApi,
  Configuration,
  OAuth2Api,
  AppsApi,
  SubscriptionsApi
} from '@/client/iam'
import { PostsApi, CategoriesApi } from '@/client/posts'
import { DocsApi, MediaAssetsApi, CategoriesApi as CatApi } from '@/client/docs'
import {
  AssetsApi,
  BacktestResultsApi,
  BacktestsApi,
  StrategiesApi,
  WatchlistsApi,
  YahooFinanceApi,
} from '@/client/quant'
import {
  CommunitiesApi,
  AlertsApi,
  LocationsApi,
  SafezonesApi,
} from '@/client/locations'

import Cookies from 'js-cookie'

// ✅ 유틸리티 함수로 공통 로직 통합
const createConfig = (basePath: string) => {
  return new Configuration({
    basePath,
    baseOptions: {
      headers: {
        Authorization: Cookies.get('access_token')
          ? `Bearer ${Cookies.get('access_token')}`
          : '',
      },
    },
  })
}

// ✅ 설정 객체 생성 (오류 수정)
const iamConfiguration = createConfig(process.env.NEXT_PUBLIC_IAM_API_URL!)
const postsConfiguration = createConfig(process.env.NEXT_PUBLIC_POSTS_API_URL!)
const docsConfiguration = createConfig(process.env.NEXT_PUBLIC_DOCS_API_URL!)
const locationsConfiguration = createConfig(process.env.NEXT_PUBLIC_LOCATIONS_API_URL!)
const quantConfiguration = createConfig(process.env.NEXT_PUBLIC_QUANT_API_URL!)

// ✅ API 서비스 그룹화
export const AuthService = new AuthApi(iamConfiguration)
export const UsersService = new UsersApi(iamConfiguration)
export const AdminService = new AdminApi(iamConfiguration)
export const OAuthService = new OAuth2Api(iamConfiguration)
export const AppsService = new AppsApi(iamConfiguration)
export const SubscriptionsService = new SubscriptionsApi(iamConfiguration)


export const PostService = new PostsApi(postsConfiguration)
export const CategoryService = new CategoriesApi(postsConfiguration)

export const DocsService = new DocsApi(docsConfiguration)
export const CatService = new CatApi(docsConfiguration)
export const MediaAssetsService = new MediaAssetsApi(docsConfiguration)

export const CommunitiesService = new CommunitiesApi(locationsConfiguration)
export const AlertsService = new AlertsApi(locationsConfiguration)
export const LocationsService = new LocationsApi(locationsConfiguration)
export const SafezonesService = new SafezonesApi(locationsConfiguration)

export const AssetsService = new AssetsApi(quantConfiguration)
export const BacktestResultsService = new BacktestResultsApi(quantConfiguration)
export const BacktestsService = new BacktestsApi(quantConfiguration)
export const StrategiesService = new StrategiesApi(quantConfiguration)
export const WatchlistsService = new WatchlistsApi(quantConfiguration)
export const YahooFinanceService = new YahooFinanceApi(quantConfiguration)

// ✅ 공통 응답 인터페이스
export interface ApiResponse<T> {
  data: T
  message: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}


export class API {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static uploadImage = async (_file: File) => {
    console.log('Image upload is disabled in the demo... Please implement the API.uploadImage method in your project.')
    await new Promise(r => setTimeout(r, 500))
    return '/placeholder-image.jpg'
  }
}