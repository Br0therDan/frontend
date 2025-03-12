// path: src/lib/api.ts
import {
  AuthApi,
  UsersApi,
  AdminApi,
  Configuration,
  OAuth2Api,
} from '@/client/iam'
import { PostsApi, CategoriesApi } from '@/client/blog'
import { DocsApi, CategoriesApi as CatApi } from '@/client/docs'
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
} from '@/client/kids'

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
const blogConfiguration = createConfig(process.env.NEXT_PUBLIC_BLOG_API_URL!)
const docsConfiguration = createConfig(process.env.NEXT_PUBLIC_DOCS_API_URL!)
const kidsConfiguration = createConfig(process.env.NEXT_PUBLIC_KIDS_API_URL!)
const quantConfiguration = createConfig(process.env.NEXT_PUBLIC_QUANT_API_URL!)

// ✅ API 서비스 그룹화
export const AuthService = new AuthApi(iamConfiguration)
export const UsersService = new UsersApi(iamConfiguration)
export const AdminService = new AdminApi(iamConfiguration)
export const OAuthService = new OAuth2Api(iamConfiguration)

export const PostService = new PostsApi(blogConfiguration)
export const CategoryService = new CategoriesApi(blogConfiguration)

export const DocsService = new DocsApi(docsConfiguration)
export const CatService = new CatApi(docsConfiguration)

export const CommunitiesService = new CommunitiesApi(kidsConfiguration)
export const AlertsService = new AlertsApi(kidsConfiguration)
export const LocationsService = new LocationsApi(kidsConfiguration)
export const SafezonesService = new SafezonesApi(kidsConfiguration)

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
