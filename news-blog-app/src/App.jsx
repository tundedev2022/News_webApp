import News from './Component/News'
import Blogs from './Component/Blogs'
import { useEffect, useState } from 'react'

const App = () => {
  const [showNews, setShowNews] = useState(true)
  const [showBlogs, setShowBlogs] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditing,setIsEditing ] = useState(false)


  useEffect(() => {
      const savedBlogs = JSON.parse(localStorage.getItem('blogs')) || []
      setBlogs(savedBlogs)
  },[])

  const handleCreateBlog = (newBlog, isEdit) => {
    setBlogs((prevBlogs) => {
      const upDatedBlogs = isEdit ? prevBlogs.map((blogs) =>(blog === selectedPost ? newBlog: blog))
     : [...prevBlogs, newBlog]
      localStorage.setItem('blogs',JSON.stringify (upDatedBlogs))
      return upDatedBlogs
    }) 
    setIsEditing(false)
    setSelectedPost(null) 
  }

  const  handleEditBlog = (blog) =>{
    setSelectedPost(blog)
    setIsEditing(true)
    setShowNews(false)
    setShowBlogs(true)
  }
  const handleDeleteBlog = (blogToDelete) =>{
    setBlogs((prevBlogs) =>{
      const upDatedBlogs = prevBlogs.filter((blog)=>blog
    !== blogToDelete)
    localStorage.setItem("blogs", JSON.stringify
      (upDatedBlogs))
      return upDatedBlogs
    })
    }

  
 
  const handleShowBlogs = () => {
    setShowNews(false)
    setShowBlogs(true)
  }

  const handleBackToNews = () => {
    setShowNews(true)
    setShowBlogs(false)
    setIsEditing(false)
    setSelectedPost(null)

  }

  return (
    <div className='container'>
      <div className='news-blog-app'>
        {showNews && <News onShowBlogs={handleShowBlogs} blogs={blogs} onEditBlog={handleEditBlog} onDeleteBlog={handleDeleteBlog} />}
        {showBlogs && (
          <Blogs 
          onBack={handleBackToNews} 
          onCreateBlog={handleCreateBlog}
           editPost={selectedPost} isEditing={isEditing}/>
 )}
      </div>
    </div>
  )
}

export default App
