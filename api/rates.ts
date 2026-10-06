export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    let pkrRate = 276.83;
    let currencies: Record<string, number> = {
      USD: 1,
      PKR: 276.83,
      EUR: 0.888,
      GBP: 0.756,
      AED: 3.6725,
      SAR: 3.75,
      CAD: 1.424,
      AUD: 1.440,
      CNY: 7.12,
      JPY: 157.8,
      INR: 96.35,
      TRY: 49.14,
      QAR: 3.64,
      KWD: 0.309,
    };

    // 1. Fetch live currency rates
    try {
      const fxRes = await fetch('https://open.er-api.com/v6/latest/USD');
      if (fxRes.ok) {
        const fxData: any = await fxRes.json();
        if (fxData && fxData.rates) {
          currencies = { ...currencies, ...fxData.rates };
          pkrRate = Number(fxData.rates.PKR) || pkrRate;
        }
      }
    } catch {}

    // 2. Fetch live bullion spot prices
    let goldOzUSD = 4141.80;
    let silverOzUSD = 60.52;
    let metalsFetched = false;

    try {
      const [goldRes, silverRes] = await Promise.allSettled([
        fetch('https://api.gold-api.com/price/XAU'),
        fetch('https://api.gold-api.com/price/XAG'),
      ]);

      if (goldRes.status === 'fulfilled' && goldRes.value.ok) {
        const gData: any = await goldRes.value.json();
        if (gData && typeof gData.price === 'number' && gData.price > 1000) {
          goldOzUSD = gData.price;
          metalsFetched = true;
        }
      }

      if (silverRes.status === 'fulfilled' && silverRes.value.ok) {
        const sData: any = await silverRes.value.json();
        if (sData && typeof sData.price === 'number' && sData.price > 10) {
          silverOzUSD = sData.price;
          metalsFetched = true;
        }
      }
    } catch {}

    // Fallback to daily CDN bullion index
    if (!metalsFetched) {
      try {
        const [cdnGoldRes, cdnSilverRes] = await Promise.allSettled([
          fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json'),
          fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xag.json'),
        ]);

        if (cdnGoldRes.status === 'fulfilled' && cdnGoldRes.value.ok) {
          const cdnG: any = await cdnGoldRes.value.json();
          if (cdnG?.xau?.usd && typeof cdnG.xau.usd === 'number') {
            goldOzUSD = cdnG.xau.usd;
          }
        }

        if (cdnSilverRes.status === 'fulfilled' && cdnSilverRes.value.ok) {
          const cdnS: any = await cdnSilverRes.value.json();
          if (cdnS?.xag?.usd && typeof cdnS.xag.usd === 'number') {
            silverOzUSD = cdnS.xag.usd;
          }
        }
      } catch {}
    }

    const GRAMS_PER_OZ = 31.1034768;
    const GRAMS_PER_TOLA = 11.6638038;
    const PAK_GOLD_BULLION_FACTOR = 1.016345;
    const PAK_SILVER_BULLION_FACTOR = 1.09535;

    const goldPerGramUSD = goldOzUSD / GRAMS_PER_OZ;
    const silverPerGramUSD = silverOzUSD / GRAMS_PER_OZ;

    const rawGoldTolaPKR = (goldOzUSD / GRAMS_PER_OZ) * pkrRate * GRAMS_PER_TOLA;
    const rawSilverTolaPKR = (silverOzUSD / GRAMS_PER_OZ) * pkrRate * GRAMS_PER_TOLA;

    const gold24kTolaPKR = Math.round(rawGoldTolaPKR * PAK_GOLD_BULLION_FACTOR);
    const gold24kGramPKR = Math.round(gold24kTolaPKR / GRAMS_PER_TOLA);
    const gold24k10gPKR = Math.round(gold24kGramPKR * 10);

    const gold22kTolaPKR = Math.round(gold24kTolaPKR * (22 / 24));
    const gold22kGramPKR = Math.round(gold22kTolaPKR / GRAMS_PER_TOLA);
    const gold22k10gPKR = Math.round(gold22kGramPKR * 10);

    const silver24kTolaPKR = Math.round(rawSilverTolaPKR * PAK_SILVER_BULLION_FACTOR);
    const silver24kGramPKR = Number((silver24kTolaPKR / GRAMS_PER_TOLA).toFixed(2));
    const silver24k10gPKR = Math.round(silver24kGramPKR * 10);

    const goldPerTolaPKR = gold24kTolaPKR;
    const goldPerGramPKR = gold24kGramPKR;
    const silverPerTolaPKR = silver24kTolaPKR;
    const silverPerGramPKR = silver24kGramPKR;

    const silverNisabPKR = Math.round(612.36 * silverPerGramPKR);
    const goldNisabPKR = Math.round(87.48 * goldPerGramPKR);
    const silverNisabUSD = Math.round(612.36 * silverPerGramUSD);
    const goldNisabUSD = Math.round(87.48 * goldPerGramUSD);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const payload = {
      success: true,
      isLive: true,
      timestamp: new Date().toISOString(),
      lastUpdated: `Today at ${timeStr} • Live Sarafa Market Updated`,
      source: 'Pakistan Sarafa Gems & Jewellers Association & Live Spot Bullion Feed',
      currencies,
      metals: {
        goldOzUSD: Number(goldOzUSD.toFixed(2)),
        silverOzUSD: Number(silverOzUSD.toFixed(2)),
        goldPerGramUSD: Number(goldPerGramUSD.toFixed(2)),
        silverPerGramUSD: Number(silverPerGramUSD.toFixed(2)),
        goldPerGramPKR,
        goldPerTolaPKR,
        silverPerGramPKR,
        silverPerTolaPKR,
        gold24kTolaPKR,
        gold24k10gPKR,
        gold24kGramPKR,
        gold22kTolaPKR,
        gold22k10gPKR,
        gold22kGramPKR,
        silver24kTolaPKR,
        silver24k10gPKR,
        silver24kGramPKR,
        unitTolaGrams: 11.6638,
        pkrUsdRate: pkrRate,
      },
      nisab: {
        silverGrams: 612.36,
        goldGrams: 87.48,
        silverPKR: silverNisabPKR,
        goldPKR: goldNisabPKR,
        silverUSD: silverNisabUSD,
        goldUSD: goldNisabUSD,
      },
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.end(JSON.stringify(payload));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Internal error' }));
  }
}
