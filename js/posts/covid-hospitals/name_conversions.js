// Convert community names from LA County Dept of Public Health to community names from LA Times mapping project

var conversions = {
  // LA neighborhoods
  Alsace: 'Playa Vista',
  'Angelino Heights': 'Echo Park',
  'Baldwin Hills': 'Baldwin Hills/Crenshaw',
  Brookside: 'Mid-Wilshire',
  'Cadillac-Corning': 'Mid-Wilshire',
  'Century Palms/Cove': 'Broadway-Manchester',
  Central: 'Historic South-Central',
  'Cloverdale/Cochran': 'Mid-City',
  'Country Club Park': 'Arlington Heights',
  'Crenshaw District': 'Baldwin Hills/Crenshaw',
  Crestview: 'Pico-Robertson',
  Exposition: 'Exposition Park',
  'Faircrest Heights': 'Mid-City',
  'Figueroa Park Square': 'Vermont Vista',
  'Gramercy Place': 'Gramercy Park',
  'Harbor Pines': 'Harbor City',
  'Historic Filipinotown': 'Westlake',
  'Lafayette Square': 'Mid-City',
  'Lakeview Terrace': 'Lake View Terrace',
  'Little Armenia': 'East Hollywood',
  'Little Bangladesh': 'Koreatown',
  'Little Tokyo': 'Downtown',
  Longwood: 'Mid-Wilshire',
  'Mandeville Canyon': 'Brentwood',
  'Marina Peninsula': 'Venice',
  Melrose: 'Fairfax',
  'Mid-city': 'Mid-City',
  'Miracle Mile': 'Mid-Wilshire',
  'Mt. Washington': 'Mount Washington',
  'Palisades Highlands': 'Pacific Palisades',
  'Park La Brea': 'Mid-Wilshire',
  'Playa Del Rey': 'Playa del Rey',
  'Regent Square': 'Santa Monica',
  'Reseda Ranch': 'Reseda',
  'Reynier Village': 'Mid-City',
  Silverlake: 'Silver Lake',
  'South Carthay': 'Carthay',
  'St Elmo Village': 'Mid-City',
  'Sycamore Square': 'Mid-Wilshire',
  'Temple-Beaudry': 'Echo Park',
  'Thai Town': 'East Hollywood',
  'Toluca Terrace': 'North Hollywood',
  'Toluca Woods': 'Toluca Lake',
  'University Hills': 'El Sereno',
  'Vernon Central': 'Central-Alameda',
  'Victoria Park': 'Mid-City',
  'View Heights': 'Hyde Park',
  'Wellington Square': 'Mid-City',
  'West Vernon': 'Vernon',
  'Wholesale District': 'Downtown',
  'Wilshire Center': 'Koreatown',
  // Unincorporated Areas
  Anaverde: 'Palmdale',
  'Angeles National Forest': 'Angeles Crest',
  'Athens Village': 'Willowbrook',
  Bassett: 'Avocado Heights',
  'Covina (Charter Oak)': 'Charter Oak',
  'East Covina': 'San Dimas',
  'East Lancaster': 'Lancaster',
  'East Rancho Dominguez': 'East Compton',
  'East Whittier': 'East La Mirada',
  'El Camino Village': 'Alondra Park',
  'Hi Vista': 'Northeast Antelope Valley',
  'Kagel/Lopez Canyons': 'Lopez/Kagel Canyons',
  'La Rambla': 'San Pedro',
  'Lake Manor': 'Chatsworth',
  'Littlerock/Juniper Hills': 'Southeast Antelope Valley',
  'Littlerock/Pearblossom': 'Southeast Antelope Valley',
  Llano: 'Northeast Antelope Valley',
  Newhall: 'Santa Clarita',
  'North Lancaster': 'Lancaster',
  'Northeast San Gabriel': 'East San Gabriel',
  'Padua Hills': 'Claremont',
  'Palos Verdes Peninsula': 'Rancho Palos Verdes',
  'Pearblossom/Llano': 'Northeast Antelope Valley',
  'Pellissier Village': 'Avocado Heights',
  'Placerita Canyon': 'Tujunga Canyons',
  Roosevelt: 'Lake Los Angeles',
  Rosewood: 'Compton',
  'Rosewood/East Gardena': 'West Compton',
  'Rosewood/West Rancho Dominguez': 'West Compton',
  'San Jose Hills': 'South San Jose Hills',
  'Sand Canyon': 'Northwest Antelope Valley',
  Saugus: 'Santa Clarita',
  'Saugus/Canyon Country': 'Santa Clarita',
  'South Antelope Valley': 'Southeast Antelope Valley',
  'Sunrise Village': 'Whittier',
  'Twin Lakes/Oat Mountain': 'Santa Susana Mountains',
  Valencia: 'Santa Clarita',
  'View Park/Windsor Hills': 'View Park-Windsor Hills',
  'West LA': 'West Los Angeles',
  'West Antelope Valley': 'Northwest Antelope Valley',
  'West Rancho Dominguez': 'West Compton',
  Wiseburn: 'El Segundo',
  Westhills: 'West Hills',
  'West Whittier/Los Nietos': 'West Whittier-Los Nietos',
  'Westfield/Academy Hills': 'Rolling Hills',
  'Canyon Country': 'Santa Clarita',
  'Bouquet Canyon': 'Santa Clarita',
  'Del Sur': 'Lancaster',
  'White Fence Farms': 'Lancaster',
};