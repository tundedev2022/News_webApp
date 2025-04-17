import './NewsModal.css'
import  './Modal.css'
import techImg from '../assets/Images/tech.jpg'


const NewsModal = ({ show, article, onClose }) => {
    if(!show){
        return null
    }
  return (
    <div className='modal-overlay' >
        <div className="modal-content">
            <span className="close-button" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </span>
            {article && (
                <>
                <img src={article.image || techImg} alt={article.title || "News Image"} className='modal-image' />

                  {/* <img src={article.image} alt={article.title} className='modal-image' /> */}
            <h2 className="modal-title">{article.title}</h2>

            {/* <p className="modal-source">Source: {article.source.name}</p> */}
            <p className="modal-source">Source: {article.source?.name || "Unknown"}</p>

            {/* <p className="modal-date">Feb 15 2025, 08:25 PM</p> */}
            <p className="modal-date">{new Date(article.publishedAt).toLocaleString("en-us", {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute : '2-digit',
            })}
            </p>

            <p className="modal-content-text">{article.content}</p>

            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more-link"> Read More  
                </a>
                                        
            {/* <a href="" className="read-more-link">Read More</a> */}
                </>
            )}
          
        </div>
      
    </div>
  )
}

export default NewsModal


