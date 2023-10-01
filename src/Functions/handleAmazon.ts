import Puppeteer from "puppeteer";
import { Review, Product_Review } from "../../types";

export const handleAmazon = async (keyword: string) => {
  console.log("running scraper at", new Date().toLocaleString());
  console.time();

  let browser = await Puppeteer.launch({
    // headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();
  console.log("before goto: Amazon");

  page.setDefaultTimeout(900000);
  page.setDefaultNavigationTimeout(900000);
  await page.goto("https://www.amazon.com/", { waitUntil: "load" });
  const title = await page.title();

  try {
    await page.waitForSelector("#twotabsearchtextbox");
  } catch (error) {
    console.log("text box error:", error);
  }
  console.log("handleAmazon ~ title:", title);

  await page.type("#twotabsearchtextbox", keyword);

  console.log("after type");

  const search = await page.$("#nav-search-submit-button");

  try {
    await search?.click();
  } catch (error) {
    console.log("couldn't click search:", error);
  }
  console.log("after clicking search button");

  try {
    await page.waitForSelector(
      ".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2",
      {
        timeout: 4000,
      }
    );
  } catch (error) {
    console.log(
      "could not find .a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2"
    );
  }

  const links = await page.evaluate(() =>
    Array.from(
      new Set(
        Array.from(
          document.querySelectorAll(
            "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
          )
        ).map((link: Element) => (link as HTMLAnchorElement).href)
      )
    )
  );
  console.log("handleAmazon ~ links:", links.length);

  const product_reviews: Product_Review[] = [];

  // because of the delay, we reduce the number of products to 5

  const links_length = links.length > 5 ? 5 : links.length;

  for (let i = 0; i < links_length; i++) {
    const link = links[i];

    const newPage = await browser.newPage();

    newPage.setDefaultTimeout(900000);
    newPage.setDefaultNavigationTimeout(900000);

    await newPage.goto(link);
    let name = "";
    try {
      await newPage.waitForSelector("#productTitle", { timeout: 3000 });
      name =
        (await newPage.$eval("#productTitle", (e) => e.textContent?.trim())) ||
        "";
    } catch (error) {
      console.log("product name error: index", i, error);
    }

    let price = "";
    try {
      await newPage.waitForSelector(
        ".a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay",
        { timeout: 3000 }
      );
      price =
        (await newPage.$eval(
          ".a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay",
          (e) => e.firstElementChild?.textContent?.trim()
        )) || "";
    } catch (error) {
      console.log("price selector", error);
    }

    let reviews: Review[] = [];

    try {
      await page.waitForSelector(".a-section.review.aok-relative", {
        timeout: 10000,
      });
    } catch (error) {
      console.log("could not find .a-section.review.aok-relative");
    }

    const review_elements = await newPage.$$(".a-section.review.aok-relative");

    // because of the delay, we reduce the number of reviews per product to 5
    const review_length =
      review_elements.length > 5 ? 5 : review_elements.length;

    for (let i = 0; i < review_length; i++) {
      const review_element = review_elements[i];

      try {
        const review = await review_element.evaluate((e) => {
          const el = e.firstElementChild?.firstElementChild;

          const rating = Number(
            el?.children[1]?.firstElementChild?.firstElementChild?.textContent
              ?.trim()
              .split("out")[0]
              .trim()
          );
          const title =
            el?.children[1].firstElementChild?.lastElementChild?.textContent?.trim();
          const date = el?.children[2].textContent?.trim();
          const review =
            el?.children[4].firstElementChild?.firstElementChild?.firstElementChild?.textContent?.trim();
          return {
            title: title || "",
            rating: rating || 0,
            date: date || "",
            review: review || "",
          };
        });
        reviews.push(review);
      } catch (error) {
        console.log("error getting review info", error);
      }
    }

    const new_product_review = {
      name,
      price,
      reviews,
    };
    console.log("new_product_review:", new_product_review.reviews.length);

    product_reviews.push(new_product_review);

    await newPage.close();
  }

  console.log("after goto: Amazon");
  page.close();
  return product_reviews;
};
