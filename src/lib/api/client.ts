// src/lib/api/client.ts
import {
    AuthApi,
    UsersApi,
    AdminApi,
    Configuration,
    OAuth2Api,
  } from '@/client/iam'
  import { PostsApi, CategoriesApi } from '@/client/posts'
  import { DocsApi, MediaAssetsApi, AppsApi, CategoriesApi as CatApi } from '@/client/docs'
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
  
  import axios from 'axios'
  import Cookies from 'js-cookie'
  
  /**
   * 클라이언트(CSR) 전용 동기 토큰 함수
   */
  export const getAccessTokenClient = (): string => {
    return Cookies.get('access_token') || ''
  }
  
  /**
   * Axios 인스턴스 (클라이언트용)
   */
  const axiosInstance = axios.create()
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAccessTokenClient()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )
  
  /**
   * 클라이언트 전용 API 설정 생성 (동기)
   */
  const createConfig = (basePath: string): Configuration => {
    const token = getAccessTokenClient()
    return new Configuration({
      basePath,
      baseOptions: {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    })
  }
  
  // 설정 객체 생성 (동기)
  const iamConfiguration = createConfig(process.env.NEXT_PUBLIC_IAM_API_URL!)
  const postsConfiguration = createConfig(process.env.NEXT_PUBLIC_POSTS_API_URL!)
  const docsConfiguration = createConfig(process.env.NEXT_PUBLIC_DOCS_API_URL!)
  const kidsConfiguration = createConfig(process.env.NEXT_PUBLIC_KIDS_API_URL!)
  const quantConfiguration = createConfig(process.env.NEXT_PUBLIC_QUANT_API_URL!)
  
  // API 서비스 그룹화
  export const AuthService = new AuthApi(iamConfiguration)
  export const UsersService = new UsersApi(iamConfiguration)
  export const AdminService = new AdminApi(iamConfiguration)
  export const OAuthService = new OAuth2Api(iamConfiguration)
  
  export const PostService = new PostsApi(postsConfiguration)
  export const CategoryService = new CategoriesApi(postsConfiguration)
  
  export const DocsService = new DocsApi(docsConfiguration)
  export const CatService = new CatApi(docsConfiguration)
  export const MediaAssetsService = new MediaAssetsApi(docsConfiguration)
  export const AppsService = new AppsApi(docsConfiguration)
  
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
  
  // 공통 응답 인터페이스
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
  
  // 이미지 업로드 유틸리티 (예시)
  export class API {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static uploadImage = async (_file: File): Promise<string> => {
      console.log(
        'Image upload is disabled in the demo... Please implement the API.uploadImage method in your project.'
      )
      await new Promise((r) => setTimeout(r, 500))
      return '/placeholder-image.jpg'
    }
  }
  