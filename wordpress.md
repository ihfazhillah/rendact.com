---
layout: page
title: Rendact vs. WordPress
permalink: /wordpress/
---
Rendact is fast. How fast? Compare a basic free setup of Rendact vs. WordPress.com's site which uses expensive servers with every optimization technique available, which can cost thousands of dollars per month for managed hosting and premium caching plugins. So in this test a free site will outperform one running on a platform that charges $25,000 and more per site with every optimization. (See: WordPress.com's managed hosting plans and prices <a href="https://vip.wordpress.com/our-services/#hosting">here</a>)

Rendact was up to 23x faster.  Rendact, with our free setup available to all, was a clear winner in speed with the lowest time of 168ms with less than .3 variation between global servers. WordPress, with a setup worth thousands per month, lost by a great margin with a variation of almost 3 seconds.

# Explanation

While WordPress can be optimized and cached it is still a PHP application that has to preform thousands of lines of code on a monolithic server each visit. Even with managed hosting hosting which they charge others up to $25,000 per site for and all optimizations they can't bypass this technological boundary.

Rendact is a moderm, state of the art, React based application that is compiled and does not need to run any code when you visit the site. This allows it to be deployed to thousands of servers on a CDN (content delivery network) along side all aspects of the site like your images. Our cutting edge global CDN also minimizes and compresses every image efficiently, which made our test site small even though it had more images than WordPress. This allows superior security, speed, stability, reliability, etc. so that the page loads as the same size and fast speeds at every location, as well as with perfect 100% speed scores. Remember that your speed scores matter to Google for their page ranking and results.

### Australia

![Rendact]({{ site.url }}/images/wp-compare/ren-mel.png)
![WordPress]({{ site.url }}/images/wp-compare/wp-mel.png)

### Europe

![Rendact]({{ site.url }}/images/wp-compare/ren-sto.png)
![WordPress]({{ site.url }}/images/wp-compare/wp-sto.png)

### US (Central)

![Rendact]({{ site.url }}/images/wp-compare/ren-dal.png)
![WordPress]({{ site.url }}/images/wp-compare/wp-dal.png)

### US (West)

![Rendact]({{ site.url }}/images/wp-compare/ren-san.png)
![WordPress]({{ site.url }}/images/wp-compare/wp-san.png)

### Finale

While we loaded up a bunch of images our site was still smaller due to better technology. To answer those who were thinking this was the cause of the better performance we made a second Rendact page, still using our free setup, with purposely unoptimized and large messy images. The resulting website was almost twice as big as WordPress' flagship site yet loaded in only 731ms. So even with a much larger size we still see up to 5x the speed win.

![Rendact]({{ site.url }}/images/wp-compare/finale.png)
