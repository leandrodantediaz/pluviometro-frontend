export const TOKEN_TYPE_KEY = 'token_type';
export const ACCESS_TOKEN_KEY = 'access_token';

class TokenService {
  static setToken(token) {
    localStorage.setItem(TOKEN_TYPE_KEY, 'Bearer ');
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
  
  static getToken() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const tokenType = localStorage.getItem(TOKEN_TYPE_KEY);
    return token && tokenType ? `${tokenType}${token}` : null;
  }
  
  static clearToken() {
    localStorage.removeItem(TOKEN_TYPE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
  
  static isAuthenticated() {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
}
  
export default TokenService;
  
