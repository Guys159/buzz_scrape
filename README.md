## Buzzfeed Scraper
This project takes a BuzzFeed shopping page (saved as HTML) and pulls out the product info:
- Product title
- Product description
- Product image URL

## How it works (in simple words)
1. I opened the BuzzFeed page in the browser and saved it as `page.html`.
2. The PHP script (`scrape.php`) reads that HTML file.
3. Used PHP DOM + XPath to find each product block in the HTML.
4. For every product it extracts:
   - the title
   - the description
   - the image URL
5. Prints the result as JSON.

