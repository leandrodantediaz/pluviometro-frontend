import { SEND_MAIL_CHANGE_PASSWORD } from '../../../mutations/sendMailChangePassword/sendMailChangePassword';

export const sendMailChangePasswordMocks = [
  {
    request: {
      query: SEND_MAIL_CHANGE_PASSWORD,
      variables: {
        toEmail: 'validemail@example.com',
      }
    },
    result: {
      data: {
        sendMailChangePassword: 'Correo electrónico enviado exitosamente'
      }
    }
  }
];
