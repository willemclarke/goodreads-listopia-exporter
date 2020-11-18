## goodreads-listopia-exporter

Simple command line interface to take a public goodreads booklist url and export the details below of each book within the list and download as a .csv

- bookTitle
- authors
- isbn13 - (depending on which edition of a book was entered into the list, the isbn13 may or may not be available)
- rating
- numberOfRatings
- numberOfReviews
- bookType - (e.g. Hardcover, Paperback, Kindle etc.)

#### Currently only takes the data of the first _100_ books within a list (first page).

- This was intended as a simple project to learn about web scraping, and as such I have not implemented pagination.
- .csv file is saved in the location where the repository is cloned to

## Usage:

- clone repository
- `npm install`
- `npm run start`
