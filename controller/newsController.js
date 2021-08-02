const Parser = require('rss-parser')
const parser = new Parser()
const superagent = require('superagent')
const cheerio = require('cheerio')

const get_news = async (req, res) => {
	const rssURL = 'https://finance.detik.com/rss'
	const page = parseInt(req.query.page)
	const limit = parseInt(req.query.limit)
	const startIndex = (page - 1) * limit
	const endIndex = page * limit

	try {
		const feed = await parser.parseURL(rssURL)
		const rssFeed = feed.items

		let payload = []
		let newsLink = []

		for (let i = 0; i < rssFeed.length; i++) {
			newsLink.push(rssFeed[i].link)
		}

		const linkSlice = newsLink.slice(startIndex, endIndex)

		for (let i = 0; i < linkSlice.length; i++) {
				try {
					const load = await superagent.get(linkSlice[i])
					const $ = cheerio.load(load.text)

					const newsTitle = $('.detail__title').map((i, section) => {
						const title = $(section).text()
						return title.trim()

					}).get()

					const newsImage = $('.detail__media-image').map((i, section) => {
						const image = $(section).find('img')
						return image.attr('src')

					}).get()

					const newsBody = $('.detail__body-text itp_bodycontent').map((i, section) => {
						const body = $(section).text()
						return body

					}).get()

					const newsAuthor = $('.detail__author').map((i, section) => {
						const author = $(section).text()
						return author

					}).get()

					const newsDate = $('.detail__date').map((i, section) => {
						const date = $(section).text()
						return date

					}).get()

					const objPayload = {
						news_title: newsTitle[0],
						image: newsImage[0],
						news_author: newsAuthor[0],
						news_date: newsDate[0]
					}

					payload.push(objPayload)

				} catch(err) {
					return res.status(500).send({
						'error':err
					})
				}

		}

		const paging = {
			next: 'http://localhost:3000/api/v1/news?page='+(page + 1)+'&limit='+limit+'',
			limit: limit
		}

		return res.status(200).send({
			paging,
			payload

		})
		
	} catch (err) {
		return res.status(500).send({
			'error': err
		})
	}
	
}

module.exports = {
	get_news
}