const FormData = require('form-data')
const fetch = require('node-fetch')
const NewsAPI = require('newsapi')
const newsapi = new NewsAPI(process.env.NEWSAPI_KEY)
let dePostUrl = 'https://digitaleditorial.com/wp-json/wp/v2/posts'

/**
 * Updates digitaleditorial.com's posts via wordpress v2 REST API with news data from newsapi.org REST API
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 * https://newsapi.org/#documentation
 * https://developer.wordpress.org/rest-api/reference/posts/#definition
 */

exports.updateDigitalEditorial = function updateDigitalEditorial() {

  let promises = []

  // To query articles:
  const getArticles = (source, sortBy, category, tag) => {
    newsapi.articles({
     source: source, // required
     sortBy: sortBy // optional
    }).then(async articlesResponse => {
      //console.log(articlesResponse);
      articlesResponse.articles.forEach(async (article, i) => {
        //console.log('article #' + i + ' Author: ', article.author)
        let form = new FormData()
        form.append("status", "publish")
        form.append("date", article.publishedAt)
        form.append("author", 2)
        form.append("title", article.title)
        form.append("excerpt", article.description)
        form.append("content", article.url)
        form.append("categories", category)
        form.append("tags", tag)
        form.append("comment_status", "open")
        form.append("fifu_image_url", article.urlToImage)
        form.append("fifu_image_alt", article.title)
        promises.push(
          await fetch(dePostUrl, {
            method: 'POST',
            body: form,
            headers: {Authorization: "Basic ZGlnaXRhbGVkaXRvcjoxWmklTHd6TSpRWUBIalR4VWV5b05hKVU="}
          }).then(function (res) {
            return res.json()
          }).then(function (json) {
            console.log('Successfully created article for ' + json.slug + '!') //, JSON.stringify(json, null, 4))
          }).catch(err => {
            console.log('error: ', err)
          })
        )
      })

      await Promise.all(promises).then(() => {return [{code: 200, status: "OK", message: "Success"}]})
    }).catch(err => {
      console.error('Error resolving all promises!', err)
    })``
  }

  let allSources = ['al-jazeera-english', 'ars-technica', 'bbc-news', 'breitbart-news', 'engadget', 'fortune', 'fox-sports', 'reddit-r-all', 'new-scientist', 'the-verge']
  //let techSources = ['the-next-web','ars-technica','the-verge','techradar','techcrunch','recode','hacker-news','engadget']
  let category = null
  let tag = null
  let sortBy = null
  allSources.forEach(async (source) => {
    switch (source) {
      // case 'the-next-web':
      //   category = 17
      //   tag = 49
      //   sortBy = 'latest'
      //   await getArticles(source, sortBy, category, tag)
      //   break
      case 'ars-technica':
        category = 18
        tag = 35
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      case 'the-verge':
        category = 19
        tag = 50
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      // case 'techradar':
      //   category = 20
      //   tag = 48
      //   sortBy = 'top'
      //   await getArticles(source, sortBy, category, tag)
      //   break
      // case 'techcrunch':
      //   category = 21
      //   tag = 47
      //   sortBy = 'top'
      //   await getArticles(source, sortBy, category, tag)
      //   break
      // case 'recode':
      //   category = 22
      //   tag = 45
      //   sortBy = 'top'
      //   await getArticles(source, sortBy, category, tag)
      //   break
      // case 'hacker-news':
      //   category = 23
      //   tag = 43
      //   sortBy = 'top'
      //   await getArticles(source, sortBy, category, tag)
      //   break
      case 'engadget':
        category = 24
        tag = 40
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      case 'al-jazeera-english':
        category = 25
        tag = 34
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      case 'bbc-news':
        category = 26
        tag = 36
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      case 'breitbart-news':
        category = 27
        tag = 37
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      // case 'buzzfeed':
      //   category = 28
      //   tag = 38
      //   sortBy = 'top'
      //   await getArticles(source, sortBy, category, tag)
      //   break
      // case 'cnn':
      //   category = 29
      //   tag = 39
      //   sortBy = 'top'
      //   await getArticles(source, sortBy, category, tag)
      //   break
      case 'fortune':
        category = 30
        tag = 41
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      case 'fox-sports':
        category = 31
        tag = 42
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      case 'reddit-r-all':
        category = 32
        tag = 46
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
        break
      case 'new-scientist':
        category = 33
        tag = 44
        sortBy = 'top'
        await getArticles(source, sortBy, category, tag)
    }
  })
}
exports.updateDigitalEditorial()
