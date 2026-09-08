import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'Blogitesti',
    author: 'Maija Mehiläinen',
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Blogitesti Maija Mehiläinen')
  expect(element).toBeDefined()
})

test('clicking the "view"-button shows additional info', async () => {
  const blog = {
    title: 'Blogitesti',
    author: 'Maija Mehiläinen',
    url: 'www.omasivu.fi',
    likes: 3,
    user: {
      username: 'maija_666',
      name: 'Maija Mehiläinen'
    },
  }

  render(
    <Blog blog={blog} user={blog.user} />
  )

  screen.debug()

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('www.omasivu.fi')).toBeInTheDocument()
  expect(screen.getByText(/Likes 3/)).toBeInTheDocument()
  expect(screen.getByText('maija_666')).toBeInTheDocument()
})

test('clicking the "Like"-button twice calls event handler twice', async () => {
  const blog = {
    title: 'Blogitesti',
    author: 'Maija Mehiläinen',
    url: 'www.omasivu.fi',
    likes: 3,
    user: {
      username: 'maija_666',
      name: 'Maija Mehiläinen'
    },
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={blog.user} handleLike={mockHandler}/>
  )

  screen.debug()

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

// test('post blog', () => {
//   const blog = {
//     title: 'Neuvostoliitto666',
//     author: 'Matti Klinge',
//     url: 'sivusto.com'
//   }

//   render(<BlogForm (mitä tähän?) />)

//   // const element = screen.getByText('Blogitesti Maija Mehiläinen')
//   // expect(element).toBeDefined()
// })