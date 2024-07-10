import { gql } from '@apollo/client';

export const SEND_MAIL_CHANGE_PASSWORD = gql`
  mutation sendMailChangePassword($toEmail: String) {
    sendMailChangePassword(toEmail: $toEmail)
  }
`;
