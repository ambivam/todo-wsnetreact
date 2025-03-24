import React from 'react';
import { TodoList } from './components/TodoList';
import { Container, Typography, CssBaseline } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mt: 4 }}>
          Todo App
        </Typography>
        <TodoList />
      </Container>
    </>
  );
}

export default App;
