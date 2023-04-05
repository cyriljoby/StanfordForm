import schoolData from '../assets/school-data.json'

const narrowCities = (state) => {
    const cities = schoolData
        .filter((school) => school.state === state)
        .map((school) => school.city)
        .sort();

    return [...new Set(cities)]
}

const narrowSchools = (state, city) => {
    console.log(state, city)
    const schools = schoolData
        .filter((school) => school.state === state && school.city === city)
        .map((school) => school.name)
        .sort();

    return [...new Set(schools)]
}

export { narrowCities, narrowSchools }
