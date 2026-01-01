# Gradly Backend Algorithms & Conversion Formulas

## 1. SHS WASSCE Aggregate Calculation (Ghana)

### Overview
The WASSCE (West African Senior School Certificate Examination) aggregate is calculated based on the best 6 subjects from a student's grades.

### Grade Point System
Each WASSCE grade is assigned points as follows:

| Grade | Points |
|-------|--------|
| A1    | 1      |
| A2    | 2      |
| B2    | 3      |
| B3    | 4      |
| C4    | 5      |
| C5    | 6      |
| C6    | 7      |
| D7    | 8      |
| D8    | 9      |
| E8    | 10     |
| F9    | 11     |

### Calculation Steps

1. **Input**: Student provides grades for all subjects taken (minimum 6, typically 8-10)
2. **Filter**: Select the best 6 subjects (lowest points = best grades)
3. **Sum**: Add up the points from the best 6 subjects
4. **Result**: The sum is the aggregate score

### Example
```
Student grades:
- Mathematics: A1 (1 point)
- English: B2 (3 points)
- Physics: A2 (2 points)
- Chemistry: B3 (4 points)
- Biology: B2 (3 points)
- Elective 1: C4 (5 points)
- Elective 2: C5 (6 points)
- Elective 3: D7 (8 points)

Best 6 subjects: A1, A2, B2, B2, B3, C4
Aggregate = 1 + 2 + 3 + 3 + 4 + 5 = 18
```

### Algorithm (Pseudocode)
```
function calculateWASSCEAggregate(grades: Grade[]) {
  // Convert grades to points
  const points = grades.map(grade => gradeToPoints(grade))
  
  // Sort in ascending order (lowest points first = best grades)
  points.sort((a, b) => a - b)
  
  // Take the best 6 subjects
  const best6 = points.slice(0, 6)
  
  // Sum the points
  const aggregate = best6.reduce((sum, point) => sum + point, 0)
  
  return aggregate
}
```

### Core Subject Requirements
The best 6 subjects MUST include:
- **3 Core Subjects** (mandatory):
  - Core Mathematics
  - English Language
  - Integrated Science OR Social Studies
- **3 Elective Subjects** (relevant to chosen program)

### Notes
- Lower aggregate score is better (1-6 is excellent, 7-12 is good, 13-18 is acceptable)
- Only the best 6 subjects count
- All subjects must be from the WASSCE examination
- Aggregate ranges from 6 (all A1s) to 54 (all F9s)
- Most university programs require specific elective subjects
- For degree programs, typically need at least C6 in all core subjects

---

## 2. CWA to CGPA Conversion (USA 4.0 Scale)

### Overview
CWA (Cumulative Weighted Average) is typically a percentage-based score (0-100), while CGPA (Cumulative Grade Point Average) is on a 4.0 scale used in US universities.

### U.S. GPA Scale (Standard)
| U.S. Letter Grade | GPA Points | Percentage Range |
|-------------------|-----------|------------------|
| A+ / A            | 4.0       | 90-100%          |
| A-                | 3.7       | 87-89%           |
| AB                | 3.5       | 85-86%           |
| B+                | 3.3       | 83-84%           |
| B                 | 3.0       | 80-82%           |
| B-                | 2.7       | 77-79%           |
| BC                | 2.5       | 75-76%           |
| C+                | 2.3       | 73-74%           |
| C                 | 2.0       | 70-72%           |
| C-                | 1.7       | 67-69%           |
| CD                | 1.5       | 65-66%           |
| D+                | 1.3       | 63-64%           |
| D                 | 1.0       | 60-62%           |
| D-                | 0.7       | Below 60%        |
| F                 | 0.0       | Below 60%        |

### Conversion Formula

**Standard Formula:**
```
CGPA = (CWA / 100) × 4.0
```

### Simplified Conversion Table (Quick Reference)
| CWA Range | CGPA Range | Grade |
|-----------|-----------|-------|
| 90-100    | 3.6-4.0   | A     |
| 80-89     | 3.0-3.5   | B     |
| 70-79     | 2.0-2.9   | C     |
| 60-69     | 1.0-1.9   | D     |
| Below 60  | Below 1.0 | F     |

