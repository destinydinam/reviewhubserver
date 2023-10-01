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
const express_1 = __importDefault(require("express"));
const handleAmazon_1 = require("./Functions/handleAmazon");
const app = (0, express_1.default)();
const base_url = "http://213.52.129.206";
app.get("/v1/api/amazon", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const req_url = new URL(base_url + req.url);
    if (!req_url.search)
        return res.status(400).json({ message: "No keyword Provided" });
    const params = [];
    (_a = req_url.searchParams) === null || _a === void 0 ? void 0 : _a.forEach((val, key) => params.push({ [key]: val }));
    const keyword = params[0].keyword;
    console.log("app.get ~ keyword:", keyword);
    if (!keyword)
        return res.status(400).json({ message: "No keyword Provided" });
    try {
        const product_reviews = yield (0, handleAmazon_1.handleAmazon)(keyword);
        console.log("app.get ~ product_reviews:", product_reviews);
        res.send({
            status: true,
            message: "products fetched successfully",
            product_reviews,
        });
    }
    catch (err) {
        console.error(err);
        return null;
    }
}));
app.listen(process.env.PORT || 3001, () => {
    console.log("Server started");
});
//# sourceMappingURL=index.js.map