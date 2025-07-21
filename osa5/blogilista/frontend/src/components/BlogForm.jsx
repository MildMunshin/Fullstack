const BlogForm = ({ addBlog, newTitle, newAuthor, newUrl, handleTitleChange, handleAuthorChange, handleUrlChange }) => (
  <form onSubmit={addBlog}>
    <div>
      Title: <input value={newTitle} onChange={handleTitleChange} />
    </div>
    <div>
      Author: <input value={newAuthor} onChange={handleAuthorChange} />
    </div>
    <div>
      Url: <input value={newUrl} onChange={handleUrlChange} />
    </div>
    <button type="submit">add</button>
  </form>
)

export default BlogForm