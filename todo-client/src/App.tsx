import React, { useState, useMemo } from 'react';
import { TodoList } from './components/TodoList';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TodoList darkMode={darkMode} setDarkMode={setDarkMode} />
    </ThemeProvider>
  );
}

export default App;
