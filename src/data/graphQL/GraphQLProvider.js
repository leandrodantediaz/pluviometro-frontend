/* eslint-disable no-undef */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import TokenService from '../services/TokenService';
import toastService from '../../uiServices/ToastService';

const baseURL = process.env.BASE_API_URL;

const httpLink = createUploadLink({
  uri: `${baseURL}graphql/`,
});

const headersLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: TokenService.getToken(),
      'Access-Control-Allow-Origin': '*',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      toastService.showError(message);
    });
  }
  if (networkError) {
    toastService.showError('Error de conexión, por favor reintenta más tarde.');
  }
});

export class GraphQLProvider {
  constructor() {
    this.apolloInstance = new ApolloClient({
      cache: new InMemoryCache(),
      link: errorLink.concat(headersLink.concat(httpLink)),
    });
  }

  static clearCache(client) {
    client.clearStore();
  }
}
