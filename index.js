const FormData = require('form-data')
const fetch    = require('node-fetch')
const NewsAPI  = require('newsapi')
const newsapi  = new NewsAPI(process.env.NEWSAPI_KEY)

const dePostUrl  = 'https://digitaleditorial.com/wp-json/wp/v2/posts'

/**
 * Updates digitaleditorial.com's posts via wordpress v2 REST API with news data from newsapi.org REST API
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 * https://newsapi.org/#documentation
 * https://developer.wordpress.org/rest-api/reference/posts/#definition
 */

exports.updateDigitalEditorial = function updateDigitalEditorial() {

  //let promises = []
  //let techSources = ['the-next-web','ars-technica','the-verge','techradar','techcrunch','recode','hacker-news','engadget']
  let allSources = ['al-jazeera-english', 'ars-technica', 'bbc-news', 'breitbart-news', 'engadget', 'fortune', 'fox-sports', 'reddit-r-all', 'new-scientist', 'the-verge']
  // Query newsapi for top headlines for all sources at once
  newsapi.v2.topHeadlines({
    sources: allSources.toString(),
    // q: 'bitcoin',
    // category: 'business',
    language: 'en',
  }).then(async articlesResponse => {


    const getArticleMetaData = (source) => {
      switch (source) {
        // case 'the-next-web': //   return {
        //     category = 17
        //     tag = 49
        //   }
        case 'ars-technica': return {
            category: 18,
            tag: 35,
          }
        case 'the-verge': return {
            category: 19,
            tag: 50,
          }
        // case 'techradar': //   return {
        //   category = 20
        //   tag = 48
        //   }
        //   break
        // case 'techcrunch': // return {
        //   category = 21
        //   tag = 47
        // }
        //   break
        // case 'recode': // return {
        //   category = 22
        //   tag = 45
        // }
        //   break
        // case 'hacker-news': // return {
        //   category = 23
        //   tag = 43
        // }
        //   break
        case 'engadget': return {
            category: 24,
            tag: 40,
          }
        case 'al-jazeera-english': return {
            category: 25,
            tag: 34,
          }
        case 'bbc-news': return {
            category: 26,
            tag: 36,
          }
        case 'breitbart-news': return {
            category: 27,
            tag: 37,
          }
          // case 'buzzfeed': return {
          //   category = 28
          //   tag = 38
          // }
          //   break
          // case 'cnn': return {
          //   category = 29
          //   tag = 39
          // }
        case 'fortune': return {
            category: 30,
            tag: 41,
          }
        case 'fox-sports': return {
            category: 31,
            tag: 42,
          }
        case 'reddit-r-all': return {
            category: 32,
            tag: 46,
          }
        case 'new-scientist': return {
            category: 33,
            tag: 44,
          }
      }
    }
    let meta
    console.log('Article Count: ', articlesResponse.articles.length)
    articlesResponse.articles.forEach(async (article) => {
      meta = getArticleMetaData(article.source.id)
      let form = new FormData()
      form.append("status", "publish")
      form.append("date", article.publishedAt)
      form.append("author", 2)
      form.append("title", article.title)
      form.append("excerpt", article.description)
      form.append("content", article.url)
      form.append("categories", meta.category)
      form.append("tags", meta.tag)
      form.append("comment_status", "open")
      form.append("fifu_image_url", article.urlToImage)
      form.append("fifu_image_alt", article.title)
      await fetch(dePostUrl, {
        method: 'POST',
        body: form,
        headers: {Authorization: "Basic " + process.env.DE_API_KEY}
      }).then(function (res) {
        return res.json()
      }).then(function (json) {
        if (json.data && json.data.status !== 200) {
          console.log('Failed to create article, error: ' + json.message)
        } else {
          console.log('Successfully created article for ' + json.slug + '!')
        }
      }).catch(err => {
        console.log('error: ', err)
      })
    })
  }).catch(err => {
    console.error('Error creating articles!', err)
  })
}

exports.updateDigitalEditorial()
