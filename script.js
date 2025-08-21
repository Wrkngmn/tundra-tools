const regionTownMap = {
  "Southcentral": [
    "Anchorage", "Wasilla", "Palmer", "Eagle River", "Girdwood",
    "Seward", "Kenai", "Soldotna", "Homer", "Cordova",
    "Valdez", "Whittier", "Talkeetna", "Glennallen"
  ],
  "Interior": [
    "Fairbanks", "North Pole", "Delta Junction", "Tok", "Nenana",
    "Healy", "Fort Yukon", "Galena", "Bettles", "Manley Hot Springs",
    "Tanana", "Circle"
  ],
  "Southeast": [
    "Juneau", "Sitka", "Ketchikan", "Petersburg", "Wrangell",
    "Haines", "Skagway", "Craig", "Metlakatla", "Thorne Bay",
    "Angoon", "Klawock", "Yakutat"
  ],
  "Western": [
    "Nome", "Bethel", "Kotzebue", "Dillingham", "Unalakleet",
    "Hooper Bay", "Togiak", "Quinhagak", "Shishmaref", "Emmonak",
    "Scammon Bay", "St. Michael"
  ]
};
const regionCoords = {
  "Interior": [64.8378, -147.7164],
  "Southcentral": [61.2181, -149.9003],
  "Southeast": [58.3019, -134.4197],
  "Western": [64.5011, -165.4064]
};
const townCoords = {
  "Anchorage": [61.2181, -149.9003],
  "Wasilla": [61.5814, -149.4417],
  "Palmer": [61.5994, -149.1128],
  "Eagle River": [61.3215, -149.5670],
  "Girdwood": [60.9406, -149.1661],
  "Seward": [60.1042, -149.4422],
  "Kenai": [60.5544, -151.2583],
  "Soldotna": [60.4850, -151.0623],
  "Homer": [59.6425, -151.5483],
  "Cordova": [60.5428, -145.7577],
  "Valdez": [61.1258, -146.3483],
  "Whittier": [60.7744, -148.6833],
  "Talkeetna": [62.3209, -150.1066],
  "Glennallen": [62.1094, -145.5572],
  "Fairbanks": [64.8378, -147.7164],
  "North Pole": [64.7511, -147.3494],
  "Delta Junction": [64.0375, -145.7322],
  "Tok": [63.3361, -142.9842],
  "Nenana": [64.5645, -149.0928],
  "Healy": [63.8675, -148.9681],
  "Fort Yukon": [66.5647, -145.2736],
  "Galena": [64.7365, -156.9284],
  "Bettles": [66.9139, -151.5156],
  "Manley Hot Springs": [65.0049, -150.6264],
  "Tanana": [65.1714, -152.0781],
  "Circle": [65.8253, -144.0636],
  "Juneau": [58.3019, -134.4197],
  "Sitka": [57.0531, -135.3300],
  "Ketchikan": [55.3422, -131.6461],
  "Petersburg": [56.8125, -132.9556],
  "Wrangell": [56.4703, -132.3767],
  "Haines": [59.2358, -135.4450],
  "Skagway": [59.4586, -135.3139],
  "Craig": [55.4761, -133.1489],
  "Metlakatla": [55.1292, -131.5747],
  "Thorne Bay": [55.6903, -132.5211],
  "Angoon": [57.5036, -134.5836],
  "Klawock": [55.5547, -133.0958],
  "Yakutat": [59.5469, -139.7272],
  "Nome": [64.5011, -165.4064],
  "Bethel": [60.7922, -161.7558],
  "Kotzebue": [66.8983, -162.5967],
  "Dillingham": [59.0397, -158.4575],
  "Unalakleet": [63.8734, -160.7886],
  "Hooper Bay": [61.5286, -166.0967],
  "Togiak": [59.0634, -160.3975],
  "Quinhagak": [59.7556, -161.9156],
  "Shishmaref": [66.2569, -166.0714],
  "Emmonak": [62.7778, -164.5444],
  "Scammon Bay": [61.8442, -165.5706],
  "St. Michael": [63.4806, -162.0325]
};
const alaskaStations = [
  {name: 'Alexander Lake', id: '1267', triplet: '1267:AK:SNTL', lat: 61.75, lng: -150.89, elev: 170},
  {name: 'American Creek', id: '1189', triplet: '1189:AK:SNTL', lat: 64.79, lng: -141.23, elev: 1020},
  {name: 'Anchor River Divide', id: '1062', triplet: '1062:AK:SNTL', lat: 59.86, lng: -151.31, elev: 1650},
  {name: 'Anchorage Hillside', id: '1070', triplet: '1070:AK:SNTL', lat: 61.11, lng: -149.68, elev: 1910},
  {name: 'Aniak', id: '2065', triplet: '2065:AK:SNTL', lat: 61.58, lng: -159.58, elev: 90},
  {name: 'Atigun Pass', id: '957', triplet: '957:AK:SNTL', lat: 68.13, lng: -149.48, elev: 4780},
  {name: 'Bettles Field', id: '1182', triplet: '1182:AK:SNTL', lat: 66.91, lng: -151.53, elev: 640},
  {name: 'Chena Lakes', id: '1260', triplet: '1260:AK:SNTL', lat: 64.76, lng: -147.22, elev: 500},
  {name: 'Chisana', id: '1093', triplet: '1093:AK:SNTL', lat: 62.07, lng: -142.05, elev: 3320},
  {name: 'Coldfoot', id: '958', triplet: '958:AK:SNTL', lat: 67.25, lng: -150.18, elev: 1070},
  {name: 'Cooper Lake', id: '959', triplet: '959:AK:SNTL', lat: 60.39, lng: -149.69, elev: 1150},
  {name: 'Creamers Field', id: '1302', triplet: '1302:AK:SNTL', lat: 64.87, lng: -147.74, elev: 440},
  {name: 'Dahl Creek', id: '1303', triplet: '1303:AK:SNTL', lat: 66.95, lng: -156.90, elev
