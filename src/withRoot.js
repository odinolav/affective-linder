import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {blue, red} from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    secondary: {
      light: red[300],
      main: red[500],
      dark: red[700],
    },
  },
  typography: {
    useNextVariants: true,
    fontSize: 12,
  },
  type: 'light',
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
