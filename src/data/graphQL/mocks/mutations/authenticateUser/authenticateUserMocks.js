import { AUTHENTICATE_USER } from '../../../mutations/authenticateUser/authenticateUser';

export const authenticateUserMocks = [
  {
    request: {
      query: AUTHENTICATE_USER,
      variables: {
        email: 'validemail@example.com',
        password: 'Validpassword123'
      }
    },
    result: {
      data: {
        authenticateUser: {
          user: {
            id: 2,
            fullName: 'Jonh Doe',
          },
          token: 'token'
        }
      }
    }
  },
  {
    request: {
      query: AUTHENTICATE_USER,
      variables: {
        email: 'invalidemail@example.com',
        password: 'invalidpassword',
      },
    },
    result: {
      errors: [
        {
          message:
            'Email desconocido o contraseña incorrecta, por favor vuelva a intentarlo.',
        },
      ],
    },
  }
];
