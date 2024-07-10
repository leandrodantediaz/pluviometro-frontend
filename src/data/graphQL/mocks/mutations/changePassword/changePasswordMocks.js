import { CHANGE_PASSWORD } from '../../../mutations/changePassword/changePassword';

export const changePasswordMocks = [
  {
    request: {
      query: CHANGE_PASSWORD,
      variables: {
        password: 'Password123',
      }
    },
    result: {
      data: {
        changePassword: {
          id: 1
        }
      }
    }
  }
];