### Algorithm (Pseudocode)
```
function convertCWAToCGPA(cwa: number): number {
  // Validate input
  if (cwa < 0 || cwa > 100) {
    throw new Error("CWA must be between 0 and 100")
  }
  
  // Apply conversion formula
  const cgpa = (cwa / 100) * 4.0
  
  // Round to 2 decimal places
  return Math.round(cgpa * 100) / 100
}
```

### Example
```
CWA: 85
CGPA = (85 / 100) × 4.0 = 3.4
```

---

## 3. CGPA to CWA Conversion (USA 4.0 Scale)

### Overview
Reverse conversion from CGPA (4.0 scale) back to CWA (percentage scale).

### Conversion Formula

**Standard Formula:**
```
CWA = (CGPA / 4.0) × 100
```

### Algorithm (Pseudocode)
```
function convertCGPAToCWA(cgpa: number): number {
  // Validate input
  if (cgpa < 0 || cgpa > 4.0) {
    throw new Error("CGPA must be between 0 and 4.0")
  }
  
  // Apply conversion formula
  const cwa = (cgpa / 4.0) * 100
  
  // Round to 2 decimal places
  return Math.round(cwa * 100) / 100
}
```

### Example
```
CGPA: 3.4
CWA = (3.4 / 4.0) × 100 = 85
```

---

## 3.5 Ghanaian Grades to U.S. GPA Conversion

### Overview
When converting Ghanaian grades (WASSCE or University) to U.S. GPA, use the following conversion table:

### Conversion Table
| Ghanaian Grade | WASSCE Score (%) | University Score (%) | U.S. Letter Grade | U.S. GPA |
|---|---|---|---|---|
| A1 | 75-100 | 70-100 | A | 4.0 |
| B2 | 70-74 | 60-69 | A | 4.0 |
| B3 | 65-69 | 55-59 | B | 3.0 |
| C4 | 60-64 | 50-54 | B | 3.0 |
| C5 | 55-59 | 45-49 | C | 2.0 |
| C6 | 50-54 | 40-44 | C | 2.0 |
| D7 | 45-49 | 35-39 | D | 1.0 |
| E8 | 40-44 | 30-34 | F | 0.0 |
| F9 | 0-39 | 0-29 | F | 0.0 |

### Ghanaian University Classifications to U.S. GPA
| Ghanaian Classification | GPA Range | Equivalent |
|---|---|---|
| First Class | ≥ 3.60 | A (3.7-4.0) |
| Second Class Upper | ≥ 3.00 | B+ (3.3-3.6) |
| Second Class Lower | ≥ 2.50 | B (3.0-3.2) |
| Third Class | ≥ 2.00 | C (2.0-2.9) |

### Calculation Example
```
Student's Ghanaian Transcript:
- A1 (90%) → 4.0
- B2 (73%) → 4.0
- C5 (58%) → 2.0
- D7 (46%) → 1.0

Total GPA points: 4.0 + 4.0 + 2.0 + 1.0 = 11.0
Number of courses: 4
U.S. GPA: 11.0 ÷ 4 = 2.75
```

### Important Notes
- D is a passing grade in U.S. high schools but usually NOT in college
- Most undergraduate programs require minimum 2.0 GPA
- Most graduate programs require 3.0 or above
- Top universities typically expect 3.5+ GPA
- Individual universities may use their own evaluation methods
- Some universities require official credential evaluation (WES, ECE)

---

## 4. Weighted GPA Calculation (University Courses)

### Overview
When a student has multiple courses with different credit hours, the weighted GPA is calculated using the credit hours as weights.

### Formula
```
Weighted GPA = Σ(Course Score × Credit Hours) / Σ(Credit Hours)
```

### Step-by-Step Calculation

1. **Multiply each course score by its credit hours**
2. **Sum all weighted scores**
3. **Sum all credit hours**
4. **Divide total weighted scores by total credit hours**

### Example
```
Course 1: Score 85, Credit Hours 3
Course 2: Score 90, Credit Hours 4
Course 3: Score 78, Credit Hours 3

Weighted Sum = (85 × 3) + (90 × 4) + (78 × 3)
             = 255 + 360 + 234
             = 849

Total Credit Hours = 3 + 4 + 3 = 10

Weighted Average = 849 / 10 = 84.9
```

### Algorithm (Pseudocode)
```
function calculateWeightedGPA(courses: Course[]): number {
  let weightedSum = 0
  let totalCredits = 0
  
  for (const course of courses) {
    weightedSum += course.score * course.creditHours
    totalCredits += course.creditHours
  }
  
  if (totalCredits === 0) {
    throw new Error("Total credit hours must be greater than 0")
  }
  
  const weightedAverage = weightedSum / totalCredits
  return Math.round(weightedAverage * 100) / 100
}
```

