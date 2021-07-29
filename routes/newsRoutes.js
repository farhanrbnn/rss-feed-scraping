const express = require('express')
const router = express.Router()

const newsController = require('../controller/newsController')

router.get('/news', newsController.get_news)

module.exports = router