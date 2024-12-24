const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = ((request,response) => {
    response.status(404).send({error : "unknown endpoint"})
})

const errorHandler= ((error,request,response,next) => {
    logger.info("Error : " , error.message)
    response.status(500).send({error : error.message})
})

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}