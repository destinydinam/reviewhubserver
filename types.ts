export type Review = {
  title: string;
  review: string;
  date: string;
  rating: number;
};

export type Product_Review = {
  name: string;
  price: string;
  reviews: Review[];
};