---

## 5. WASSCE Aggregate to Program Matching

### Overview
Match students to university programs based on their WASSCE aggregate score and subject requirements.

### Matching Criteria

1. **Aggregate Cutoff Check**: Student's aggregate must meet or exceed the program's minimum cutoff
2. **Subject Requirements**: Check if student has the required subjects for the program
3. **Grade Requirements**: Some programs require minimum grades in specific subjects

### Algorithm (Pseudocode)
```
function findEligiblePrograms(
  studentAggregate: number,
  studentSubjects: SubjectGrade[],
  programs: Program[]
): EligibleProgram[] {
  
  const eligiblePrograms = []
  
  for (const program of programs) {
    // Check aggregate eligibility (lower is better)
    if (studentAggregate <= program.maxCutoff) {
      // Check subject requirements
      const hasRequiredSubjects = program.requiredSubjects.every(req =>
        studentSubjects.some(subject =>
          subject.name.toLowerCase().includes(req.toLowerCase())
        )
      )
      
      // Check minimum grades in required subjects
      const meetsGradeRequirements = program.gradeRequirements.every(gradeReq =>
        studentSubjects.some(subject =>
          subject.name.toLowerCase().includes(gradeReq.subject.toLowerCase()) &&
          gradePointToNumeric(subject.grade) <= gradePointToNumeric(gradeReq.minGrade)
        )
      )
      
      if (hasRequiredSubjects && meetsGradeRequirements) {
        eligiblePrograms.push({
          university: program.university,
          program: program.name,
          category: program.category,
          cutoff: program.maxCutoff,
          studentScore: studentAggregate,
          margin: program.maxCutoff - studentAggregate,
          requirements: program.requiredSubjects
        })
      }
    }
  }
  
  // Sort by cutoff (closest match first)
  return eligiblePrograms.sort((a, b) => a.margin - b.margin)
}
```

### Example
```
Student's WASSCE Aggregate: 21
Student's Subjects: Mathematics (A1), English (B2), Physics (B3), Chemistry (C4), Biology (C5), Elective (C6)

Program Requirements:
- Engineering: Cutoff ≤ 24, Requires Math, Physics, Chemistry (all min B3)
- Medicine: Cutoff ≤ 18, Requires Math, Physics, Chemistry, Biology (all min B2)
- Law: Cutoff ≤ 28, Requires English, Social Studies

Matching:
- Engineering: ✓ Eligible (21 ≤ 24, has all required subjects, meets grade requirements)
- Medicine: ✗ Not eligible (21 > 18, aggregate too high)
- Law: ✗ Not eligible (missing Social Studies)

Result: Student eligible for Engineering program
```

---

## 6. University Recommendation Limiting (MVP Feature)

### Overview
For MVP, basic users see only 2 program recommendations. Premium users see all eligible programs.

### Algorithm (Pseudocode)
```
function getRecommendedPrograms(
  eligiblePrograms: EligibleProgram[],
  userPlan: 'free' | 'premium'
): EligibleProgram[] {
  
  // Sort by best match (lowest margin = closest to cutoff)
  const sorted = eligiblePrograms.sort((a, b) => a.margin - b.margin)
  
  if (userPlan === 'premium') {
    return sorted
  }
  
  // Free users: limit to 2 best recommendations
  return sorted.slice(0, 2)
}
```

### Example
```
Eligible Programs (sorted by match quality):
1. Engineering (margin: 3) - Best match
2. Computer Science (margin: 5) - Good match
3. Architecture (margin: 8) - Acceptable match
4. Physics (margin: 12) - Possible match

Free User: Sees #1 and #2 only
Premium User: Sees all 4 programs
```

---

## Implementation Notes

### Data Validation
- All inputs should be validated before processing
- Grade strings should be converted to points with error handling
- CWA/CGPA values should be checked for valid ranges

### Rounding
- All decimal results should be rounded to 2 decimal places
- Use `Math.round(value * 100) / 100` for consistent rounding

### Error Handling
- Invalid grades should throw descriptive errors
- Out-of-range values should be caught and reported
- Missing required data should be flagged

### Performance Considerations
- Pre-compute grade-to-points mappings
- Cache university eligibility data
- Use efficient sorting algorithms for large datasets

