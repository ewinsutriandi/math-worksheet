# Detailed Topic Specification: Arithmetic (Aritmatika)

This document outlines the detailed question progression and logic cases for the Arithmetic topic, organized into three proficiency levels: **Basic (Dasar)**, **Intermediate (Menengah)**, and **Advanced (Mahir)**.

To ensure a smooth learning progression, all operations follow a **Natural Progression** sorting strategy where easier problems (fewer digits, no regrouping) appear before more complex ones.

---

## 1. Penjumlahan (Addition)

### Level Overview
Focus on multi-digit operations and "Simpan" (regrouping).

| Level        | Description                                            | Example         |
| :----------- | :----------------------------------------------------- | :-------------- |
| **Dasar**    | 1-digit foundations and horizontal 2-digit extensions. | 5+3, 24+3       |
| **Menengah** | 2-digit focus with regrouping.                         | 28+5, 47+38     |
| **Mahir**    | 3-digit operations and double regrouping.              | 145+67, 885+248 |

### Sorting Logic
1. **Total Digits**: 1-digit foundations always come first.
2. **Regrouping (Simpan)**: Within the same digit count, problems without regrouping (e.g., 12+5) come before those with regrouping (e.g., 18+5).
3. **Sum of Operands**: Smaller results come before larger ones within the same category.

---

## 2. Pengurangan (Subtraction)

### Level Overview
Focus on multi-digit operations and "Pinjam" (borrowing). Dasar level uses horizontal format only.

| Level        | Description                                          | Example         |
| :----------- | :--------------------------------------------------- | :-------------- |
| **Dasar**    | 1-digit and simple 2-digit (Horizontal, result 1-9). | 9-4, 15-6       |
| **Menengah** | 2-digit focus with borrowing.                        | 32-8, 54-27     |
| **Mahir**    | 3-digit focus and complex borrowing (across zero).   | 125-48, 500-125 |

### Sorting Logic
1. **Total Digits**: Problems with fewer total digits appear first.
2. **Borrowing (Pinjam)**: Problems without borrowing (e.g., 25-3) come before those requiring borrowing (e.g., 21-5).
3. **Sum of Operands**: Used as a tie-breaker.

---

## 3. Perkalian (Multiplication)

### Level Overview
Focus on multiplication tables and multi-digit factors. Dasar level uses horizontal format.

| Level        | Description                                     | Example       |
| :----------- | :---------------------------------------------- | :------------ |
| **Dasar**    | Tables 1-9 and multiples of 10.                 | 3x4, 6x20     |
| **Menengah** | 2-digit x 1-digit and simple 2-digit x 2-digit. | 26x3, 12x13   |
| **Mahir**    | Complex multi-digit multiplication.             | 45x23, 125x42 |

### Sorting Logic
1. **Sum of Operands**: Progression based on the size of the factors.
2. **Difficulty Case**: Lower complexity cases appear first.

---

## 4. Pembagian (Division)

### Level Overview
Focus on "Bagi Kurung" (long division). Dasar level uses horizontal format.

| Level        | Description                                    | Example       |
| :----------- | :--------------------------------------------- | :------------ |
| **Dasar**    | Horizontal division with single-digit results. | 8/2, 60/3     |
| **Menengah** | Simple bagi kurung and 2-digit quotients.      | 84/4, 36/12   |
| **Mahir**    | Complex bagi kurung with multi-digit divisors. | 126/6, 425/25 |

### Sorting Logic
1. **Sum of Operands**: Smaller dividends and divisors appear first.
2. **Difficulty Case**: Lower complexity cases appear first.

---

## 5. Duplicate Prevention
Regardless of the operation, the generator tracks each question using a unique identifier (`op:operands`) to ensure no identical problems appear on the same worksheet.
