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

---

## 4. Implementation Notes
- **Visuals**: Use SVG for Pie and Bar charts with light grey shading (`#E0E0E0`).
- **Logic**: Ensure all generated fractions have a valid solution (e.g., for Simplification, GCD must be > 1).
- **Duplicate Prevention**: Use `f:num/den:topic` as unique identifier.