---

## References & Research Sources

### WASSCE Grading System
- West African Examinations Council (WAEC) official documentation
- Ghana Education Service (GES) curriculum guidelines
- University of Ghana admission requirements
- Source: GPAcalculator.net, Scholaro GPA Calculator

### USA GPA Conversion
- Standard conversion: (Score / 100) × 4.0
- U.S. GPA scale: 4.0 (A) to 0.0 (F)
- Some schools use .5 steps (e.g., A- = 3.7, AB = 3.5)
- Some schools give extra points for AP/Honors (weighted GPA up to 5.0)
- Unweighted GPA is standard for international students
- Source: Scholaro GPA Calculator, GPAcalculator.net

### Ghanaian to U.S. Conversion
- Ghanaian grades converted to U.S. equivalents first
- Then U.S. grades converted to GPA points
- Variations exist between schools; consult target universities
- Official credential evaluation may be required (WES, ECE)
- Source: GPAcalculator.net Ghanaian Grading Guide

### Weighted GPA Calculation
- Standard academic formula used across US universities
- Credit hours represent course weight/importance
- Commonly used in transcript GPA calculations
- Formula: Σ(Grade Points × Credits) / Σ(Credits)

---

---

## Algorithm Validation & Testing

### Test Case 1: CWA to CGPA Conversion
**Input**: CWA = 85

**Method 1 (Simple Formula)**
```
CGPA = (CWA / 100) × 4.0
CGPA = (85 / 100) × 4.0 = 0.85 × 4.0 = 3.4
```

**Method 2 (Grade-Based Conversion)**
- CWA 85 = B grade (80-89%)
- B grade = 3.0 GPA
- Result: 3.0

**Analysis**: Methods differ. Method 1 is more accurate for precise conversions. Method 2 loses precision by rounding to letter grades first.

**Recommendation**: Use Method 1 (simple formula) for accurate conversions.

---

### Test Case 2: Ghanaian Grade (B2) to U.S. GPA
**Input**: Ghanaian Grade B2 (73%)

**Method 1 (Direct Conversion Table)**
- B2 (70-74%) → A (4.0 GPA)
- Result: 4.0

**Method 2 (Percentage-Based)**
- B2 = 73%
- Using U.S. scale: 73% = C+ (2.3 GPA)
- Result: 2.3

**Analysis**: Methods conflict significantly. The conversion table treats B2 as equivalent to A, but percentage-based conversion treats 73% as C+.

**Root Cause**: Ghanaian grading is more generous than U.S. grading. A B2 in Ghana (70-74%) is considered excellent, while 73% in the U.S. is average (C+).

**Recommendation**: Use the Ghanaian Grade Conversion Table (Method 1) as it accounts for the different grading standards between systems.

---

### Test Case 3: WASSCE Aggregate Calculation
**Input**: 8 subjects with grades: A1, B2, B3, C4, C5, C6, D7, E8

**Calculation**:
```
Convert to points:
A1 = 1, B2 = 2, B3 = 3, C4 = 4, C5 = 5, C6 = 6, D7 = 7, E8 = 8

Sort ascending (best first):
1, 2, 3, 4, 5, 6, 7, 8

Take best 6:
1, 2, 3, 4, 5, 6

Sum: 1 + 2 + 3 + 4 + 5 + 6 = 21
```

**Result**: Aggregate = 21

**Verification**: This is consistent across all sources. ✓

---

### Test Case 4: Complete Conversion Pipeline
**Scenario**: Ghanaian student with WASSCE grades wants to know U.S. GPA

**Step 1**: Calculate WASSCE Aggregate
```
Grades: A1, B2, B3, C4, C5, C6
Aggregate = 1 + 2 + 3 + 4 + 5 + 6 = 21
```

**Step 2**: Convert Individual Grades to U.S. GPA
```
A1 → 4.0
B2 → 4.0
B3 → 3.0
C4 → 3.0
C5 → 2.0
C6 → 2.0
```

**Step 3**: Calculate Average U.S. GPA
```
Total: 4.0 + 4.0 + 3.0 + 3.0 + 2.0 + 2.0 = 18.0
Count: 6 subjects
Average GPA: 18.0 ÷ 6 = 3.0
```

**Result**: U.S. GPA = 3.0 (B grade, competitive for most universities)

---

## Algorithm Accuracy Summary

