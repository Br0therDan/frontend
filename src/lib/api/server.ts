// src/lib/api/server.ts
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
  import { cookies } from 'next/headers'
  
  /**
   * SSR 전용 비동기 토큰 함수
   */
  export const getAccessTokenSSR = async (): Promise<string> => {
    const cookieStore = await cookies()
    return cookieStore.get('access_token')?.value || ''
  }
  
  /**
   * SSR 전용 Axios 인스턴스
   * (SSR 코드 내에서 API 요청 시 사용)
   */
  const axiosInstance = axios.create()
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = await getAccessTokenSSR()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )
  
  /**
   * SSR 전용 API 설정 생성 (비동기)
   * SSR 페이지나 API 핸들러에서 토큰이 필요할 때 사용합니다.
   */
  export const createSSRConfig = async (basePath: string): Promise<Configuration> => {
    const token = await getAccessTokenSSR()
    return new Configuration({
      basePath,
      baseOptions: {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    })
  }
  
  // SSR 환경에서 사용할 API 설정을 생성하는 함수들
  export const createIamSSRConfig = async (): Promise<Configuration> =>
    createSSRConfig(process.env.NEXT_PUBLIC_IAM_API_URL!)
  export const createPostsSSRConfig = async (): Promise<Configuration> =>
    createSSRConfig(process.env.NEXT_PUBLIC_POSTS_API_URL!)
  export const createDocsSSRConfig = async (): Promise<Configuration> =>
    createSSRConfig(process.env.NEXT_PUBLIC_DOCS_API_URL!)
  export const createKidsSSRConfig = async (): Promise<Configuration> =>
    createSSRConfig(process.env.NEXT_PUBLIC_KIDS_API_URL!)
  export const createQuantSSRConfig = async (): Promise<Configuration> =>
    createSSRConfig(process.env.NEXT_PUBLIC_QUANT_API_URL!)
  
  // --- 아래는 SSR 환경에서 top-level await가 허용된 경우 (Next.js 13의 서버 컴포넌트 등)
  // 만약 top-level await 사용이 불가능하다면, API 서비스 인스턴스를 생성하는 함수를 별도로 export 하여 호출할 수 있습니다.
  
  const iamConfiguration = await createIamSSRConfig()
  const postsConfiguration = await createPostsSSRConfig()
  const docsConfiguration = await createDocsSSRConfig()
  const kidsConfiguration = await createKidsSSRConfig()
  const quantConfiguration = await createQuantSSRConfig()
  
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
  