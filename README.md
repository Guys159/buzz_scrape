## Chrome Extension 

## Description

- A chrome extension made for devlopers to assist on data gathering from web pages.
- The developer can open the popup on the web page.
- The popup conatains a Choose and Copy buttons for each data category (review,title,desc,image).
- It also conatins a Scrape button, which as of now is a placeholder but in the future ment to exceute the data scarping script.

## How it works

1. Popup.html
- popup.html lays down the styling and core frontend features of the popup.

2. Popup.js
- Conatins the core logic of the interface UI.
- Handles user interactions in the popup, including loading/savingpaths, enabling picker mode, and copying selectors to clipboard. 
- Communicates with content.js to manage picker state and update stored paths based on user selections.


2. Content.js
- Contains the core logic of the webpage interactions.
- Listens for activation messages from popup.js.
- Enbales picker mode to highlight the elements inside of the webpage (and restore the page to normal after selection is completed).
- Genarate the css selectors and does some minimal optimaztion.
- Saves the selectors to Chromes local storage.





## Buzzfeed Scraper
This project takes a BuzzFeed shopping page (saved as HTML) and pulls out the product info:
- Product title
- Product description
- Product image URL

## How it works
1. I opened the BuzzFeed page in the browser and saved it as `page.html`.
2. The PHP script (`scrape.php`) reads that HTML file.
3. Used PHP DOM + XPath to find each product block in the HTML.
4. For every product it extracts:
   - the title
   - the description
   - the image URL
5. Prints the result as JSON.

## To run 
php scrape.php

