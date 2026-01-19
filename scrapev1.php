
<?php

use DOM\HTMLDocument as DOMDocument;

// Read HTML 
$html = file_get_contents(__DIR__ . "/page.html"); //BuzzFeed page saved as page.html
if ($html === false) exit("Missing page.html\n");

libxml_use_internal_errors(true); 
$dom = DOMDocument::createFromString($html, LIBXML_HTML_NOIMPLIED);
libxml_clear_errors(); 


// Define classes to hold product review data
class ProductReview {
    public string $title;
    public string $review;
    public string $image;
}


// Scraper class to extract product reviews
class ProductScraper {

    private $dom;
    public array $productReviews = [];
    public function __construct($dom) { 
        $this->dom = $dom;
    }

	public function extractProductReviews() : void {
		$previewEms = $this->dom->querySelectorAll('.js-subbuzz-wrapper'); // select all product review containers 

        foreach ($previewEms as $previewEm) {

            $productReview = new ProductReview();
            $productReview->title = $previewEm->querySelector('.js-subbuzz__title-text')?->textContent??"";
            $productReview->review = $previewEm->querySelector('.description_container__A3f4v')?->textContent??"";
            $imgNode = $previewEm->querySelector('img.image__photo__Mq81C');
            $productReview->image = $imgNode?->getAttribute('src')??"";

            if ($productReview->title || $productReview->review ||  $productReview->image) {
                
                 $this->productReviews[] = $productReview;
            }   
        }
	}
}

$scraper = new ProductScraper($dom);
$scraper->extractProductReviews();

print_r($scraper->productReviews);

?>