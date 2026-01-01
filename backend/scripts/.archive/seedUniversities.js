const { pool } = require('../config/database')
require('dotenv').config()

async function seedUniversities() {
  console.log('Seeding Ghana universities...')

  const universities = [
    {
      name: 'Kwame Nkrumah University of Science and Technology',
      abbreviation: 'KNUST',
      type: 'public',
      location: 'Kumasi',
      website: 'https://www.knust.edu.gh',
      admission_url: 'https://www.knust.edu.gh/admissions',
      established_year: 1952
    },
    {
      name: 'University of Ghana',
      abbreviation: 'UG',
      type: 'public',
      location: 'Legon, Accra',
      website: 'https://www.ug.edu.gh',
      admission_url: 'https://www.ug.edu.gh/admissions',
      established_year: 1948
    },
    {
      name: 'University of Professional Studies, Accra',
      abbreviation: 'UPSA',
      type: 'public',
      location: 'Accra',
      website: 'https://www.upsa.edu.gh',
      admission_url: 'https://www.upsa.edu.gh/admissions',
      established_year: 1965
    },
    {
      name: 'University of Cape Coast',
      abbreviation: 'UCC',
      type: 'public',
      location: 'Cape Coast',
      website: 'https://www.ucc.edu.gh',
      admission_url: 'https://www.ucc.edu.gh/admissions',
      established_year: 1962
    },
    {
      name: 'University of Education, Winneba',
      abbreviation: 'UEW',
      type: 'public',
      location: 'Winneba',
      website: 'https://www.uew.edu.gh',
      admission_url: 'https://www.uew.edu.gh/admissions',
      established_year: 1992
    },
    {
      name: 'University of Mines and Technology',
      abbreviation: 'UMAT',
      type: 'public',
      location: 'Tarkwa',
      website: 'https://www.umat.edu.gh',
      admission_url: 'https://www.umat.edu.gh/admissions',
      established_year: 2004
    },
    {
      name: 'University for Development Studies',
      abbreviation: 'UDS',
      type: 'public',
      location: 'Tamale',
      website: 'https://www.uds.edu.gh',
      admission_url: 'https://www.uds.edu.gh/admissions',
      established_year: 1992
    },
    {
      name: 'Ghana Institute of Management and Public Administration',
      abbreviation: 'GIMPA',
      type: 'public',
      location: 'Accra',
      website: 'https://www.gimpa.edu.gh',
      admission_url: 'https://www.gimpa.edu.gh/admissions',
      established_year: 1961
    },
    {
      name: 'Ashesi University',
      abbreviation: 'ASHESI',
      type: 'private',
      location: 'Berekuso',
      website: 'https://www.ashesi.edu.gh',
      admission_url: 'https://www.ashesi.edu.gh/admissions',
      established_year: 2002
    },
    {
      name: 'Academic City University College',
      abbreviation: 'ACUC',
      type: 'private',
      location: 'Accra',
      website: 'https://www.acity.edu.gh',
      admission_url: 'https://www.acity.edu.gh/admissions',
      established_year: 2016
    }
  ]

  try {
    for (const uni of universities) {
      await pool.query(
        `INSERT INTO ghana_universities 
         (name, abbreviation, type, location, website, admission_url, established_year) 
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name),
         type = VALUES(type),
         location = VALUES(location),
         website = VALUES(website),
         admission_url = VALUES(admission_url),
         established_year = VALUES(established_year)`,
        [
          uni.name,
          uni.abbreviation,
          uni.type,
          uni.location,
          uni.website,
          uni.admission_url,
          uni.established_year
        ]
      )
      console.log(`✓ ${uni.abbreviation} - ${uni.name}`)
    }

    console.log('\n✓ Universities seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding universities:', error)
    process.exit(1)
  }
}

seedUniversities()
