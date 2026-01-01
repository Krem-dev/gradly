module.exports = {
  universities: [
    {
      id: 1,
      name: 'Kwame Nkrumah University of Science and Technology',
      abbreviation: 'KNUST',
      type: 'public',
      location: 'Kumasi',
      website: 'https://www.knust.edu.gh',
      admissionUrl: 'https://www.knust.edu.gh/admissions',
      scraperType: 'knust',
      selectors: {
        programTable: 'table.admission-requirements',
        programRow: 'tr',
        programName: 'td:nth-child(1)',
        programCode: 'td:nth-child(2)',
        minAggregate: 'td:nth-child(3)',
        requiredSubjects: 'td:nth-child(4)'
      }
    },
    {
      id: 2,
      name: 'University of Ghana',
      abbreviation: 'UG',
      type: 'public',
      location: 'Legon, Accra',
      website: 'https://www.ug.edu.gh',
      admissionUrl: 'https://www.ug.edu.gh/admissions',
      scraperType: 'ug',
      selectors: {
        programTable: '.programs-table',
        programRow: 'tbody tr',
        programName: 'td:nth-child(1)',
        minAggregate: 'td:nth-child(2)',
        requiredSubjects: 'td:nth-child(3)'
      }
    },
    {
      id: 3,
      name: 'University of Professional Studies, Accra',
      abbreviation: 'UPSA',
      type: 'public',
      location: 'Accra',
      website: 'https://www.upsa.edu.gh',
      admissionUrl: 'https://www.upsa.edu.gh/admissions',
      scraperType: 'upsa',
      selectors: {
        programTable: 'table',
        programRow: 'tr',
        programName: 'td:nth-child(1)',
        minAggregate: 'td:nth-child(2)'
      }
    },
    {
      id: 4,
      name: 'University of Cape Coast',
      abbreviation: 'UCC',
      type: 'public',
      location: 'Cape Coast',
      website: 'https://www.ucc.edu.gh',
      admissionUrl: 'https://www.ucc.edu.gh/admissions',
      scraperType: 'ucc',
      selectors: {}
    },
    {
      id: 5,
      name: 'University of Education, Winneba',
      abbreviation: 'UEW',
      type: 'public',
      location: 'Winneba',
      website: 'https://www.uew.edu.gh',
      admissionUrl: 'https://www.uew.edu.gh/admissions',
      scraperType: 'uew',
      selectors: {}
    },
    {
      id: 6,
      name: 'University of Mines and Technology',
      abbreviation: 'UMAT',
      type: 'public',
      location: 'Tarkwa',
      website: 'https://www.umat.edu.gh',
      admissionUrl: 'https://www.umat.edu.gh/admissions',
      scraperType: 'umat',
      selectors: {}
    },
    {
      id: 7,
      name: 'University for Development Studies',
      abbreviation: 'UDS',
      type: 'public',
      location: 'Tamale',
      website: 'https://www.uds.edu.gh',
      admissionUrl: 'https://www.uds.edu.gh/admissions',
      scraperType: 'uds',
      selectors: {}
    },
    {
      id: 8,
      name: 'Ghana Institute of Management and Public Administration',
      abbreviation: 'GIMPA',
      type: 'public',
      location: 'Accra',
      website: 'https://www.gimpa.edu.gh',
      admissionUrl: 'https://www.gimpa.edu.gh/admissions',
      scraperType: 'gimpa',
      selectors: {}
    },
    {
      id: 9,
      name: 'Ashesi University',
      abbreviation: 'ASHESI',
      type: 'private',
      location: 'Berekuso',
      website: 'https://www.ashesi.edu.gh',
      admissionUrl: 'https://www.ashesi.edu.gh/admissions',
      scraperType: 'ashesi',
      selectors: {}
    },
    {
      id: 10,
      name: 'Academic City University College',
      abbreviation: 'ACUC',
      type: 'private',
      location: 'Accra',
      website: 'https://www.acity.edu.gh',
      admissionUrl: 'https://www.acity.edu.gh/admissions',
      scraperType: 'acuc',
      selectors: {}
    }
  ],

  scraping: {
    timeout: 30000,
    retries: 3,
    retryDelay: 5000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    headless: true,
    waitForSelector: 3000
  },

  validation: {
    minAggregate: 6,
    maxAggregate: 54,
    minProgramNameLength: 5,
    maxProgramNameLength: 200,
    requiredFields: ['programName', 'minAggregate'],
    academicYearPattern: /^\d{4}\/\d{4}$/
  },

  schedule: {
    admissionSeason: {
      months: [6, 7, 8, 9],
      frequency: 'weekly'
    },
    offSeason: {
      frequency: 'monthly'
    },
    scrapeTime: '02:00'
  }
}
