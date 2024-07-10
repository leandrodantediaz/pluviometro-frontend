export const USER_KEY = 'user';

class UserService {
  static setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static clearUser() {
    localStorage.removeItem(USER_KEY);
  }
}

export default UserService;
