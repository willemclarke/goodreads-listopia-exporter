import puppeteer from "puppeteer"
import request from "request-promise"
import Bluebird from "bluebird"
import _ from "lodash"
import cheerio from "cheerio"
import axios from "axios"

interface Book {
  title: string;
  author: string;
  rating: number;
  isbn: string;
  publisher: string;
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

  $('a.bookTitle').each((i, elem) => {
    const url = $(elem).attr('href')
    urls.push(`https://www.goodreads.com${url}`)
  })

  return urls
}

const getBookList = () => {
  axios.get("https://www.goodreads.com/list/show/1.Best_Books_Ever").then((resp) => {
    const bookUrls = extractBookUrls(resp.data)
    const eachBookPage = getEachBook(bookUrls)

  }).catch((err) => {
    console.log(err)
  })
}

const getEachBook = (bookUrls: string[]) => {
  return Bluebird.map(bookUrls, url => {
    axios.get(url).then((resp) => {
      console.log(resp.data)
    }).catch((err) => {
      console.log(err)
    })
  }, { concurrency: 25 })
}


getBookList()


// const scrape = async () => {
//   const browser = await puppeteer.launch()

//   // hardcoding goodreads page for now
//   const page = await browser.newPage()
//   await page.goto("https://www.goodreads.com/list/show/1.Best_Books_Ever")

//   // Getting all book urls within a given list
//   const bookUrls: BookUrl[] = _.compact(await page.$$eval('table.tableList.js-dataTooltip > tbody > tr > td', links => {
//     const urls = links.map((el: any) => el.querySelector('.bookTitle')?.href)
//     return urls
//   }))

//   // Iterate through each link and scrape the required data
//   const getBookInfo = (link: any) => new Promise(async (resolve, reject) => {
//     const newPage = await browser.newPage()
//     await newPage.goto(link)

//     // Required data
//     const bookTitle = await newPage.$eval('#bookTitle', text => text.textContent?.replace(/(\r\n\t|\n|\r|\t)/gm, ""))
//     const bookSeries = await newPage.$eval('#bookSeries', text => text.textContent?.replace(/(\r\n\t|\n|\r|\t)/gm, ""))
//     const bookAuthors = await newPage.$eval('[itemprop="author"]', text => text.textContent?.replace(/(\r\n\t|\n|\r|\t)/gm, ""))

//     resolve({ bookTitle: `${bookTitle} ${bookSeries}`, bookAuthors })

//   })

//   for (const link in bookUrls) {
//     let currentPageData = await getBookInfo(bookUrls[link])
//     console.log(currentPageData)
//   }

//   await browser.close()
// }

