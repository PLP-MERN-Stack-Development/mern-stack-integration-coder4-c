import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import CategoriesPage from './pages/CategoriesPage';
import './App.css'

function App() {
return (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<PostDetailPage />} />
      <Route path="/create" element={<CreatePostPage />} />
      <Route path="/edit/:id" element={<CreatePostPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
    </Routes>
  </Router>
)
}

export default App