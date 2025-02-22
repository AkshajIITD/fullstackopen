const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlog= [
    {
        "title": "Best course for modern web dev",
        "author": "Matt Lukki",
        "url":"fullstackopen.com",
        "likes":"123"
    },
    {
        "title": "video platform",
        "author": "google",
        "url":"youtube.com",
        "likes":"9999"
    }
]

beforeEach( async () => {
    await Blog.deleteMany({})
    let BlogObject = new Blog(initialBlog[0])
    await BlogObject.save()
    BlogObject = new Blog(initialBlog[1])
    await BlogObject.save()
})

test.only('blog is updated by id', async () => {
    const blogToUpdate = await Blog.findOne({ title: 'video platform' })
    const id = blogToUpdate.id
    const initialLikes = blogToUpdate.likes
  
    const updatedBlog = {
      likes: initialLikes + 1
    }
  
    await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await Blog.find({})
    const updatedBlogFromDb = blogsAtEnd.find(blog => blog.id === id)

    assert.strictEqual(updatedBlogFromDb.likes, initialLikes + 1)
  })

test('blog is deleted by id', async () =>{
    const blogToDelete = await Blog.findOne({title : 'video platform' })
    const id = blogToDelete.id
    await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length,initialBlog.length-1)
})

test('unique indentifier property of blogs is named id', async () => {
    const response = await api
    .get('/api/blogs') 
    .expect(200)
    .expect('Content-Type', /application\/json/)

    response.body.forEach(blog =>{
        assert(blog.id)
        assert(!blog._id)
        assert(!blog.__v)
    })
})

test('a valid blog can be added',async () => {
    const newBlog = {
        title : "new blog",
        author : "akshaj",
        url : "none",
        like : 0
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const author= response.body.map(r => r.author)

    assert.strictEqual(response.body.length, initialBlog.length+1)
    assert(author.includes('akshaj'))
})

test('blogs are returned as json', async () => {
    await api 
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('no of blogs ', async() =>{
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
})

after(async () => {
    await mongoose.connection.close()
})