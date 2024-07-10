
import TokenService from './TokenService';
import UserService from './UserService';

class AuthService {
  static login(token, user) {
    TokenService.setToken(token);
    UserService.setUser(user);
  }

  static logout() {
    TokenService.clearToken();
    UserService.clearUser();
  }

  static isAuthenticated() {
    return TokenService.isAuthenticated();
  }
}

export default AuthService;