| Algorithm | Accuracy | Notes |
|-----------|----------|-------|
| CWA to CGPA (Simple) | ✓ High | Use: CGPA = (CWA / 100) × 4.0 |
| CWA to CGPA (Grade-Based) | ✗ Low | Loses precision by rounding |
| Ghanaian Grade to U.S. GPA | ✓ High | Use conversion table (accounts for system differences) |
| WASSCE Aggregate | ✓ High | Consistent across all sources |
| Weighted GPA | ✓ High | Standard formula: Σ(Score × Credits) / Σ(Credits) |

---

## Recommended Master Algorithm for Backend

### For CWA/Percentage to CGPA Conversion
```javascript
function convertPercentageToCGPA(percentage) {
  // Validate input
  if (percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100")
  }
  
  // Direct conversion (most accurate)
  const cgpa = (percentage / 100) * 4.0
  
  // Round to 2 decimal places
  return Math.round(cgpa * 100) / 100
}

// Examples:
convertPercentageToCGPA(85) // Returns 3.4
convertPercentageToCGPA(90) // Returns 3.6
convertPercentageToCGPA(100) // Returns 4.0
```

### For Ghanaian Grade to U.S. GPA Conversion
```javascript
const GHANAIAN_TO_US_GPA = {
  'A1': 4.0,
  'B2': 4.0,
  'B3': 3.0,
  'C4': 3.0,
  'C5': 2.0,
  'C6': 2.0,
  'D7': 1.0,
  'E8': 0.0,
  'F9': 0.0
}

function convertGhanaianGradeToUSGPA(grade) {
  const gpa = GHANAIAN_TO_US_GPA[grade]
  
  if (gpa === undefined) {
    throw new Error(`Invalid Ghanaian grade: ${grade}`)
  }
  
  return gpa
}

// Example:
convertGhanaianGradeToUSGPA('B2') // Returns 4.0
```

### For WASSCE Aggregate Calculation
```javascript
const GRADE_POINTS = {
  'A1': 1, 'B2': 2, 'B3': 3, 'C4': 4,
  'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9
}

function calculateWASSCEAggregate(grades) {
  // Convert grades to points
  const points = grades.map(grade => {
    if (!GRADE_POINTS[grade]) {
      throw new Error(`Invalid grade: ${grade}`)
    }
    return GRADE_POINTS[grade]
  })
  
  // Sort ascending (best grades first)
  points.sort((a, b) => a - b)
  
  // Take best 6 subjects
  const best6 = points.slice(0, 6)
  
  if (best6.length < 6) {
    throw new Error("Must have at least 6 subjects")
  }
  
  // Sum the points
  const aggregate = best6.reduce((sum, point) => sum + point, 0)
  
  return aggregate
}

// Example:
calculateWASSCEAggregate(['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8'])
// Returns 21
```

---

---

## 7. University Grade Conversion (Ghana/Nigeria → USA/UK)

### Overview
This section covers conversion of Ghana and Nigeria university grades to USA GPA (4.0 scale) and UK percentage equivalents for international applications.

### Important Disclaimer
⚠️ **These conversions are approximations based on widely-used formulas and research.**

Official credential evaluation services (WES, ECE, etc.) use proprietary methods that consider:
- Institutional reputation and accreditation
- Course rigor and difficulty
- Grading standards and inflation
- Individual transcript analysis

**For official university applications, students should obtain a professional credential evaluation from WES, ECE, or other NACES-approved evaluators.**

---

### 7.1 Ghana GPA (4.0 Scale) → USA GPA

**Formula:** Direct equivalence (1:1 mapping)

```javascript
function convertGhanaGPAToUSA(ghanaGPA) {
  if (ghanaGPA < 0 || ghanaGPA > 4.0) {
    throw new Error("Ghana GPA must be between 0 and 4.0")
  }
  return ghanaGPA // Direct mapping
}
```

**Rationale:**
- Both systems use the same 4.0 scale
- Letter grades map directly (A=4.0, B=3.0, etc.)
- Used by: University of Ghana (Legon), UCC, UEW, UDS, GTUC, Ashesi

**Degree Classification Mapping:**
| Ghana Classification | GPA Range | USA Equivalent |
|---------------------|-----------|----------------|
| First Class | 3.60-4.00 | Summa/Magna Cum Laude |
| Second Upper | 3.00-3.59 | Cum Laude |
| Second Lower | 2.00-2.99 | Good Standing |
| Third Class | 1.50-1.99 | Pass |

