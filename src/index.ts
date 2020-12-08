import _ from 'lodash';
import cheerio from 'cheerio';
import axios from 'axios';
import Bluebird from 'bluebird';
import prompts from 'prompts';
import chalk from 'chalk';
import { sanitize } from './utils';

interface ParsedBook {
  bookTitle: string;
  authors: string;
  isbn13: string;
  topGenre: string;
  rating: string;
  numberOfRatings: string | undefined;
  numberOfReviews: string | undefined;
  datePublishedAndPublisher: string;
  bookType: string;
  numberOfPages: string;
}

type BookHtml = string;
type BookListHtml = string;
type BookUrls = string[];

const getBookList = async (url: string): Promise<BookListHtml> => {
  return (await axios.get(url)).data;
};

const parseBookList = (bookList: BookListHtml): BookUrls => {
  const urls: string[] = [];
  const $ = cheerio.load(bookList);

  $('a.bookTitle').map((i, elem) => {
    const url = $(elem).attr('href');
    urls.push(`https://www.goodreads.com${url}`);
  });
  return urls;
};

const getBook = async (url: string): Promise<BookHtml> => {
  return (await axios.get(url)).data;
};

const parseBook = (book: BookHtml): ParsedBook => {
  const $ = cheerio.load(book);

  const title = sanitize($('#bookTitle').text());
  const bookSeries = sanitize($('#bookSeries').text());
  const authors = sanitize($('a.authorName').text());
  const isbn13 = $('[itemprop="isbn"]').text()
    ? sanitize($('[itemprop="isbn"]').text())
    : 'No ISBN13 found';
  const topGenre = sanitize($('a[class="actionLinkLite bookPageGenreLink"]').first().text());
  const rating = sanitize($('[itemprop="ratingValue"]').text());
  const numberOfRatings = $('[itemprop="ratingCount"]').attr('content');
  const numberOfReviews = $('[itemprop="reviewCount"]').attr('content');
  const publisher = $('#details > div:nth-child(2)')
    ? sanitize($('#details > div:nth-child(2)').text())
    : 'No Publisher found';
  const datePublishedAndPublisher = publisher.split('Published')[1];
  const bookType = $('[itemprop="bookFormat"]').text();
  const numberOfPages = $('[itemprop="numberOfPages"]').text().split(' ')[0];

  console.log(chalk.cyan(`Parsing ${title}`));

  return {
    bookTitle: `${title} ${bookSeries}`,
    authors: authors,
    isbn13,
    topGenre,
    rating,
    numberOfRatings,
    numberOfReviews,
    datePublishedAndPublisher,
    bookType,
    numberOfPages,
  };
};

const asCsv = async (data: ParsedBook[], fileName: string): Promise<void> => {
  const objectsToCsv = require('objects-to-csv');
  const csv = new objectsToCsv(data);
  await csv.toDisk(`./${fileName}.csv`);
  console.log(chalk.whiteBright.bold(`Successfully written --> ${fileName}.csv <-- to disk`));
};

const run = async (goodreadsListUrl: string, fileName: string) => {
  try {
    const bookList = await getBookList(goodreadsListUrl);
    const bookUrls = parseBookList(bookList);
    const getEachBook = await Bluebird.map(bookUrls, (url) => getBook(url), { concurrency: 20 });
    const parsedBooks = _.map(getEachBook, (book) => parseBook(book));
    const createCsv = await asCsv(parsedBooks, fileName);
  } catch (err) {
    console.log(err);
  }
};

const cli = async (): Promise<void> => {
  const askForListUrl = await prompts({
    type: 'text',
    name: 'goodreadsListUrl',
    message: 'Please enter goodreads list url',
  });

  const csvFilename = await prompts({
    type: 'text',
    name: 'csvFilename',
    message: 'Please type the desired name of your .csv file',
  });

  return run(askForListUrl.goodreadsListUrl, csvFilename.csvFilename);
};

cli();
