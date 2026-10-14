import { L } from "@/data/products/_shared";
import type { Review } from "@/types/product";

const templates: Array<Omit<Review, "id" | "productId">> = [
  {
    name: "Elena M.",
    date: L("12 авг 2026", "12 Aug 2026"),
    rating: 5,
    title: L("Тише, чем ожидали", "Quieter than expected"),
    text: L(
      "Стоит в открытой кухне — после ужина о приборе не вспоминаешь. Установка в срок, упаковку забрали.",
      "It lives in an open kitchen — after dinner you forget it is there. Delivery on time, packaging taken away.",
    ),
  },
  {
    name: "James K.",
    date: L("3 июл 2026", "3 Jul 2026"),
    rating: 5,
    title: L("Выглядит как часть интерьера", "Looks like furniture"),
    text: L(
      "Фасад спокойный, приложение не лезет с уведомлениями без причины. Характеристики совпали с карточкой.",
      "Calm front, the app does not nag. The specifications matched the product page.",
    ),
  },
  {
    name: "Sofia R.",
    date: L("21 июн 2026", "21 Jun 2026"),
    rating: 4,
    title: L("Честная модель", "An honest machine"),
    text: L(
      "Не «умный ради умного». Нужные программы на месте, лишнего шума нет. Минус — ждали доставку шесть дней.",
      "Not smart for its own sake. The programmes you need are there, without extra noise. Delivery took six days.",
    ),
  },
];

const featuredReviews: Review[] = [
  {
    id: "r-bosch-wgb-1",
    productId: "bosch-wgb256a40",
    name: "Marcus T.",
    date: L("2 сен 2026", "2 Sep 2026"),
    rating: 5,
    title: L("Пар заменяет часть стирок", "Steam replaced extra washes"),
    text: L(
      "Serie 8 бережно к шерсти. Home Connect ставит отложенный старт без танцев с панелью.",
      "Serie 8 is gentle on wool. Home Connect sets a delayed start without fighting the panel.",
    ),
  },
  {
    id: "r-samsung-ww90-1",
    productId: "samsung-ww90t654dlh",
    name: "Hanna L.",
    date: L("18 мая 2026", "18 May 2026"),
    rating: 5,
    title: L("EcoBubble в холодной воде", "EcoBubble in cold water"),
    text: L(
      "WW90T654DLH отстирывает повседневное на 30 °C. AI Control запомнил наши циклы за две недели.",
      "The WW90T654DLH cleans everyday loads at 30 °C. AI Control learned our cycles in two weeks.",
    ),
  },
  {
    id: "r-lg-oled-1",
    productId: "lg-oled65c4",
    name: "Priya S.",
    date: L("29 авг 2026", "29 Aug 2026"),
    rating: 5,
    title: L("Чёрный как выключенный экран", "Black like an off screen"),
    text: L(
      "C4 в 65 дюймах — Filmmaker Mode без пересветов. webOS не тормозит, пульт MagIc не теряем.",
      "The 65\" C4 in Filmmaker Mode does not crush highlights. webOS stays snappy; the Magic remote is easy to find.",
    ),
  },
  {
    id: "r-dyson-1",
    productId: "dyson-v15-detect",
    name: "Amelia W.",
    date: L("9 сен 2026", "9 Sep 2026"),
    rating: 5,
    title: L("Лазер не маркетинг", "The laser is not marketing"),
    text: L(
      "На тёмном паркете видно пыль, которую обычный свет прячет. Станция в комплекте не нужна — хватает дока на стене.",
      "On dark parquet you see dust that ordinary light hides. We did not need a emptying station — the wall dock is enough.",
    ),
  },
];

export const reviews: Review[] = featuredReviews;

export function getReviewsForProduct(productId: string): Review[] {
  const specific = reviews.filter((review) => review.productId === productId);
  if (specific.length >= 2) return specific;
  return templates.map((template, index) => ({
    ...template,
    id: `${productId}-t${index}`,
    productId,
  }));
}