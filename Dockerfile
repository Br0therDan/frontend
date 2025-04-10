# -------------------------
# 1) 빌드 스테이지 (Builder)
# -------------------------
    FROM node:20-slim AS build-stage

    WORKDIR /app
    
    # pnpm 전역 설치
    COPY .npmrc .npmrc

    COPY package.json pnpm-lock.yaml /app/
    
    # 종속성 설치 (잠긴 버전 사용)
    RUN pnpm install --frozen-lockfile
    
    # 나머지 소스 복사
    COPY ./ /app/
    
    # # 빌드 아규먼트로 환경 파일 선택 (기본값: .env.production)
    # ARG ENV_FILE=.env.test
    # # 해당 환경 파일을 .env로 복사
    # COPY ${ENV_FILE} .env
    
    # Next.js 빌드
    RUN pnpm run build
    
    # -------------------------
    # 2) 런타임 스테이지 (Runtime)
    # -------------------------
    FROM node:20-slim AS runtime
    
    WORKDIR /app
    
    # 빌드 결과물 복사
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./
    
    # 환경변수 설정
    ENV NODE_ENV=production
    ENV PORT=3000
    
    EXPOSE 3000
    
    CMD ["pnpm", "start"]
    