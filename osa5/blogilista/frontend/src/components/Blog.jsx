import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [showDetails, setShowDetails] = useState(false)


  const blogStyle = {
    paddingTop: 3,
    paddingLeft: 3,
    paddingBottom: 3,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 3
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}&nbsp;
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={() => handleLike(blog.id)}>Like</button>
          </div>
          <div>{blog.user.name}</div>
          <div>
            {user.username === blog.user.username && (
              <button onClick={() => handleDelete(blog.id)}>Delete</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
