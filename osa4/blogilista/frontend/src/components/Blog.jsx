import { useState } from 'react'

const Blog = ({ blog, user }) => {
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
            likes {blog.likes} <button>like</button>
          </div>
          <div>{user.name}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
