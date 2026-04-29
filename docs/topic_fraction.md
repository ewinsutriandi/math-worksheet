# Detailed Topic Specification: Pecahan (Fractions)

This document outlines the detailed question progression and logic cases for the Fractions topic, organized into three proficiency levels: **Basic (Dasar)**, **Intermediate (Menengah)**, and **Advanced (Mahir)**.

---

## 1. Visualisasi (Visualization)

### Level Overview
Focus on representing fractions through geometric shapes (Pie Charts and Bar Models).

| Level        | Description                                                        | Example            |
| :----------- | :----------------------------------------------------------------- | :----------------- |
| **Dasar**    | Proper fractions with common denominators (2, 3, 4, 6, 8, 10, 12). | Identifikasi 1/2   |
| **Kompleks** | Mixed/Improper visual representations.                             | Identifikasi 1 1/4 |

### Sorting Logic
1. **Denominator Size**: Smaller denominators come first (easier to visualize).
2. **Numerator Proximity**: Unit fractions (numerator = 1) come before non-unit fractions.
3. **Complexity**: Pie charts come before Bar models (or vice-versa depending on user preference, but generally Pie is more "standard").

---

## 2. Pecahan Senilai (Equivalent Fractions)

### Level Overview
Focus on understanding equality through multiplication and division.

| Level     | Description                                         | Example   |
| :-------- | :-------------------------------------------------- | :-------- |
| **Dasar** | Simple multiplication or division scaling (x2, x3). | 1/2 = ?/4 |
| **Mahir** | Indirect scaling (Simplify -> Scale). GCD > 1.      | 3/6 = ?/8 |

### Sorting Logic
1. **Operation Type**: Multiplication cases come before Division cases.
2. **Magnitude of Multiplier**: Smaller multipliers/divisors (e.g., x2) come before larger ones (e.g., x5).
3. **Denominator Size**: Smaller denominators come first.

---

## 3. Menyederhanakan Pecahan (Simplifying Fractions)

### Level Overview
Focus on reducing fractions to their simplest form using GCD.

| Level     | Description                                        | Example      |
| :-------- | :------------------------------------------------- | :----------- |
| **Dasar** | Single-step reduction. Small common factors (2-5). | 8/12 -> 2/3  |
| **Mahir** | Multi-step or Large GCD (12, 15, 20, 25).          | 48/72 -> 2/3 |

### Sorting Logic
1. **Denominator Size**: Smaller starting denominators come first.
2. **Step Count**: Fractions that require one-step reduction come before those requiring multiple steps.
3. **GCD Complexity**: Smaller GCDs come before larger ones.

## 4. Membandingkan Pecahan (Comparing)

Students insert comparison symbols ($>, <, =$) between two fractions.

| Level         | Description                                    | Example                      |
| :------------ | :--------------------------------------------- | :--------------------------- |
| **Sederhana** | Same denominator OR same numerator (up to 25). | 12/25 vs 13/25, 7/15 vs 7/20 |
| **Kompleks**  | Random (no common num/denom, up to 25).        | 11/13 vs 14/17               |

### Sorting Logic
1. **Denominator Sum**: Questions are sorted by the sum of their denominators ($Denominator_1 + Denominator_2$) in ascending order.

---

## 5. Penjumlahan & Pengurangan Pecahan (Add/Sub)

Students perform addition or subtraction of fractions.

| Level         | Description                                                   | Example                     |
| :------------ | :------------------------------------------------------------ | :-------------------------- |
| **Visual**    | Graphical representation. Students shade the result box.      | Shaded Pie + Shaded Pie = ? |
| **Sederhana** | Same denominator or one denominator is a multiple of another. | 1/5 + 2/5; 1/2 - 1/4        |
| **Kompleks**  | Random denominators or shared factors (GCD > 1).              | 1/6 + 1/8; 2/3 - 1/5        |

### Implementation Notes:
- **Visual**: Use the SVG generator for two shapes and an empty third shape for the answer.
- **Sederhana**: Ensure the multiple case is clear (e.g., 3 and 6, 4 and 12).
- **Kompleks**: Toggle between "Co-prime" denoms and "Shared Factor" denoms.
- **Results**: Ensure addition results stay within 1 (proper fractions) unless specified later. Subtraction must result in a positive value.

## 6. Perkalian & Pembagian Pecahan (Mul/Div)
Students perform multiplication or division of fractions.

| Level         | Description                                             | Example              |
| :------------ | :------------------------------------------------------ | :------------------- |
| **Perkalian** | Multiplying two proper fractions.                       | 1/2 x 3/4; 2/5 x 5/6 |
| **Pembagian** | Dividing two proper fractions (multiply by reciprocal). | 1/2 ÷ 1/4; 3/5 ÷ 2/3 |

### Implementation Notes:
- **Simplification Requirement**: For each set of 20 questions, at least 10 must result in a fraction that is NOT in simplest form (GCD > 1).
- **Number Range**: Numerators and denominators range from 1 to 12 to keep products manageable (max denom 144).
- **Logic**: 
    - For Multiplication: $n_1/d_1 \times n_2/d_2 = (n_1 \times n_2) / (d_1 \times d_2)$.
    - For Division: $n_1/d_1 \div n_2/d_2 = (n_1 \times d_2) / (d_1 \times n_2)$.
- **Simplified cases**: To force a "must simplify" result, ensure either $(n_1, d_2)$ or $(n_2, d_1)$ share a common factor (cross-simplification) OR $(n_1, d_1)$ or $(n_2, d_2)$ are not in simplest form.

## 7. Pecahan Campuran (Mixed Numbers)
Operations involving mixed numbers.

| Level             | Description                                   | Example                                                                            |
| :---------------- | :-------------------------------------------- | :--------------------------------------------------------------------------------- |
| **Konversi**      | Convert between Mixed and Improper fractions. | $3 \frac{1}{2} \rightarrow \frac{7}{2}$ or $\frac{5}{3} \rightarrow 1 \frac{2}{3}$ |
| **Tambah/Kurang** | Addition and subtraction of mixed numbers.    | $1 \frac{1}{2} + 2 \frac{1}{4}$                                                    |
| **Kali/Bagi**     | Multiplication and division of mixed numbers. | $2 \frac{1}{3} \times 1 \frac{1}{5}$                                               |

### Implementation Notes:
- **Konversi**: Toggle 50/50 between Mixed $\rightarrow$ Improper and Improper $\rightarrow$ Mixed.
- **Tambah/Kurang**: Alternate between addition and subtraction. 50% chance for one operand to be a proper fraction. Use denominators up to 10.
- **Kali/Bagi**: Convert to improper for calculation. 50% chance for one operand to be a proper fraction. Keep numbers reasonable (denominators $\le 8$, whole parts $\le 4$).
- **Simplification**: Answers should be in simplest mixed number form.

---

## 8. Implementation Notes
- **Visuals**: Use SVG for Pie and Bar charts with light grey shading (`#E0E0E0`).
- **Logic**: Ensure all generated fractions have a valid solution (e.g., for Simplification, GCD must be > 1).
- **Duplicate Prevention**: Use `f:num/den:topic` as unique identifier.
