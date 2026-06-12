const FLAG_ASSET_BY_NATION: Record<string, string> = {
  Algeria: "algeria",
  Argentina: "argentina",
  Australia: "australia",
  Austria: "austria",
  Belgium: "belgium",
  "Bosnia and Herzegovina": "bosnia-and-herzegovina",
  Brazil: "brazil",
  Canada: "canada",
  "Cape Verde": "cape-verde",
  Colombia: "colombia",
  Croatia: "croatia",
  Curaçao: "curacao",
  "Czech Republic": "czech-republic",
  "DR Congo": "dr-congo",
  Ecuador: "ecuador",
  Egypt: "egypt",
  England: "england",
  France: "france",
  Germany: "germany",
  Ghana: "ghana",
  Haiti: "haiti",
  Iran: "iran",
  Iraq: "iraq",
  "Ivory Coast": "ivory-coast",
  Japan: "japan",
  Jordan: "jordan",
  Mexico: "mexico",
  Morocco: "morocco",
  Netherlands: "netherlands",
  "New Zealand": "new-zealand",
  Norway: "norway",
  Panama: "panama",
  Paraguay: "paraguay",
  Portugal: "portugal",
  Qatar: "qatar",
  "Saudi Arabia": "saudi-arabia",
  Scotland: "scotland",
  Senegal: "senegal",
  "South Africa": "south-africa",
  "South Korea": "south-korea",
  Spain: "spain",
  Sweden: "sweden",
  Switzerland: "switzerland",
  Tunisia: "tunisia",
  Türkiye: "turkiye",
  "United States": "united-states",
  Uruguay: "uruguay",
  Uzbekistan: "uzbekistan"
};

export function getFlagAssetForNation(nation: string): string {
  const fileName = FLAG_ASSET_BY_NATION[nation];
  return fileName ? `/flags/${fileName}.svg` : "/flags/unknown.svg";
}

export function getConfiguredFlagNations(): string[] {
  return Object.keys(FLAG_ASSET_BY_NATION);
}
