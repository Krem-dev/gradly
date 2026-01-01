# Gradly Backend

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Initialize database:
```bash
mysql -h krem-kremlin-0821.g.aivencloud.com -P 27945 -u avnadmin -p < db/init.sql
mysql -h krem-kremlin-0821.g.aivencloud.com -P 27945 -u avnadmin -p < db/seed.sql
```

4. Start server:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile/:id` - Get user profile

### SHS Calculator
- `POST /api/shs/calculate-aggregate` - Calculate WASSCE aggregate
- `POST /api/shs/get-recommendations` - Get program recommendations
- `POST /api/shs/save-conversion` - Save calculation

### University Converter
- `POST /api/converter/convert-cwa-to-cgpa` - Convert percentage to CGPA
- `POST /api/converter/save-conversion` - Save conversion

### Dashboard
- `GET /api/dashboard/stats/:userId` - Get user stats
- `GET /api/dashboard/conversions/:userId` - Get conversion history
- `DELETE /api/dashboard/conversion/:conversionId` - Delete conversion

### Admin (Data Management)
- `POST /api/admin/universities` - Add university
- `GET /api/admin/universities` - List universities
- `PUT /api/admin/universities/:id` - Update university
- `DELETE /api/admin/universities/:id` - Delete university
- `POST /api/admin/programs` - Add program
- `GET /api/admin/programs/:universityId` - List programs
- `PUT /api/admin/programs/:id` - Update program
- `DELETE /api/admin/programs/:id` - Delete program
