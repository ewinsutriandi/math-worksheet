# Product Requirements Document (PRD)
## Printable Elementary Math Worksheet Generator

---

## 1. Overview

*Product name:* Printable Math Worksheet Generator  
*Platform:* Static HTML / CSS / JavaScript  
*Audience:* Parents, elementary school teachers, tutors in Indonesia
*Language:* **Bahasa Indonesia (Primary)** - All UI, instructions, and mathematical terms must be in Indonesian.

*Purpose*  
Provide a fast, simple website that allows users to generate and print elementary-level math worksheets by topic and difficulty, with no login required.

---

## 2. Goals & Success Criteria

### Goals
- Generate printable worksheets in under 30 seconds
- Produce clean, printer-friendly layouts
- Work fully client-side after initial page load

### Success Criteria
- Worksheet renders correctly in print preview
- Questions and answer key are accurate
- Users can easily regenerate different worksheets

---

## 3. Scope

### In Scope (MVP)
- Static website (HTML/CSS/JS only)
- Client-side worksheet generation
- Printable worksheet layout
- Answer key generation
- Standard paper sizes (A4, Letter)

### Out of Scope
- User accounts or login
- Saving worksheets online
- Progress tracking
- Mobile app

---

## 4. Math Topics & Levels

Each topic defines difficulty levels and question ranges.

| Kategori        | Topik           | Sub-topik / Level                                                                                                                               | Spesifikasi Kesulitan                                        |
| :-------------- | :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------- |
| **Aritmatika**  | **Semua Topik** | 1. Dasar (1-digit foundation)<br>2. Menengah (2-digit focus)<br>3. Mahir (3-digit / complex)<br>See: [topic_arithmetic.md](topic_arithmetic.md) | Mencakup penjumlahan, pengurangan, perkalian, dan pembagian. |
| **Pecahan**     | **Dasar**       | 1. Mengenal Pecahan (Visual)<br>2. Pecahan Senilai<br>3. Menyederhanakan Pecahan                                                                | Pemahaman konsep dasar.                                      |
|                 | **Menengah**    | 4. Membandingkan Pecahan<br>5. Penjumlahan & Pengurangan<br>6. Pecahan Campuran                                                                 | Format campuran dan operasi dasar.                           |
|                 | **Mahir**       | 7. Perkalian & Pembagian<br>8. Desimal<br>9. Persen                                                                                             | Operasi kompleks dan konversi.                               |
| **Soal Cerita** | **Aplikasi**    | L1: Operasi Campuran (+/-)<br>L2: Soal Cerita Multi-langkah                                                                                     | Menggunakan konteks Indonesia.                               |
| **Campuran**    | **Review**      | Pengguna memilih campuran topik dan sub-topik                                                                                                   | Mengacak tipe soal yang dipilih.                             |

---

## 5. Worksheet Configuration Options

### User Inputs
- Math topic
- Grade level
- Difficulty level
- Number of questions
- Include answer key (yes/no)
- Page size (A4 / Letter)

### Defaults
- 20 questions
- Grade-appropriate difficulty
- Answer key on separate page

---

## 6. User Flow

1. User visits homepage
2. Selects math topic
3. Chooses worksheet options
4. Clicks *Generate Worksheet*
5. Worksheet preview appears
6. User prints or saves as PDF

---

## 7. Functional Requirements

- Randomly generate math problems based on selected topic
- Prevent duplicate questions where applicable
- Render questions in printable layout
- Generate accurate answer key
- Support browser print dialog

---

## 8. Non-Functional Requirements

### Performance
- Worksheet generation under 1 second

### Compatibility
- Chrome, Firefox, Safari, Edge (latest versions)

### Print Quality
- Black and white friendly
- Large, readable fonts
- Adequate spacing for handwriting

---

## 9. Technical Architecture

### Component-Based Design
To ensure scalability and maintainability, the application will follow a component-based structure:
- **Core Engine**: Handles state, configuration, and printing.
- **Topic Generators**: Independent modules for each math topic (Addition, Fractions, etc.).
- **UI Components**: Shared elements like buttons, inputs, and worksheet templates.

### Single Page Application (SPA)
The app will be a unified SPA where users select topics and configure them without leaving the page. This eliminates the current fragmented approach of separate HTML files.