const test = async () => {
  // const list = await request("https://www.goodreads.com/list/show/1.Best_Books_Ever")
  const smithoath = ['https://www.goodreads.com/book/show/2767052-the-hunger-games',
    'https://www.goodreads.com/book/show/2.Harry_Potter_and_the_Order_of_the_Phoenix',
    'https://www.goodreads.com/book/show/2657.To_Kill_a_Mockingbird',
    'https://www.goodreads.com/book/show/1885.Pride_and_Prejudice',
    'https://www.goodreads.com/book/show/41865.Twilight',
    'https://www.goodreads.com/book/show/19063.The_Book_Thief',
    'https://www.goodreads.com/book/show/170448.Animal_Farm',
    'https://www.goodreads.com/book/show/11127.The_Chronicles_of_Narnia',
    'https://www.goodreads.com/book/show/30.J_R_R_Tolkien_4_Book_Boxed_Set',
    'https://www.goodreads.com/book/show/11870085-the-fault-in-our-stars',
    'https://www.goodreads.com/book/show/18405.Gone_with_the_Wind',
    'https://www.goodreads.com/book/show/386162.The_Hitchhiker_s_Guide_to_the_Galaxy',
    'https://www.goodreads.com/book/show/370493.The_Giving_Tree',
    'https://www.goodreads.com/book/show/6185.Wuthering_Heights',
    'https://www.goodreads.com/book/show/968.The_Da_Vinci_Code',
    'https://www.goodreads.com/book/show/5297.The_Picture_of_Dorian_Gray',
    'https://www.goodreads.com/book/show/929.Memoirs_of_a_Geisha',
    'https://www.goodreads.com/book/show/24213.Alice_s_Adventures_in_Wonderland_Through_the_Looking_Glass',
    'https://www.goodreads.com/book/show/10210.Jane_Eyre',
    'https://www.goodreads.com/book/show/24280.Les_Mis_rables',
    'https://www.goodreads.com/book/show/13079982-fahrenheit-451',
    'https://www.goodreads.com/book/show/13335037-divergent',
    'https://www.goodreads.com/book/show/7624.Lord_of_the_Flies',
    'https://www.goodreads.com/book/show/18135.Romeo_and_Juliet',
    'https://www.goodreads.com/book/show/18144590-the-alchemist',
    'https://www.goodreads.com/book/show/22628.The_Perks_of_Being_a_Wallflower',
    'https://www.goodreads.com/book/show/7144.Crime_and_Punishment',
    'https://www.goodreads.com/book/show/4671.The_Great_Gatsby',
    'https://www.goodreads.com/book/show/256683.City_of_Bones',
    'https://www.goodreads.com/book/show/375802.Ender_s_Game',
    'https://www.goodreads.com/book/show/4667024-the-help',
    'https://www.goodreads.com/book/show/3.Harry_Potter_and_the_Sorcerer_s_Stone',
    'https://www.goodreads.com/book/show/8127.Anne_of_Green_Gables',
    'https://www.goodreads.com/book/show/157993.The_Little_Prince',
    'https://www.goodreads.com/book/show/24178.Charlotte_s_Web',
    'https://www.goodreads.com/book/show/890.Of_Mice_and_Men',
    'https://www.goodreads.com/book/show/18619684-the-time-traveler-s-wife',
    'https://www.goodreads.com/book/show/17245.Dracula',
    'https://www.goodreads.com/book/show/5129.Brave_New_World',
    'https://www.goodreads.com/book/show/320.One_Hundred_Years_of_Solitude',
    'https://www.goodreads.com/book/show/5107.The_Catcher_in_the_Rye',
    'https://www.goodreads.com/book/show/21787.The_Princess_Bride',
    'https://www.goodreads.com/book/show/28187.The_Lightning_Thief',
    'https://www.goodreads.com/book/show/2998.The_Secret_Garden',
    'https://www.goodreads.com/book/show/128029.A_Thousand_Splendid_Suns',
    'https://www.goodreads.com/book/show/33574273-a-wrinkle-in-time',
    'https://www.goodreads.com/book/show/13496.A_Game_of_Thrones',
    'https://www.goodreads.com/book/show/2956.The_Adventures_of_Huckleberry_Finn',
    'https://www.goodreads.com/book/show/231804.The_Outsiders',
    'https://www.goodreads.com/book/show/12232938-the-lovely-bones',
    'https://www.goodreads.com/book/show/19543.Where_the_Wild_Things_Are',
    'https://www.goodreads.com/book/show/23772.Green_Eggs_and_Ham',
    'https://www.goodreads.com/book/show/1381.The_Odyssey',
    'https://www.goodreads.com/book/show/4214.Life_of_Pi',
    'https://www.goodreads.com/book/show/1953.A_Tale_of_Two_Cities',
    'https://www.goodreads.com/book/show/43641.Water_for_Elephants',
    'https://www.goodreads.com/book/show/7604.Lolita',
    'https://www.goodreads.com/book/show/4981.Slaughterhouse_Five',
    'https://www.goodreads.com/book/show/35031085-frankenstein',
    'https://www.goodreads.com/book/show/77203.The_Kite_Runner',
    'https://www.goodreads.com/book/show/38447.The_Handmaid_s_Tale',
    'https://www.goodreads.com/book/show/3636.The_Giver',
    'https://www.goodreads.com/book/show/168668.Catch_22',
    'https://www.goodreads.com/book/show/44767458-dune',
    'https://www.goodreads.com/book/show/5043.The_Pillars_of_the_Earth',
    'https://www.goodreads.com/book/show/149267.The_Stand',
    'https://www.goodreads.com/book/show/3590.The_Adventures_of_Sherlock_Holmes',
    'https://www.goodreads.com/book/show/76620.Watership_Down',
    'https://www.goodreads.com/book/show/2623.Great_Expectations',
    'https://www.goodreads.com/book/show/1934.Little_Women',
    'https://www.goodreads.com/book/show/136251.Harry_Potter_and_the_Deathly_Hallows',
    'https://www.goodreads.com/book/show/6514.The_Bell_Jar',
    'https://www.goodreads.com/book/show/332613.One_Flew_Over_the_Cuckoo_s_Nest',
    'https://www.goodreads.com/book/show/15823480-anna-karenina',
    'https://www.goodreads.com/book/show/10964.Outlander',
    'https://www.goodreads.com/book/show/39988.Matilda',
    'https://www.goodreads.com/book/show/10917.My_Sister_s_Keeper',
    'https://www.goodreads.com/book/show/2429135.The_Girl_with_the_Dragon_Tattoo',
    'https://www.goodreads.com/book/show/17899948-rebecca',
    'https://www.goodreads.com/book/show/40961427-1984',
    'https://www.goodreads.com/book/show/52892857-the-color-purple',
    'https://www.goodreads.com/book/show/14891.A_Tree_Grows_in_Brooklyn',
    'https://www.goodreads.com/book/show/41817486-a-clockwork-orange',
    'https://www.goodreads.com/book/show/6288.The_Road',
    'https://www.goodreads.com/book/show/4934.The_Brothers_Karamazov',
    'https://www.goodreads.com/book/show/252577.Angela_s_Ashes',
    'https://www.goodreads.com/book/show/345627.Vampire_Academy',
    'https://www.goodreads.com/book/show/52036.Siddhartha',
    'https://www.goodreads.com/book/show/7244.The_Poisonwood_Bible',
    'https://www.goodreads.com/book/show/119322.The_Golden_Compass',
    'https://www.goodreads.com/book/show/3836.Don_Quixote',
    'https://www.goodreads.com/book/show/5.Harry_Potter_and_the_Prisoner_of_Azkaban',
    'https://www.goodreads.com/book/show/3263607-the-fellowship-of-the-ring',
    'https://www.goodreads.com/book/show/662.Atlas_Shrugged',
    'https://www.goodreads.com/book/show/2165.The_Old_Man_and_the_Sea',
    'https://www.goodreads.com/book/show/33648131-the-notebook',
    'https://www.goodreads.com/book/show/99107.Winnie_the_Pooh',
    'https://www.goodreads.com/book/show/23919.The_Complete_Stories_and_Poems',
    'https://www.goodreads.com/book/show/43763.Interview_with_the_Vampire',
    'https://www.goodreads.com/book/show/4473.A_Prayer_for_Owen_Meany']

  const result = await Bluebird.map(smithoath, async (link: string) => {
    await request(link)
    console.log("finished getting data for: ", link)
  }, { concurrency: 50 })
  console.log("done")
}

// scrape()


