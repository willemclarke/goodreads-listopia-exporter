## goodreads-listopia-exporter

Use this instead: https://github.com/willemclarke/reads-good
This version was written pre goodreads facelift, and thus the selectors are no longer working. The `reads-good` impl supports pagination also

Simple command line interface to take a public goodreads booklist url and export the details shown below of each book within the list and then download as a .csv file

- bookTitle
- authors
- isbn13 - (depending on which edition of a book was entered into the list, the isbn13 may or may not be available)
- topGenre
- rating
- numberOfRatings
- numberOfReview
- datePublishedAndPublisher - (gives both the date published, and company book was published by if available)
- bookType - (e.g. Hardcover, Paperback, Kindle etc.)

### Currently only takes the data of the first _100_ books within a list (first page).

- This was intended as a simple project to learn about web scraping, and as such I have not implemented support for pagination.
- .csv file is saved in the location where the repository is cloned

## Usage:

- clone repository
- `npm install`
- `npm run start`
- input correct goodreads booklist url, e.g: https://www.goodreads.com/list/show/1.Best_Books_Ever
- input desired .csv filename

## Example

[![CLI Example](https://i.gyazo.com/5281f3a2fea777993b4efbed440983d2.gif)](https://gyazo.com/5281f3a2fea777993b4efbed440983d2)

## Example output (google spreadsheets)
  <p float="left">
      <img src="https://i.gyazo.com/b5544fd9f80c7459330bba4f6a2f8f2a.png">
    </p>
