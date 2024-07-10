/* eslint-disable no-undef */
import React from 'react';
import { RootPage } from './views/routes/RootPage';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from './muiTheme/theme';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GraphQLProvider } from './data/graphQL/GraphQLProvider';
import { ToastContainer } from 'react-toastify';
import './scss/global-page.scss';
import 'react-toastify/dist/ReactToastify.min.css';

const graphQLProvider = new GraphQLProvider();
const googleApiKey = process.env.GOOGLE_API_KEY;

function App() {
  return (
    <ApolloProvider client={graphQLProvider.apolloInstance}>
      <ThemeProvider theme={muiTheme}>
        <APIProvider version="quarterly" apiKey={googleApiKey}>
          <RootPage />
          <ToastContainer position="bottom-right" />
        </APIProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
