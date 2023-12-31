const City = require("../../models/City");
const Country = require("../../models/Country");
const { readJSONFile } = require("../../helpers/fs.helper");

function removeOID(objectsArray) {
    objectsArray.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object' && '$oid' in obj[key]) {
                const oidValue = obj[key]['$oid'];
                obj[key] = oidValue; // Replace parent key's value with "$oid" value
            }
        });
    });

    return objectsArray;
}
function removeDuplicates(arr1, arr2) {
    const set2 = new Set(arr2);
    return new Set(arr1.filter(item => !set2.has(item)));
}

module.exports = {
    storePlaces: async () => {

        const dbCities = await City.find().select('id');
        const fileCities = removeOID(await readJSONFile('./scripts/seeds/cities.json'));
        const uniqueCities = removeDuplicates(fileCities.map(item => item._id), dbCities.map(item => item._id.toString()));
        const cities = fileCities
            .filter(item => uniqueCities.has(item._id))
            .map(item => new City(item))

        const dbCountries = await Country.find().select('id');
        const fileCountries = removeOID(await readJSONFile('./scripts/seeds/countries.json'));
        const uniqueCountries = removeDuplicates(fileCountries.map(item => item._id), dbCountries.map(item => item._id.toString()));
        const countries = fileCountries
            .filter(item => uniqueCountries.has(item._id))
            .map(item => new Country(item))

        await City.insertMany(cities);
        await Country.insertMany(countries);
    }
}