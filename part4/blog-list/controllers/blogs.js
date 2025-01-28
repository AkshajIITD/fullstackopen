const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response,next) => {
    
    const blogs = await Blog.find({})
    logger.info("get request for blogs")
    response.json(blogs)
    
})
  
blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)

    const savedBlog = await blog.save()
    logger.info("blog saved")
    response.status(201).json(savedBlog)
})

module.exports = blogsRouter