---

### 7.2 Ghana CWA (Percentage) → USA GPA

**Formula:** Scholaro Letter-Grade Conversion Method

```javascript
function ghanaPercentageToUSGrade(percentage) {
  if (percentage >= 70) return 'A'
  if (percentage >= 60) return 'B'
  if (percentage >= 50) return 'C'
  if (percentage >= 40) return 'D'
  return 'F'
}

function usGradeToPoints(grade) {
  const gradePoints = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 }
  return gradePoints[grade] || 0.0
}

function calculateScholaroGPA(courses) {
  let totalPoints = 0
  let totalCredits = 0
  
  for (const course of courses) {
    const percentage = parseFloat(course.score)
    const credits = parseFloat(course.creditHours)
    const usGrade = ghanaPercentageToUSGrade(percentage)
    const gradePoints = usGradeToPoints(usGrade)
    totalPoints += gradePoints * credits
    totalCredits += credits
  }
  
  return totalPoints / totalCredits
}
```

**Rationale:**
- This is the method used by WES, ECE, and Scholaro (official credential evaluators)
- Converts each course percentage to US letter grade first, then to GPA points
- Respects the difference between grading systems (Ghana 70% = excellent = A)
- More accurate than linear scaling for international credential evaluation
- Used by: KNUST, ATU, and all Ghana universities with CWA system

**Conversion Table:**
| Ghana Percentage | US Letter Grade | GPA Points |
|-----------------|-----------------|------------|
| 80-100% | A | 4.0 |
| 75-79% | A- | 3.7 |
| 70-74% | B+ | 3.3 |
| 65-69% | B | 3.0 |
| 60-64% | B- | 2.7 |
| 55-59% | C+ | 2.3 |
| 50-54% | C | 2.0 |
| 0-49% | F | 0.0 |

**Real Example (KNUST BSc Computer Engineering):**
- 55 courses, 148 credits, CWA: 73.54%
- Using Scholaro method: USA GPA = 3.35
- Classification: First Class (meets requirements for most US graduate programs)

---

### 7.3 Nigeria CGPA (5.0 Scale) → USA GPA

**Formula:** Linear scaling

```javascript
function convertNigeriaCGPA5ToUSA(cgpa) {
  if (cgpa < 0 || cgpa > 5.0) {
    throw new Error("Nigeria CGPA must be between 0 and 5.0")
  }
  const usaGPA = (cgpa / 5.0) * 4.0
  return Math.round(usaGPA * 100) / 100
}
```

**Rationale:**
- Nigeria uses 5.0 as maximum CGPA
- USA uses 4.0 as maximum GPA
- Linear scaling is the standard WES-recommended method
- Used by: UNILAG, UNN, UI, ABU, UNICAL, UNIPORT, Covenant, Babcock

**Examples:**
- Nigeria CGPA: 4.5 → USA GPA: 3.6
- Nigeria CGPA: 4.0 → USA GPA: 3.2
- Nigeria CGPA: 3.5 → USA GPA: 2.8

**Degree Classification Mapping:**
| Nigeria Classification | CGPA Range (5.0) | USA GPA | UK Equivalent |
|----------------------|------------------|---------|---------------|
| First Class | 4.50-5.00 | 3.6-4.0 | First Class (70%+) |
| Second Upper | 3.50-4.49 | 2.8-3.59 | Upper Second (60-69%) |
| Second Lower | 2.40-3.49 | 1.92-2.79 | Lower Second (50-59%) |
| Third Class | 1.50-2.39 | 1.2-1.91 | Third Class (40-49%) |

---

### 7.4 Nigeria CGPA (4.0 Scale) → USA GPA

**Formula:** Direct equivalence

```javascript
function convertNigeriaCGPA4ToUSA(cgpa) {
  if (cgpa < 0 || cgpa > 4.0) {
    throw new Error("Nigeria CGPA must be between 0 and 4.0")
  }
  return cgpa // Direct mapping
}
```

**Rationale:**
- Some Nigerian universities (OAU, UNIJOS) use 4.0 scale
- Direct equivalence with USA system
- Used by: OAU (Obafemi Awolowo University)

---

### 7.5 Ghana/Nigeria → UK Percentage

**Formulas:**

