const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
    
    const blogs = await Blog.find({})
    logger.info("get request for blogs")
    response.json(blogs)
    
})
  
blogsRouter.post('/', async (request, response,) => {
    const blog = new Blog(request.body)

    const savedBlog = await blog.save()
    logger.info("blog saved")
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request,response) => {
    const id = request.params.id
    console.log(`deleting blog with id : ${id}`)
    const deleteBlog = await Blog.findById(id)
    if(!deleteBlog){
        return response.status(404).json({error : 'blog was already deleted'})
    }
    await Blog.findByIdAndDelete(id)
    return response.status(204).end()
    console.log(`blog with id : ${id} deleted`)
})

blogsRouter.put('/:id', async (request, response) => {
    const likes  = request.body.likes
    const id  = request.params.id
  
    if (likes === undefined) {
      return response.status(400).json({ error: 'Likes must be provided' })
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true })
  
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
  
    response.json(updatedBlog)
  })

module.exports = blogsRouter