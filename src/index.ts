import puppeteer from "puppeteer"

interface Book {
  title: string;
  author: string;
  rating: number;
  isbn: string;
  publisher: string;
  numberOfPages: string;
}

interface BookUrl {
  url: string;
}

const scrape = async () => {
  // launch browser
  const browser = await puppeteer.launch()

  // hardcoding goodreads page for now
  const page = await browser.newPage()
  await page.goto("https://www.goodreads.com/list/show/1.Best_Books_Ever")

  // add console.log when correct prompting implemented to show what book is being
  // navigated to.

  // Getting all book urls within a given list
  const bookUrls: BookUrl[] = await page.$$eval('table.tableList.js-dataTooltip > tbody > tr > td', links => {
    const urls = links.map((el: any) => el.querySelector('.bookTitle')?.href)
    return urls
  })
  
  // filtering out 'null' values to show only book urls
  const filteredBookUrls = bookUrls.filter((book: any) => book !== null)
  console.log(filteredBookUrls)

  // Iterate through each link and scrape the required data
  

  await browser.close()
}

scrape()