<?php

// 1) Read HTML 
$html = file_get_contents(__DIR__ . "/page.html"); //   BuzzFeed page saved as page.html
if ($html === false) exit("Missing page.html\n");

// --- DEBUG: Print first 500 characters ---
/*echo "=== page.html Preview ===\n";
echo substr($html, 0, 500);
echo "\n\n=== Total size: " . strlen($html) . " bytes ===\n\n";*/

// 2) Load HTML into DOM 
libxml_use_internal_errors(true);
$dom = new DOMDocument();
$dom->loadHTML($html);
$xp = new DOMXPath($dom);



// 3) "product block" container
$productContainerXpath = "//div[contains(@class,'product__rPWWQ')]"; 

// 4) Inside each container, find title/description/image
$titleXpath = ".//span[contains(@class,'js-subbuzz__title-text')]";          
$descXpath  = ".//div[contains(@class,'description_container__A3f4v')]//p[1]";      
$imgXpath   = ".//div[contains(@class,'image__item__QJh4x')]//img";     

$containers = $xp->query($productContainerXpath);

$items = [];
$counter = 1;

foreach ($containers as $c) {
    // Title
    $titleNode = $xp->query($titleXpath, $c)->item(0);
    $title = $titleNode ? trim($titleNode->textContent) : "";

    // Description
    $descNode = $xp->query($descXpath, $c)->item(0);
    $desc = $descNode ? trim($descNode->textContent) : "";

    // Image URL
    $imgNode = $xp->query($imgXpath, $c)->item(0);
    $imgUrl = "";
    if ($imgNode instanceof DOMElement) {
        $imgUrl = $imgNode->getAttribute("src");
        if ($imgUrl === "") $imgUrl = $imgNode->getAttribute("data-src");
        if ($imgUrl === "") {
            $srcset = $imgNode->getAttribute("srcset");
            if ($srcset) {
                $first = trim(explode(",", $srcset)[0]);
                $imgUrl = trim(explode(" ", $first)[0]);
            }
        }
    }

    // Keep only "product-like" blocks (simple filter)
    if ($title === "" && $desc === "" && $imgUrl === "") continue;

    $items[] = [
        "Id" => $counter,
        "title" => $title,
        "description" => $desc,
        "image_url" => $imgUrl,
    ];

    $counter++;
}

header("Content-Type: application/json; charset=utf-8");
echo json_encode($items, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
