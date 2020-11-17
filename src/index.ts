import _ from "lodash"
import cheerio from "cheerio"
import axios from "axios"
import Bluebird from "bluebird"
import { sanitize } from "./utils"

interface Book {
  bookTitle: string;
  authors: string;
  isbn13: string;
  rating: string;
  numberOfRatings: string | undefined
  numberOfReviews: string | undefined
  binding: string;
  numberOfPages: string;
}

// step 1: make a get request to a given goodreads list. this gives us a HTML file that contains a list of urls.
// Extract each book url from the html and build ap an array of book urls

// step 2: Given the list of book urls, for each url, make another get request. This gives us another html file that
// contains all the data we want about the given book. Extract all desired data from the HTML and build up a list of objects [{}]
// where each object is the book data for each url

const extractBookUrls = (html: string): string[] => {
  const urls: string[] = []
  const $ = cheerio.load(html)

  $('a.bookTitle').map((i, elem) => {
    const url = $(elem).attr('href')
    urls.push(`https://www.goodreads.com${url}`)
  })
  return urls
}

const extractBookData = (html: string): Book[] => {
  const $ = cheerio.load(html)
  const title = sanitize($('#bookTitle').text())
  const bookSeries = sanitize($('#bookSeries').text())
  const authors = sanitize($('a.authorName').text())
  const rating = sanitize($('[itemprop="ratingValue"]').text())
  const numberOfRatings = $('[itemprop="ratingCount"]').attr("content")
  const numberOfReviews = $('[itemprop="reviewCount"]').attr("content")
  const isbn13 = $('[itemprop="isbn"]').text() ? $('[itemprop="isbn"]').text() : "No ISBN13 found"
  // const publisher = $('')
  const binding = $('[itemprop="bookFormat"]').text()
  const numberOfPages = $('[itemprop="numberOfPages"]').text().split(' ')[0]

  console.log([{
    bookTitle: `${title} ${bookSeries}`,
    authors,
    isbn13,
    rating: `${rating}/5`,
    numberOfRatings,
    numberOfReviews,
    binding,
    numberOfPages
  }])

  return [
    {
      bookTitle: `${title} ${bookSeries}`,
      authors: authors,
      isbn13,
      rating: `${rating}/5`,
      numberOfRatings,
      numberOfReviews,
      binding,
      numberOfPages
    }
  ]


}

const getBookList = () => {
  axios.get("https://www.goodreads.com/list/show/1.Best_Books_Ever").then((resp) => {
    const bookUrls = extractBookUrls(resp.data)
    const eachBookPage = getEachBook(bookUrls)
    // const bookInfo = extractBookData(eachBookPage)

  }).catch((err) => {
    console.log(err)
  })
}

const getEachBook = (bookUrls: string[]) => {
  return Bluebird.map(bookUrls, url => {
    axios.get(url).then((resp) => {
      const bookInfo = extractBookData(resp.data)
    }).catch((err) => {
      console.log(err)
      return err
    })
  }, { concurrency: 25 })
}

getBookList()




