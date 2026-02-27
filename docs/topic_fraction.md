# Topic Design: Pecahan (Fractions)

This document specifies the generator cases and visual requirements for the Fractions topic.

## 1. Sub-topics & Levels

### Level: Dasar (Basic) - Mengenal Pecahan
Focus on visual representation and basic identification.
| Case   | Description                        | Example      |
| :----- | :--------------------------------- | :----------- |
| Case 1 | Identify shaded part (Prop-visual) | Pie with 1/4 |
| Case 2 | Shade the requested part           | Rect 3/5     |
| Case 3 | Basic numerator/denominator naming | 2/3          |

### Level: Menengah (Intermediate) - Pecahan Senilai
Focus on equivalent fractions.
| Case   | Description                                  | Example       |
| :----- | :------------------------------------------- | :------------ |
| Case 4 | Fill the blank for equality                  | 1/2 = _/4     |
| Case 5 | Find 2 equivalent fractions                  | 2/3 = ?, ?    |
| Case 6 | Identify non-equivalent fraction from a list | 1/2, 2/4, 3/5 |

### Level: Mahir (Advanced) - Menyederhanakan Pecahan
Focus on simplest form.
| Case   | Description                       | Example         |
| :----- | :-------------------------------- | :-------------- |
| Case 7 | Simplify to simplest form         | 12/18 -> 2/3    |
| Case 8 | Multiple choice simplification    | 24/60 = ?       |
| Case 9 | Word problem: Fraction in context | 10 of 25 apples |

## 2. Visual Requirements

### Pie Charts
- SVG-based circles.
- Divided into $n$ equal sectors.
- $m$ sectors shaded with a light grey (printer-friendly).
- Radius: ~50-80px.

### Bar Models
- SVG-based rectangles.
- Divided into $n$ equal sub-rectangles.
- $m$ sub-rectangles shaded.

## 3. Implementation Notes
- All fractions should be proper $(n < d)$ for basic levels.
- Denominators for visual levels should be "friendly" (2, 3, 4, 5, 6, 8, 10).
- For simplification, ensure numbers have a clear Greatest Common Divisor (GCD) > 1.
