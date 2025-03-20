# -------------------------
# 1) 빌드 스테이지 (Builder)
# -------------------------
    FROM node:20-slim AS builder

    WORKDIR /app
    
    # pnpm 전역 설치
    RUN npm install -g pnpm
    COPY .npmrc .npmrc
    # package.json과 pnpm-lock.yaml 복사 (pnpm을 사용할 경우 lockfile은 pnpm-lock.yaml이어야 합니다)
    COPY package.json pnpm-lock.yaml ./
    
    # pnpm을 사용하여 종속성 설치 (잠긴 버전 사용)
    RUN pnpm install --frozen-lockfile
    
    # 나머지 소스 복사
    COPY . .
    
    # 배포 환경 변수 파일 복사 (필요한 경우)
    COPY .env.test .env.test
    
    # Next.js 빌드 (프로젝트에 맞게 스크립트 수정)
    RUN pnpm run build
    
    # -------------------------
    # 2) 런타임 스테이지 (Runtime)
    # -------------------------
    FROM node:20-slim AS runtime
    
    WORKDIR /app
    
    # 런타임에 필요한 종속성만 복사 (빌드 스테이지에서 설치된 node_modules, .next 등)
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./
    
    # 환경변수 설정
    ENV NODE_ENV=production
    ENV PORT=3000
    
    EXPOSE 3000
    
    # pnpm으로 애플리케이션 실행
    CMD ["pnpm", "start"]
    