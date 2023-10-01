import express from "express";
import { handleAmazon } from "./Functions/handleAmazon";
import cors from cors;

const app = express();

app.use(cors());

const base_url = process.env.BASEURL || "http://localhost:5000";
const port = process.env.PORT || 5000;
console.log("base_url:", base_url);
console.log("port:", port);

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

app.listen(port, () => {
  console.log("Server started on port: ", port);
});
