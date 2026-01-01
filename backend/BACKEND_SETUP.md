# Gradly Backend Setup Guide

## Project Structure

```
backend/
├── config/
│   └── database.js          # MySQL connection pool
├── services/
│   ├── wassce.service.js    # WASSCE calculation algorithms
│   └── program.service.js   # Program matching logic
├── routes/
│   └── calculator.routes.js # API endpoints
├── server.js                # Express server entry point
├── package.json             # Dependencies
├── .env.example             # Environment variables template
└── BACKEND_SETUP.md         # This file
```

## Installation

1. **Install Node.js** (v16 or higher)

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Database Setup

### Connection Details
- **Host**: your_db_host
- **Port**: your_db_port
- **User**: your_db_user
- **Password**: your_db_password
- **Database**: gradlyDB
- **SSL**: Required

### Required Tables

#### 1. Universities Table
```sql
CREATE TABLE universities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  region VARCHAR(100),
  website VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Programs Table
```sql
CREATE TABLE programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  universityId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  maxCutoff INT NOT NULL,
  requiredSubjects JSON,
  gradeRequirements JSON,
  tuition DECIMAL(10, 2),
  scholarshipAvailable BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (universityId) REFERENCES universities(id)
);
```

#### 3. Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Conversions Table
```sql
CREATE TABLE conversions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  type VARCHAR(50),
  inputData JSON,
  result JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## API Endpoints

### 1. Calculate WASSCE Aggregate
**POST** `/api/calculator/calculate-aggregate`

**Request**:
```json
{
  "grades": ["A1", "B2", "B3", "C4", "C5", "C6"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "aggregate": 21,
    "best6Grades": [1, 2, 3, 4, 5, 6],
    "totalSubjects": 6
  }
}
```

### 2. Get Program Recommendations
**POST** `/api/calculator/get-recommendations`

**Request**:
```json
{
  "grades": ["A1", "B2", "B3", "C4", "C5", "C6"],
  "subjects": [
    { "name": "Mathematics", "grade": "A1" },
    { "name": "English", "grade": "B2" },
    { "name": "Physics", "grade": "B3" },
    { "name": "Chemistry", "grade": "C4" },
    { "name": "Biology", "grade": "C5" },
    { "name": "Elective", "grade": "C6" }
  ],
  "userPlan": "free",
  "filters": {
    "category": "Engineering",
    "region": "Accra"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "aggregate": 21,
    "totalEligible": 5,
    "recommendations": [
      {
        "id": 1,
        "university": "University of Ghana",
        "program": "Computer Science",
        "category": "Engineering",
        "cutoff": 24,
        "studentScore": 21,
        "margin": 3,
        "requiredSubjects": ["Mathematics", "Physics"]
      },
      {
        "id": 2,
        "university": "KNUST",
        "program": "Electrical Engineering",
        "category": "Engineering",
        "cutoff": 26,
        "studentScore": 21,
        "margin": 5,
        "requiredSubjects": ["Mathematics", "Physics", "Chemistry"]
      }
    ],
    "showUpgradePrompt": true
  }
}
```

## University Data Management

### Strategy for Getting University Cutoff Points

#### Option 1: Manual Data Entry (MVP)
- Create admin panel to manually add universities and programs
- Update cutoff points as they change annually
- **Pros**: Accurate, controlled
- **Cons**: Time-consuming, requires manual updates

#### Option 2: Web Scraping
- Scrape from official university websites (JAMB, WAEC, etc.)
- Use libraries like `cheerio` or `puppeteer`
- **Pros**: Automated, up-to-date
- **Cons**: Websites may change structure, legal considerations

#### Option 3: API Integration
- Partner with education platforms (if available)
- Use official APIs from JAMB, WAEC
- **Pros**: Reliable, official data
- **Cons**: May require partnerships, costs

#### Option 4: Hybrid Approach (Recommended for MVP)
1. Start with manual data entry for core universities
2. Add scraping for specific websites
3. Allow user contributions/corrections
4. Plan API integration for future

### Recommended Implementation

**Phase 1 (MVP)**:
- Create admin dashboard to add universities/programs
- Manually populate with top 20-30 Ghanaian universities
- Update annually before admission season

**Phase 2 (Post-MVP)**:
- Implement web scraper for JAMB Nigeria
- Add WAEC official cutoff data
- Create data validation system

**Phase 3 (Future)**:
- Partner with universities for official APIs
- Implement real-time data sync
- Add international university support

### Web Scraper Example (Future)
```javascript
// Example structure for future scraper
const cheerio = require('cheerio')
const axios = require('axios')

async function scrapeUniversityCutoffs(url) {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    
    const programs = []
    $('table tr').each((i, elem) => {
      const cells = $(elem).find('td')
      if (cells.length > 0) {
        programs.push({
          name: $(cells[0]).text(),
          cutoff: parseInt($(cells[1]).text()),
          category: $(cells[2]).text()
        })
      }
    })
    
    return programs
  } catch (error) {
    console.error('Scraping failed:', error)
  }
}
```

## Environment Variables

Create a `.env` file with:
```
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=gradlyDB
DB_SSL=true
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Testing

Run tests:
```bash
npm test
```

## Deployment

For production:
1. Set `NODE_ENV=production`
2. Use environment variables for all secrets
3. Enable HTTPS
4. Set up proper error logging
5. Configure CORS for production domain
6. Use connection pooling for database

## Next Steps

1. ✓ Set up Node.js backend structure
2. ✓ Configure MySQL connection
3. ✓ Create API endpoints
4. Create database tables
5. Populate initial university data
6. Connect frontend to backend API
7. Implement user authentication
8. Add data scraping/management system
