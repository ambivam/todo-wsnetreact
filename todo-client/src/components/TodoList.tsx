import React, { useState, useEffect } from 'react';
import { 
    List, ListItem, ListItemText, ListItemSecondaryAction,
    IconButton, Checkbox, TextField, Button, Box, Paper,
    Select, MenuItem, FormControl, InputLabel,
    Chip, Stack, Typography, SelectChangeEvent,
    Alert, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios, { AxiosError } from 'axios';
import { Todo, categories } from '../types/Todo';

const API_BASE_URL = 'http://localhost:5141/api';

const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string; details?: string }>;
        if (axiosError.response?.data) {
            return axiosError.response.data.details || axiosError.response.data.error || axiosError.message;
        }
        return axiosError.message;
    }
    return 'An unexpected error occurred';
};

export const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Work');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/todo`);
            console.log('API Response:', response.data);
            setTodos(response.data);
            setError(null);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error details:', error);
            setError(`Failed to fetch todos: ${errorMessage}`);
        }
    };

    const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/todo`, {
                title: newTodo,
                isCompleted: false,
                category: selectedCategory
            });
            console.log('Add todo response:', response.data);
            setNewTodo('');
            fetchTodos();
            setError(null);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error adding todo:', error);
            setError(`Failed to add todo: ${errorMessage}`);
        }
    };

    const toggleTodo = async (todo: Todo) => {
        try {
            await axios.put(`${API_BASE_URL}/todo/${todo.id}`, {
                ...todo,
                isCompleted: !todo.isCompleted
            });
            fetchTodos();
            setError(null);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error updating todo:', error);
            setError(`Failed to update todo: ${errorMessage}`);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await axios.delete(`${API_BASE_URL}/todo/${id}`);
            fetchTodos();
            setError(null);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error deleting todo:', error);
            setError(`Failed to delete todo: ${errorMessage}`);
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value);
    };

    const filteredTodos = filterCategory === 'all' 
        ? todos
        : todos.filter(todo => todo.category === filterCategory);

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 2 }}>
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Paper elevation={3} sx={{ p: 2 }}>
                <Box component="form" onSubmit={addTodo} sx={{ marginBottom: 2 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            value={newTodo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
                            placeholder="Add a new todo"
                            variant="outlined"
                            size="small"
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                label="Category"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Add
                        </Button>
                    </Stack>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Filter by Category:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                            label="All"
                            onClick={() => setFilterCategory('all')}
                            color={filterCategory === 'all' ? 'primary' : 'default'}
                            clickable
                        />
                        {categories.map((category) => (
                            <Chip
                                key={category}
                                label={category}
                                onClick={() => setFilterCategory(category)}
                                color={filterCategory === category ? 'primary' : 'default'}
                                clickable
                            />
                        ))}
                    </Stack>
                </Box>

                <List>
                    {filteredTodos.map((todo) => (
                        <ListItem 
                            key={todo.id} 
                            dense
                            sx={{
                                bgcolor: 'background.paper',
                                mb: 1,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Checkbox
                                edge="start"
                                checked={todo.isCompleted}
                                onChange={() => toggleTodo(todo)}
                            />
                            <ListItemText
                                primary={todo.title}
                                secondary={todo.category}
                                sx={{
                                    textDecoration: todo.isCompleted ? 'line-through' : 'none'
                                }}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};
