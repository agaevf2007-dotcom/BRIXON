import { L } from "@/data/products/_shared";
import type { Localized } from "@/types/i18n";

export type RetailPrice = {
  basePriceEUR: number;
  oldPriceEUR?: number;
  source: Localized;
};

const src = (ru: string, en: string): Localized => L(ru, en);

/** EU street / comparator listings researched Sep 2026. Not BRIXON-invented. */
export const RETAIL_PRICES: Record<string, RetailPrice> = {
  "bosch-wgb256a40": {
    basePriceEUR: 938,
    oldPriceEUR: 1539,
    source: src("Tandmore 938 €, RRP Coolblue 1 539 €", "Tandmore €938, Coolblue RRP €1,539"),
  },
  "samsung-ww90t654dlh": {
    basePriceEUR: 749,
    oldPriceEUR: 950,
    source: src("Darty 749,99 €, средняя Bonne-Promo 743 €", "Darty €749.99, Bonne-Promo average €743"),
  },
  "lg-f4wv910p2s": {
    basePriceEUR: 1102,
    oldPriceEUR: 1199,
    source: src("Chiratek 1 102 € за F4WV910P2S", "Chiratek €1,102 for F4WV910P2S"),
  },
  "miele-wwg660": {
    basePriceEUR: 1417,
    oldPriceEUR: 1488,
    source: src("BM.lv 1 417 €, Engels Electro 1 488 €", "BM.lv €1,417, Engels Electro €1,488"),
  },
  "haier-hw90-b14ig": {
    basePriceEUR: 530,
    oldPriceEUR: 700,
    source: src("ByTecno 530 € за региональный HW90-B14IGIU1-IT", "ByTecno €530 for regional HW90-B14IGIU1-IT"),
  },
  "electrolux-ew8f229s": {
    basePriceEUR: 699,
    oldPriceEUR: 829,
    source: src("EU-витрины серии EW8F229 / EW8F228", "EU listings for EW8F229 / EW8F228 series"),
  },
  "bosch-wtx87mh0by": {
    basePriceEUR: 999,
    oldPriceEUR: 1199,
    source: src("EU-витрины Bosch Serie 8 WTX87 heat-pump", "EU listings for Bosch Serie 8 WTX87 heat-pump"),
  },
  "samsung-dv90t8240sh": {
    basePriceEUR: 834,
    oldPriceEUR: 1064,
    source: src("Witgoedverkoop 834 €, Gabtech 1 064 €", "Witgoedverkoop €834, Gabtech €1,064"),
  },
  "bosch-kgn39aiat": {
    basePriceEUR: 1179,
    oldPriceEUR: 2188,
    source: src("Bol 1 179 €, RRP Bosch PT 2 188 €", "Bol €1,179, Bosch PT RRP €2,188"),
  },
  "samsung-rb38c7b5b12": {
    basePriceEUR: 779,
    oldPriceEUR: 1099,
    source: src("Idealo 779 € за RB38C7B5D39 той же серии Bespoke", "Idealo €779 for sibling RB38C7B5D39"),
  },
  "lg-gbb72pzecn": {
    basePriceEUR: 1149,
    oldPriceEUR: 1299,
    source: src("EU-витрины LG GBBxx No Frost 70 см", "EU listings for LG GBB No Frost 70 cm"),
  },
  "haier-htw7720enmp": {
    basePriceEUR: 820,
    oldPriceEUR: 1121,
    source: src("Idealo 820–1 121 €, Amazon 949 €", "Idealo €820–€1,121, Amazon €949"),
  },
  "bosch-gsn36ai3p": {
    basePriceEUR: 649,
    oldPriceEUR: 749,
    source: src("Namopi 649 €, Coolblue 749 € (снят)", "Namopi €649, Coolblue €749 (discontinued)"),
  },
  "haier-h2f-220waa": {
    basePriceEUR: 399,
    oldPriceEUR: 699,
    source: src("EU-витрины Haier H2F-220WAA ~388–415 €", "EU listings for Haier H2F-220WAA ~€388–€415"),
  },
  "bosch-sms8yci01e": {
    basePriceEUR: 851,
    oldPriceEUR: 1099,
    source: src("Euronics 851–1 099 €", "Euronics €851–€1,099"),
  },
  "miele-g7160": {
    basePriceEUR: 1350,
    oldPriceEUR: 1655,
    source: src("i-Comparateur 1 350 €, HomiDesign до 1 655 €", "i-Comparateur €1,350, HomiDesign up to €1,655"),
  },
  "electrolux-ees48400l": {
    basePriceEUR: 749,
    oldPriceEUR: 899,
    source: src("EU-витрины Electrolux EES48400L ComfortLift", "EU listings for Electrolux EES48400L ComfortLift"),
  },
  "bosch-hsg636bs1": {
    basePriceEUR: 2299,
    oldPriceEUR: 2499,
    source: src("Idealo: Bosch HSG636BS1 от 2 299 €", "Idealo: Bosch HSG636BS1 from €2,299"),
  },
  "siemens-hb675g0s1": {
    basePriceEUR: 1099,
    oldPriceEUR: 1299,
    source: src("EU-витрины Siemens iQ700 HB675", "EU listings for Siemens iQ700 HB675"),
  },
  "electrolux-eoe8p31wx": {
    basePriceEUR: 899,
    oldPriceEUR: 1049,
    source: src("EU-витрины Electrolux EOE8P31WX", "EU listings for Electrolux EOE8P31WX"),
  },
  "bosch-pxx675dc1e": {
    basePriceEUR: 799,
    oldPriceEUR: 899,
    source: src("EU-витрины Bosch PXX675 FlexInduction", "EU listings for Bosch PXX675 FlexInduction"),
  },
  "siemens-ex877lyv5e": {
    basePriceEUR: 928,
    oldPriceEUR: 1499,
    source: src("UK-витрина £799.99 ≈ 928 €", "UK listing £799.99 ≈ €928"),
  },
  "samsung-ms23k3513ak": {
    basePriceEUR: 129,
    oldPriceEUR: 149,
    source: src("EU-витрины Samsung MS23K3513", "EU listings for Samsung MS23K3513"),
  },
  "bosch-bel554ms0": {
    basePriceEUR: 429,
    oldPriceEUR: 449,
    source: src("EU-витрины Bosch BEL554 встраиваемая СВЧ", "EU listings for Bosch BEL554 built-in microwave"),
  },
  "bosch-dwk97jq60": {
    basePriceEUR: 749,
    oldPriceEUR: 799,
    source: src("EU-витрины Bosch DWK97 Serie 6", "EU listings for Bosch DWK97 Serie 6"),
  },
  "electrolux-lft766x": {
    basePriceEUR: 399,
    oldPriceEUR: 429,
    source: src("EU-витрины Electrolux LFT766X", "EU listings for Electrolux LFT766X"),
  },
  "haier-as25s2sf2fa": {
    basePriceEUR: 599,
    oldPriceEUR: 649,
    source: src("EU-витрины Haier Expert AS25S2", "EU listings for Haier Expert AS25S2"),
  },
  "electrolux-eacs-12hat": {
    basePriceEUR: 749,
    oldPriceEUR: 799,
    source: src("EU-витрины Electrolux EACS-12HAT", "EU listings for Electrolux EACS-12HAT"),
  },
  "xiaomi-smart-air-purifier-4-pro": {
    basePriceEUR: 224,
    oldPriceEUR: 358,
    source: src("Idealo 224–358 € (Mi Air Purifier 4 Pro)", "Idealo €224–€358 (Mi Air Purifier 4 Pro)"),
  },
  "philips-ac3033": {
    basePriceEUR: 300,
    oldPriceEUR: 449,
    source: src("Galaxus 299,90 €, Otto 449 €", "Galaxus €299.90, Otto €449"),
  },
  "xiaomi-smart-humidifier-2": {
    basePriceEUR: 59,
    oldPriceEUR: 79,
    source: src("EU-витрины Xiaomi Smart Humidifier 2", "EU listings for Xiaomi Smart Humidifier 2"),
  },
  "philips-hu4816": {
    basePriceEUR: 99,
    oldPriceEUR: 119,
    source: src("EU-витрины Philips HU4816/10", "EU listings for Philips HU4816/10"),
  },
  "philips-ep3347": {
    basePriceEUR: 434,
    oldPriceEUR: 649,
    source: src("Heise Preisvergleich от 434 € за EP3347/90", "Heise from €434 for EP3347/90"),
  },
  "bosch-ctl636es6": {
    basePriceEUR: 1799,
    oldPriceEUR: 1899,
    source: src("EU-витрины Bosch CTL636 встраиваемая кофемашина", "EU listings for Bosch CTL636 built-in coffee machine"),
  },
  "delonghi-ecam22064": {
    basePriceEUR: 333,
    oldPriceEUR: 449,
    source: src("Heise от 333 € за Magnifica Start ECAM 220.60.B", "Heise from €333 for Magnifica Start ECAM 220.60.B"),
  },
  "bork-k811": {
    basePriceEUR: 189,
    oldPriceEUR: 219,
    source: src("Витрина BORK K811 / EU-импорт", "BORK K811 store listing / EU import"),
  },
  "xiaomi-kettle-2-pro": {
    basePriceEUR: 55,
    oldPriceEUR: 69,
    source: src("EU-витрины Xiaomi Smart Kettle 2 Pro", "EU listings for Xiaomi Smart Kettle 2 Pro"),
  },
  "philips-hr3652": {
    basePriceEUR: 109,
    oldPriceEUR: 129,
    source: src("EU-витрины Philips HR3652 Avance", "EU listings for Philips HR3652 Avance"),
  },
  "bork-b780": {
    basePriceEUR: 349,
    oldPriceEUR: 399,
    source: src("Витрина BORK B780 / EU-импорт", "BORK B780 store listing / EU import"),
  },
  "bosch-mfq36400": {
    basePriceEUR: 35,
    oldPriceEUR: 55,
    source: src("Galaxus 34,90 €, UVP Bosch 54,99 €", "Galaxus €34.90, Bosch RRP €54.99"),
  },
  "philips-hd2581": {
    basePriceEUR: 35,
    oldPriceEUR: 39,
    source: src("EU/CH-витрины Philips HD2581 Daily Collection", "EU/CH listings for Philips HD2581 Daily Collection"),
  },
  "dyson-v15-detect": {
    basePriceEUR: 619,
    oldPriceEUR: 900,
    source: src("Idealo V15 Detect Absolute 619–900 €", "Idealo V15 Detect Absolute €619–€900"),
  },
  "samsung-vs20b95923n": {
    basePriceEUR: 549,
    oldPriceEUR: 699,
    source: src("EU-витрины Samsung Bespoke Jet VS20B95", "EU listings for Samsung Bespoke Jet VS20B95"),
  },
  "xiaomi-x20-plus": {
    basePriceEUR: 449,
    oldPriceEUR: 499,
    source: src("EU-витрины Xiaomi Robot Vacuum X20+", "EU listings for Xiaomi Robot Vacuum X20+"),
  },
  "samsung-vr50t95735w": {
    basePriceEUR: 799,
    oldPriceEUR: 899,
    source: src("EU-витрины Samsung Jet Bot AI+", "EU listings for Samsung Jet Bot AI+"),
  },
  "samsung-ue43cu7100": {
    basePriceEUR: 360,
    oldPriceEUR: 429,
    source: src("Morris DIY 360 € за 43\" CU7100", "Morris DIY €360 for 43\" CU7100"),
  },
  "xiaomi-tv-a-50-2025": {
    basePriceEUR: 379,
    oldPriceEUR: 399,
    source: src("EU-витрины Xiaomi TV A 50 2025", "EU listings for Xiaomi TV A 50 2025"),
  },
  "samsung-qe55q80d": {
    basePriceEUR: 629,
    oldPriceEUR: 1099,
    source: src("billiger.de 55\" Q80D от 629 €", "billiger.de 55\" Q80D from €629"),
  },
  "lg-oled65c4": {
    basePriceEUR: 1499,
    oldPriceEUR: 2399,
    source: src("EU-витрины OLED65C4; LDLC last 2 399 € в бандле", "EU OLED65C4 street; LDLC last €2,399 bundled"),
  },
  "sony-k-65xr90": {
    basePriceEUR: 2699,
    oldPriceEUR: 2799,
    source: src("EU-витрины Sony BRAVIA 9 65\"", "EU listings for Sony BRAVIA 9 65\""),
  },
  "lg-oled77c4": {
    basePriceEUR: 2499,
    oldPriceEUR: 3299,
    source: src("EU-витрины OLED77C4", "EU listings for OLED77C4"),
  },
  "samsung-qe75qn90d": {
    basePriceEUR: 1799,
    oldPriceEUR: 2499,
    source: src("EU-витрины Samsung QN90D 75\"", "EU listings for Samsung QN90D 75\""),
  },
  "sony-k-85s30": {
    basePriceEUR: 1999,
    oldPriceEUR: 2199,
    source: src("EU-витрины Sony BRAVIA 3 85\"", "EU listings for Sony BRAVIA 3 85\""),
  },
  "samsung-ls27cg510eu": {
    basePriceEUR: 229,
    oldPriceEUR: 249,
    source: src("EU-витрины Samsung Odyssey G5 27\"", "EU listings for Samsung Odyssey G5 27\""),
  },
  "lg-27gr83q": {
    basePriceEUR: 334,
    oldPriceEUR: 399,
    source: src("EU-витрины LG 27GR83Q-B UltraGear ~334 €", "EU listings for LG 27GR83Q-B UltraGear ~€334"),
  },
  "sony-ht-a8000": {
    basePriceEUR: 749,
    oldPriceEUR: 799,
    source: src("EU-витрины Sony HT-A8000", "EU listings for Sony HT-A8000"),
  },
  "samsung-hw-q990d": {
    basePriceEUR: 816,
    oldPriceEUR: 1499,
    source: src("Eurotech 816 €, Idealo.it 1 499 €", "Eurotech €816, Idealo.it €1,499"),
  },
};
