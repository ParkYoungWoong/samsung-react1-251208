import axios from 'axios'

export const ACCESS_TOKEN_NAME = 'token'
const REFRESH_URL = '/auth/refresh'
const SIGNIN_URL = '/signin'

const options = {
  baseURL: 'https://api.heropy.dev/v1',
  headers: {
    'Content-Type': 'application/json',
    apikey: 'jm5a2zKJjrJZOLafFNzVCX7JOobxOTs3'
  }
}

// 요청/응답 인터셉터에서의 순환 참조를 방지하기 위해 Refresh API를 따로 생성
const api = axios.create(options)
const refresh = axios.create({
  ...options,
  withCredentials: true
})

// 요청 인터셉터
api.interceptors.request.use(
  req => {
    // 요청 전 헤더에 액세스 토큰 추가
    const accessToken = localStorage.getItem(ACCESS_TOKEN_NAME)
    if (accessToken) req.headers.Authorization = `Bearer ${accessToken}`
    return req
  },
  err => Promise.reject(err)
)

// 응답 인터셉터
api.interceptors.response.use(
  res => res,
  async err => {
    const req = err.config // 요청 정보

    // 인증 에러(401) 및 재시도 방지 확인
    if (err.response.status === 401 && !req._retry) {
      req._retry = true // 재시도 방지 설정

      try {
        // 리프레시 토큰(Http-only 쿠키)으로 새 액세스 토큰 발급 요청
        const res = await refresh.post(REFRESH_URL)

        // 새 액세스 토큰 저장 및 원래 요청 재시도
        localStorage.setItem(ACCESS_TOKEN_NAME, res.data[ACCESS_TOKEN_NAME])
        return api(req)
      } catch (refreshErr) {
        // 리프레시 토큰이 만료된 경우, 로그인 페이지로 리디렉션
        localStorage.removeItem(ACCESS_TOKEN_NAME)
        // window.location.href = SIGNIN_URL // 사용자를 로그인 페이지로 강제 이동
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(err)
  }
)

export default api