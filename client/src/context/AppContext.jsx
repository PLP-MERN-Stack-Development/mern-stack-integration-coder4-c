import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { postService, categoryService, authService } from '../services/api';

// Initial state
const initialState = {
  posts: [],
  categories: [],
  pagination: null,
  user: authService.getCurrentUser(),
  loading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_POSTS: 'SET_POSTS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_POST: 'ADD_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  SET_CATEGORIES: 'SET_CATEGORIES',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_POSTS:
      return { ...state, posts: action.payload, loading: false, error: null };
    case ACTIONS.SET_PAGINATION:
      return { ...state, pagination: action.payload };
    case ACTIONS.ADD_POST:
      return { ...state, posts: [action.payload, ...state.posts] };
    case ACTIONS.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case ACTIONS.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
      };
    case ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload, loading: false, error: null };
    case ACTIONS.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] };
    case ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(category =>
          category._id === action.payload._id ? action.payload : category
        ),
      };
    case ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload),
      };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const fetchPosts = async (page = 1, limit = 10, category = null) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await postService.getAllPosts(page, limit, category);
      dispatch({ type: ACTIONS.SET_POSTS, payload: response.data.data });
      dispatch({ type: ACTIONS.SET_PAGINATION, payload: response.data.pagination });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const searchPosts = async (query) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await postService.searchPosts(query);
      dispatch({ type: ACTIONS.SET_POSTS, payload: response.data.data });
      dispatch({ type: ACTIONS.SET_PAGINATION, payload: null }); // No pagination for search
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const createPost = async (postData) => {
    // Optimistic update: add post immediately
    const tempPost = {
      ...postData,
      _id: `temp-${Date.now()}`, // Temporary ID
      createdAt: new Date().toISOString(),
      category: state.categories.data?.find(cat => cat._id === postData.category),
      author: { name: 'You' }, // Mock
    };
    dispatch({ type: ACTIONS.ADD_POST, payload: tempPost });

    try {
      const response = await postService.createPost(postData);
      // Replace temp post with real one
      dispatch({ type: ACTIONS.UPDATE_POST, payload: response.data });
      return response.data;
    } catch (error) {
      // Revert optimistic update
      dispatch({ type: ACTIONS.DELETE_POST, payload: tempPost._id });
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updatePost = async (id, postData) => {
    // Find current post for revert
    const currentPost = state.posts.find(p => p._id === id);
    // Optimistic update
    const optimisticPost = { ...currentPost, ...postData };
    dispatch({ type: ACTIONS.UPDATE_POST, payload: optimisticPost });

    try {
      const response = await postService.updatePost(id, postData);
      dispatch({ type: ACTIONS.UPDATE_POST, payload: response.data });
      return response.data;
    } catch (error) {
      // Revert to original
      dispatch({ type: ACTIONS.UPDATE_POST, payload: currentPost });
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deletePost = async (id) => {
    // Find post for revert
    const postToDelete = state.posts.find(p => p._id === id);
    // Optimistic update
    dispatch({ type: ACTIONS.DELETE_POST, payload: id });

    try {
      await postService.deletePost(id);
    } catch (error) {
      // Revert: add back
      dispatch({ type: ACTIONS.ADD_POST, payload: postToDelete });
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchCategories = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await categoryService.getAllCategories();
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: response.data.data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      dispatch({ type: ACTIONS.ADD_CATEGORY, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      dispatch({ type: ACTIONS.UPDATE_CATEGORY, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: id });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      dispatch({ type: ACTIONS.SET_USER, payload: response.user });
      return response;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: ACTIONS.LOGOUT });
  };

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
  }, []);

  const value = {
    ...state,
    fetchPosts,
    searchPosts,
    createPost,
    updatePost,
    deletePost,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook to use context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}