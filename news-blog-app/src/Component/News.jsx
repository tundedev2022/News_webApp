import { useEffect, useState } from 'react'
import Weather from './Weather'
import Calendar from './Calendar'
import './News.css'
import userImg from '../assets/Images/user.jpg'
import techImg from '../assets/Images/tech.jpg'
import healthImg from '../assets/Images/health.jpg'
import nationImg from '../assets/Images/nation.jpg'
import scienceImg from '../assets/Images/science.jpg'
import letterImg from '../assets/Images/letter.jpg'
import NewsModal from './NewsModal'
import Bookmarks from './Bookmarks'
import BlogsModal from './BlogsModal'
import axios from 'axios'


const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

const categories = [
  "general", "world", "business", "technology",
   "entertainment", "sports", "science" , "health", "nation",
]

const News = ({onShowBlogs, blogs, onEditBlog, onDeleteBlog}) => {
  const [headline, setHeadline] = useState(null)
  const [news, setNews] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState ('')
  const [showModal, setShowModal] = useState (false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [ShowbookmarksModal, setShowBookmarksModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showBlogModal, setShowBlogModal] = useState(false)


  useEffect(() => {
    const controller = new AbortController();
  
    const fetchNews = async () => {
      try {
        let url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&apikey=${API_KEY}`;
        
        if (searchQuery) {
          url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&apikey=${API_KEY}`;
        }
  
        const response = await axios.get(url, { signal: controller.signal });
        const fetchedNews = response.data.articles.map(article => ({
          ...article,
          image: article.image || techImg,
        }));
  
        setHeadline(fetchedNews[0]);
        setNews(fetchedNews.slice(1, 7));

        const saveBookmarks = JSON.parse(localStorage.getItem(bookmarks)) || []
        setBookmarks(saveBookmarks)
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error(error);
        }
      }
    };
  
    fetchNews();
  
    return () => controller.abort(); // Cleanup function
  }, [selectedCategory, searchQuery]);
  
  useEffect(() => {
    console.log(news);
  }, [news]); // Logs news only after it's updated
  
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);
  }, []);
  


  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    if (category !== selectedCategory) setSelectedCategory(category);
  };
  

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() === "") return;
    setSearchQuery(searchInput);
    setSearchInput(""); // Properly resets the input field
  };
  

  const handleArticleClick = (article) =>{
    setSelectedArticle(article)
    setShowModal(true)
    console.log(article)  
  }
  const handleBookmarkClick = (article) => {
    setBookmarks((prevBookmarks) => {
      let updatedBookmarks;
      if (prevBookmarks.some((bookmark) => bookmark.title === article.title)) {
        updatedBookmarks = prevBookmarks.filter((bookmark) => bookmark.title !== article.title);
      } else {
        updatedBookmarks = [...prevBookmarks, article]; // Fix the spread operation
      }
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };
  const handleBlogClick = (blog) =>{
    setSelectedPost(blog)
    setShowBlogModal(true)
  }
  const closedBlogModal = () =>{
      setShowBlogModal(false)
      setSelectedPost(null)
  }
  

  return (
    <div className="news">
      <header className="news-header">
        <h1 className="logo">News & Blogs</h1>

        <div className="search-bar">

          <form onSubmit={handleSearch} >
            <input type="text" placeholder='Search News...' value={searchInput} onChange={(e) =>setSearchInput(e.target.value)} />
            <button type='submit'>
              <i className='fa-solid
              fa-magnifying-glass'></i>
            </button>
          </form>
        </div>

      </header>
      <div className="news-content">
        <div className="navbar">
          <div className="user" onClick={onShowBlogs}>
            <img src={userImg} alt="Use - Image" />
            <p> Mary's Blog</p>
          </div>

          <nav className="categories">
            <h1 className="nav-heading">Categories</h1>
            <div className="nav-links">
              {categories.map((category) =>(
                 <a href="#"  key={category}
                 className='nav-link' onClick={(e) =>handleCategoryClick(e, category)}>{category}</a>

              ))}
              <a href="#" className='nav-link' onClick={() =>setShowBookmarksModal(true)}>Bookmarks <i 
              className="fa-solid fa-bookmark"></i> 
              </a>
            </div>
          </nav>
        </div>

        <div className="news-section">
          {headline && (
             <div className="headline" onClick={() => handleArticleClick(headline)} >
             <img src={headline.image || techImg} alt= {headline.title} />
             <h2 className="headline-title">
              {headline.title}
              <i
             className={`fa-${bookmarks.some((bookmark) => bookmark.title === headline.title) ? 'solid' : 'regular'} fa-bookmark bookmark`}
              onClick={(e) => {
             e.stopPropagation();
             handleBookmarkClick(headline);
            }}
            ></i>

             </h2>
             
           </div>
          )}
         
          <div className="news-grid">
            {news.map((article, index) => (
                 <div key={index} className="news-grid-item"
                 
                 onClick={() => handleArticleClick(article)}>
                 <img src={article.image || techImg} alt= {article.title} />
                 <h3>{article.title}
                 <i
              className={`fa-${bookmarks.some((bookmark) => bookmark.title === article.title) ? 'solid' : 'regular'} fa-bookmark bookmark`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkClick(article);
                }}
              ></i>

                 </h3>
               </div>
            ))}
          </div>
        </div>

        {selectedArticle && <NewsModal show={showModal} article={selectedArticle} onClose={() => setShowModal(false)} />}

          <Bookmarks 
          show={ShowbookmarksModal}
          bookmarks={bookmarks}
          onClose={() =>setShowBookmarksModal(false)}
          onSelectedArticle={handleArticleClick}
          onDeleteBookmark={handleBookmarkClick}
          />


        {/* <NewsModal show={showModal} article={selectedArticle} onClose={() => setShowModal(false)} /> */}

        <div className="my-blogs">
          <h1 className="my-blogs-heading">My Blogs</h1>
            
            <div className="blog-posts">
              {blogs.map((blogs, index) =>(
                <div key={index}
                className='blog-post' onClick={()=>handleBlogClick(blog)}>
                    <img src={blogs.image || letterImg} alt={blogs.title} />
                    <h3>{blogs.title}</h3>
                    <p>{blogs.content}</p>
                    <div className="post-buttons">
                  <button className="edit-post" onClick={()=>onEditBlog(blog)}>

                    <i className="bx bxs-edit"></i>
                  </button>
                  <button className="delete-post"
                   onClick={(e)=>{
                    e.stopPropagation()
                    onDeleteBlog(blogs)}
                  }
                    >
                       <i className="bx bxs-x-circle"></i>
                  </button>
                </div>
                </div>
              ))}  
            </div>
            {selectedPost && showBlogModal && (
              <BlogsModal show={showBlogModal} blog={selectedPost} onClose={closedBlogModal} />
            )} 
           
        </div>
        <div className="weather-calendar">
        <Weather />
        <Calendar />

        </div>
        
      </div> 

      <footer className="news-footer">
        <p>
          <span>News & Blogs App</span>
        </p>
        <p>
        <span>&copy; All Right Reserved. By Tunde9_Dev</span>

        </p>
</footer>
    </div>
  )
}
export default News
