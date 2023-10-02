"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAmazon = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const handleAmazon = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("running scraper at", new Date().toLocaleString());
    console.time();
    let browser = yield puppeteer_1.default.launch({
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
    const page = yield browser.newPage();
    console.log("before goto: Amazon");
    page.setDefaultTimeout(900000);
    page.setDefaultNavigationTimeout(900000);
    yield page.goto("https://www.amazon.com/", { waitUntil: "load" });
    const title = yield page.title();
    try {
        yield page.waitForSelector("#twotabsearchtextbox");
    }
    catch (error) {
        console.log("text box error:", error);
    }
    console.log("handleAmazon ~ title:", title);
    yield page.type("#twotabsearchtextbox", keyword);
    console.log("after type");
    const search = yield page.$("#nav-search-submit-button");
    try {
        yield (search === null || search === void 0 ? void 0 : search.click());
    }
    catch (error) {
        console.log("couldn't click search:", error);
    }
    console.log("after clicking search button");
    try {
        yield page.waitForSelector(".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2", {
            timeout: 4000,
        });
    }
    catch (error) {
        console.log("could not find .a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2");
    }
    const links = yield page.evaluate(() => Array.from(new Set(Array.from(document.querySelectorAll("a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal")).map((link) => link.href))));
    console.log("handleAmazon ~ links:", links.length);
    const product_reviews = [];
    // because of the delay, we reduce the number of products to 3
    const links_length = links.length > 3 ? 3 : links.length;
    for (let i = 0; i < links_length; i++) {
        const link = links[i];
        const newPage = yield browser.newPage();
        newPage.setDefaultTimeout(900000);
        newPage.setDefaultNavigationTimeout(900000);
        yield newPage.goto(link);
        let name = "";
        try {
            yield newPage.waitForSelector("#productTitle", { timeout: 3000 });
            name =
                (yield newPage.$eval("#productTitle", (e) => { var _a; return (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })) ||
                    "";
        }
        catch (error) {
            console.log("product name error: index", i, error);
        }
        let price = "";
        try {
            yield newPage.waitForSelector(".a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay", { timeout: 3000 });
            price =
                (yield newPage.$eval(".a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay", (e) => { var _a, _b; return (_b = (_a = e.firstElementChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim(); })) || "";
        }
        catch (error) {
            console.log("price selector", error);
        }
        let reviews = [];
        try {
            yield page.waitForSelector(".a-section.review.aok-relative", {
                timeout: 10000,
            });
        }
        catch (error) {
            console.log("could not find .a-section.review.aok-relative");
        }
        const review_elements = yield newPage.$$(".a-section.review.aok-relative");
        // because of the delay, we reduce the number of reviews per product to 3
        const review_length = review_elements.length > 3 ? 3 : review_elements.length;
        for (let i = 0; i < review_length; i++) {
            const review_element = review_elements[i];
            try {
                const review = yield review_element.evaluate((e) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                    const el = (_a = e.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild;
                    const rating = Number((_e = (_d = (_c = (_b = el === null || el === void 0 ? void 0 : el.children[1]) === null || _b === void 0 ? void 0 : _b.firstElementChild) === null || _c === void 0 ? void 0 : _c.firstElementChild) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim().split("out")[0].trim());
                    const title = (_h = (_g = (_f = el === null || el === void 0 ? void 0 : el.children[1].firstElementChild) === null || _f === void 0 ? void 0 : _f.lastElementChild) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.trim();
                    const date = (_j = el === null || el === void 0 ? void 0 : el.children[2].textContent) === null || _j === void 0 ? void 0 : _j.trim();
                    const review = (_o = (_m = (_l = (_k = el === null || el === void 0 ? void 0 : el.children[4].firstElementChild) === null || _k === void 0 ? void 0 : _k.firstElementChild) === null || _l === void 0 ? void 0 : _l.firstElementChild) === null || _m === void 0 ? void 0 : _m.textContent) === null || _o === void 0 ? void 0 : _o.trim();
                    return {
                        title: title || "",
                        rating: rating || 0,
                        date: date || "",
                        review: review || "",
                    };
                });
                reviews.push(review);
            }
            catch (error) {
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
        yield newPage.close();
    }
    console.log("after goto: Amazon");
    page.close();
    return product_reviews;
});
exports.handleAmazon = handleAmazon;
//# sourceMappingURL=handleAmazon.js.map