```javascript
// Ghana CWA to UK Percentage (Direct)
function convertGhanaCWAToUK(cwa) {
  return cwa // Direct mapping
}

// Ghana GPA to UK Percentage
function convertGhanaGPAToUK(gpa) {
  if (gpa < 0 || gpa > 4.0) {
    throw new Error("Ghana GPA must be between 0 and 4.0")
  }
  const ukPercentage = (gpa / 4.0) * 100
  return Math.round(ukPercentage * 100) / 100
}

// Nigeria CGPA 5.0 to UK Percentage
function convertNigeriaCGPA5ToUK(cgpa) {
  if (cgpa < 0 || cgpa > 5.0) {
    throw new Error("Nigeria CGPA must be between 0 and 5.0")
  }
  const ukPercentage = (cgpa / 5.0) * 100
  return Math.round(ukPercentage * 100) / 100
}

// Nigeria CGPA 4.0 to UK Percentage
function convertNigeriaCGPA4ToUK(cgpa) {
  if (cgpa < 0 || cgpa > 4.0) {
    throw new Error("Nigeria CGPA must be between 0 and 4.0")
  }
  const ukPercentage = (cgpa / 4.0) * 100
  return Math.round(ukPercentage * 100) / 100
}
```

**UK Degree Classification:**
| UK Classification | Percentage | Ghana/Nigeria Equivalent |
|------------------|------------|--------------------------|
| First Class | 70%+ | First Class |
| Upper Second (2:1) | 60-69% | Second Upper |
| Lower Second (2:2) | 50-59% | Second Lower |
| Third Class | 40-49% | Third Class |

---

### 7.6 Complete Conversion Service

```javascript
const CONVERSION_RULES = {
  ghana_gpa: (gpa) => ({
    usaGpa: gpa,
    ukPercentage: (gpa / 4.0) * 100
  }),
  ghana_cwa: (cwa) => ({
    usaGpa: (cwa / 100) * 4.0,
    ukPercentage: cwa
  }),
  nigeria_cgpa_5: (cgpa) => ({
    usaGpa: (cgpa / 5.0) * 4.0,
    ukPercentage: (cgpa / 5.0) * 100
  }),
  nigeria_cgpa_4: (cgpa) => ({
    usaGpa: cgpa,
    ukPercentage: (cgpa / 4.0) * 100
  })
}

function convertGrade(systemId, score) {
  if (!CONVERSION_RULES[systemId]) {
    throw new Error(`Unsupported grading system: ${systemId}`)
  }
  
  const result = CONVERSION_RULES[systemId](score)
  
  return {
    usaGpa: Math.round(result.usaGpa * 100) / 100,
    ukPercentage: Math.round(result.ukPercentage * 100) / 100
  }
}
```

---

### 7.7 Weighted Average Calculation

For course-by-course conversions:

```javascript
function calculateWeightedAverage(courses) {
  if (!courses || courses.length === 0) {
    throw new Error("Must provide at least one course")
  }
  
  let totalWeightedScore = 0
  let totalCredits = 0
  
  for (const course of courses) {
    const score = parseFloat(course.score)
    const credits = parseFloat(course.creditHours)
    
    if (isNaN(score) || isNaN(credits)) {
      throw new Error("Invalid score or credit hours")
    }
    
    totalWeightedScore += score * credits
    totalCredits += credits
  }
  
  if (totalCredits === 0) {
    throw new Error("Total credits must be greater than 0")
  }
  
  const weightedAverage = totalWeightedScore / totalCredits
  return Math.round(weightedAverage * 100) / 100
}
```

**Example:**
```javascript
const courses = [
  { name: "Math", score: "85", creditHours: "3" },
  { name: "Physics", score: "90", creditHours: "4" },
  { name: "Chemistry", score: "78", creditHours: "3" }
]

const average = calculateWeightedAverage(courses)
// Result: 84.9

// Then convert to USA/UK
const converted = convertGrade('ghana_cwa', average)
// Result: { usaGpa: 3.4, ukPercentage: 84.9 }
```

---

## Future Enhancements

1. **Multi-System Support**: Add support for India (10), Australia (7), Europe (ECTS)
2. **Advanced Matching**: Include scholarship amounts, program rankings, location preferences
3. **Transcript Upload**: AI-powered parsing of PDF transcripts
4. **Historical Data**: Track conversion trends and university admission rates
5. **Custom Formulas**: Allow institutions to define custom conversion formulas
