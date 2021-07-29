const Parser = require('rss-parser')
const parser = new Parser()
const superagent = require('superagent')
const cheerio = require('cheerio')

const get_news = async (req, res) => {
	const rssURL = 'https://finance.detik.com/rss'

	try {
		const feed = await parser.parseURL(rssURL)
		const rssFeed = feed.items

		let payload = []

		for (let i = 0; i < rssFeed.length; i++) {
			if(i < 5) {
				try {
					const load = await superagent.get(rssFeed[i].link)
					const $ = cheerio.load(load.text)

					const newsTitle = $('.detail__title').map((i, section)=>{
						const title = $(section).text()
						return title.trim()

					}).get()

					const newsImage = $('.detail__media-image').map((i, section) => {
						const image = $(section).find('img')
						return image.attr('src')

					}).get()

					const newsBody = $('.detail__body itp_bodycontent_wrapper').map((i, section) => {
						const body = $(section).find('p')
						return body.html()
					}).get()

					const objPayload = {
						news_title: newsTitle[0],
						image: newsImage[0],
						body: newsBody
					}

					payload.push(objPayload)

				} catch(err) {
					console.log(err)
				}
			}

		}

		return res.status(200).send({
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