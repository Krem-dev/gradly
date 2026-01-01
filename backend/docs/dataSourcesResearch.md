# Ghana University Cutoff Points - Data Sources Research

## Challenge
Ghana universities don't publish cutoff points in easily scrapable HTML tables on their websites. The data is typically published in:
1. PDF documents
2. News releases
3. Social media posts
4. Education news websites

## Actual Sources of Cutoff Points

### 1. University Official Releases (PDFs)
- Universities publish admission lists and cutoff points as PDF documents
- Usually released after each admission cycle
- Example: "KNUST 2024/2025 Admission List and Cutoff Points"

### 2. Education News Websites
**GhanaWeb Education**
- URL: https://www.ghanaweb.com/GhanaHomePage/education/
- Publishes cutoff points when released

**MyJoyOnline Education**
- URL: https://www.myjoyonline.com/category/education/
- Reports on university admissions

**Citifmonline Education**
- URL: https://citifmonline.com/category/education/
- Covers university admission news

**EducationWeb Ghana**
- URL: https://educationweb.com.gh/
- Dedicated education portal

### 3. Social Media
- University Facebook pages
- Twitter/X announcements
- WhatsApp groups (unofficial)

### 4. Ghana Tertiary Education Commission (GTEC)
- May have consolidated data
- Official regulatory body

## Recommended Approach

### Option 1: Scrape Education News Sites
**Pros:**
- Data is already extracted from PDFs
- Formatted in HTML (easier to scrape)
- Multiple sources for verification

**Cons:**
- Not always up-to-date
- May have errors
- Need to scrape multiple sites

### Option 2: Parse University PDF Documents
**Pros:**
- Official source (most accurate)
- Complete data

**Cons:**
- PDFs are hard to parse
- Format varies by university
- Need to find PDF URLs

### Option 3: Hybrid Approach (RECOMMENDED)
1. Scrape education news sites for recent data
2. Parse PDFs when available
3. Cross-reference multiple sources
4. Manual verification for top programs

### Option 4: Community-Sourced + Verification
1. Allow users to submit cutoff points
2. Verify against official sources
3. Build database over time
4. Update annually

## Next Steps

1. **Immediate:** Scrape EducationWeb Ghana and MyJoyOnline for recent cutoff data
2. **Short-term:** Build PDF parser for official documents
3. **Long-term:** Set up monitoring for new releases
4. **Ongoing:** Manual updates for top 50 programs

## Sample Data Structure Needed

```json
{
  "university": "KNUST",
  "program": "BSc Computer Science",
  "academicYear": "2024/2025",
  "minAggregate": 8,
  "requiredSubjects": ["Mathematics", "Physics", "Chemistry"],
  "source": "https://educationweb.com.gh/knust-cutoff-2024",
  "datePublished": "2024-09-15"
}
```
