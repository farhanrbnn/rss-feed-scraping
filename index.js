const express = require('express')
const app = express()
const morgan = require('morgan')

const port = process.env.PORT || 3000

const newsRoute = require('./routes/newsRoutes')

app.use(morgan('dev'))

app.use('/api/v1', newsRoute)

app.listen(port, () => {
  console.log('listening at port', port)
})