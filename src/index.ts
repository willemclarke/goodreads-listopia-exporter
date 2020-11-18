import _ from 'lodash';
import cheerio from 'cheerio';
import axios from 'axios';
import Bluebird from 'bluebird';
import { sanitize } from './utils';

interface Book {
  bookTitle: string;
  authors: string;
  isbn13: string;
  rating: string;
  numberOfRatings: string | undefined;
  numberOfReviews: string | undefined;
  bookType: string;
  numberOfPages: string;
}

interface HTML {
  html: string;
}

const getBookList = async (url: string): Promise<string> => {
  return (await axios.get(url)).data;
};

const parseBookList = (bookList: string): string[] => {
  const urls: string[] = [];
  const $ = cheerio.load(bookList);

  $('a.bookTitle').map((i, elem) => {
    const url = $(elem).attr('href');
    urls.push(`https://www.goodreads.com${url}`);
  });
  return urls;
};

const getBook = async (url: string): Promise<string> => {
  return (await axios.get(url)).data;
};

const parseBook = (book: string): Book => {
  const $ = cheerio.load(book);
  const title = sanitize($('#bookTitle').text());
  const bookSeries = sanitize($('#bookSeries').text());
  const authors = sanitize($('a.authorName').text());
  const rating = sanitize($('[itemprop="ratingValue"]').text());
  const numberOfRatings = $('[itemprop="ratingCount"]').attr('content');
  const numberOfReviews = $('[itemprop="reviewCount"]').attr('content');
  const isbn13 = sanitize($('[itemprop="isbn"]').text() ? $('[itemprop="isbn"]').text() : 'No ISBN13 found');
  const bookType = $('[itemprop="bookFormat"]').text();
  const numberOfPages = $('[itemprop="numberOfPages"]').text().split(' ')[0];

  return {
    bookTitle: `${title} ${bookSeries}`,
    authors: authors,
    isbn13,
    rating: `${rating}/5`,
    numberOfRatings,
    numberOfReviews,
    bookType,
    numberOfPages,
  };
};

const asCsv = async (data: Book[]) => {
  const objectsToCsv = require('objects-to-csv');
  const csv = new objectsToCsv(data);
  await csv.toDisk('./test.csv');
  console.log('writing book data to list...');
};

// execute will take in the url from the CLI prompt
const execute = async () => {
  try {
    const bookList = await getBookList(
      'https://www.goodreads.com/list/show/146534.Florence_Williams_Books_to_Transport_You_to_Wild_Open_Spaces'
    );
    const bookUrls = parseBookList(bookList);
    const allBookPages = await Promise.all(_.map(bookUrls, (url) => getBook(url)));
    const parsedBooks = _.map(allBookPages, (book) => parseBook(book));
    const createCsv = await asCsv(parsedBooks);
  } catch (err) {
    console.log(err);
  }
};

execute();
