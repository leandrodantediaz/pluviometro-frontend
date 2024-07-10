import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { muiTheme } from '../src/muiTheme/theme';
import { APIProvider } from '@vis.gl/react-google-maps';

const googleApiKey = process.env.GOOGLE_API_KEY;

export const AllTheProviders = ({ children }) => {
	return (
		<ThemeProvider theme={muiTheme}>
			<Router>
				<APIProvider version="quarterly" apiKey={googleApiKey}>
					{children}
				</APIProvider>
			</Router>
		</ThemeProvider>
	)
};

const customRender = (ui, options) => render(
	ui, { wrapper: AllTheProviders, ...options },
);

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