## 11. Visual Design & Aesthetics

The application must feel premium, modern, and trustworthy.

### Design Principles
- **Minimalist Indonesian Aesthetic**: Clean lines, ample white space, and a professional color palette (e.g., Deep Indigo `#1A237E` for typography and Slate Grey `#455A64` for UI).
- **Responsive Layout**: Fluid dashboard that adapts to tablets and desktops.
- **Interactive Micro-animations**: Subtle transitions when selecting topics or changing configurations to provide visual feedback.
- **Zero Distractions**: No ads, no unnecessary popups, focusing entirely on the worksheet creation.

## 12. Privacy & Security

As a client-side only application:
- **No Data Collection**: No cookies, no tracking, and no user data stored on any server.
- **Local Generation**: All math problems are generated locally in the browser; no information about the generated worksheets is transmitted externally.
- **Safe for Schools**: Designed to be used in educational environments without violating student privacy regulations.

## 13. Content & Layout

### Pages
- **Dashboard**: Central hub for selecting math topics.
- **Generator View**: Interactive configuration sidebar + real-time preview.
- **Print View**: Clean, CSS-optimized layout for printing.

### Print Layout
- Header: Topic name, grade, name/date fields.
- Numbered questions in a grid (2 or 3 columns).
- Footer: Page number and "Generated by MathWorksheet".
- **Answer Key**: Generated automatically on a separate page.

---

## 14. Accessibility & Usability

- **Localized Terminology**: Use correct Indonesian math terms (e.g., *Pecahan*, *Pembilang*, *Penyebut*, *Sisa*).
- **Simple Language**: Clear, non-technical Bahasa Indonesia suitable for children and parents.
- Keyboard-accessible controls.
- Clear labels and instructions.
- High contrast text for printing.

---

## 15. Risks & Constraints

- **Randomization**: Needs "sanity checks" to prevent overly difficult or repetitive problems.
- **Browser Print**: Variations in margins; requires standard CSS `@media print` rules.
- **Client-Side Only**: No database means no saving; users must print/save-as-PDF immediately.

---

## 16. Open Questions (Resolved)

- **PDF Download?** No dedicated button needed; browser "Print to PDF" is sufficient.
- **Branding?** Subtle footer branding on worksheets.
- **Answer Keys?** Always generated on the last page, configurable to hide/show during print.

---

## 17. Future Enhancements

- Additional math topics
- Custom question input
- Themed worksheets
- Multi-language support

---

## 18. Technical Specifications (Generator Logic)

### Arithmetic Generation
- **Addition/Subtraction**:
    - *No Regrouping*: Sum of each digit position must be <= 9.
    - *With Regrouping*: At least one digit position must result in a carry/borrow.
- **Multiplication**:
    - *Static Table*: All multipliers are consistent (e.g., all ×7).
    - *Random Mixed*: Both factors are randomized within the selected level range.
- **Avoidance of Negatives**: Subtraction results must always be >= 0.

### Fraction & Decimal Logic
- **Defining / Visual**: Render fractions as circular pies or rectangular bars.
- **Equivalent / Simplest Form**: Generate fractions where `gcd(numerator, denominator) > 1` for reduction practice.
- **Mixed Numbers**: Conversion between improper fractions (e.g., 7/4) and mixed numbers (1 3/4).
- **Percentages**: Basic conversion (e.g., 0.25 to 25%) and "Percentage of a Number" (e.g., 20% of 150).
- **Decimals**: Addition/Subtraction with aligned decimal points; multiplication/division with simple factors.

### Layout Engine
- **CSS Grid/Flexbox**: Used for question alignment to ensure consistent column width.
- **Font Stack**: Primary font should be a legible sans-serif (e.g., *Inter* or *Roboto*) with a specific mono-spaced font option for vertical arithmetic alignment.
- **Print Optimization**:
    - `@media print` rules to hide UI sidebar and buttons.
    - Standard margins: 2cm top/bottom, 1.5cm left/right.
    - Page break control: `break-after: page` for answer keys to ensure they always start fresh.
    - Resolution: Ensure visual components (fractions, clocks) are rendered as SVG or high-DPI Canvas for crisp printing.

---

## 19. Appendix

- Wireframes (link)
- Question generation logic (link)
- Print CSS reference (link)