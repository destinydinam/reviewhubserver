import express from "express";
import { handleAmazon } from "./Functions/handleAmazon";

const app = express();

const base_url = "http://213.52.129.206";

app.get("/v1/api/amazon", async (req, res) => {
  const req_url = new URL(base_url + req.url);

  if (!req_url.search)
    return res.status(400).json({ message: "No keyword Provided" });

  const params: { [x: string]: string }[] = [];
  req_url.searchParams?.forEach((val, key) => params.push({ [key]: val }));
  const keyword = params[0].keyword;
  console.log("app.get ~ keyword:", keyword);

  if (!keyword) return res.status(400).json({ message: "No keyword Provided" });

  try {
    const product_reviews = await handleAmazon(keyword);
    console.log("app.get ~ product_reviews:", product_reviews);
    res.send({
      status: true,
      message: "products fetched successfully",
      product_reviews,
    });
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
