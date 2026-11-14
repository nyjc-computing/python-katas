# Python katas

A practice corpus of 72 katas, sorted by the **Python features they use or
require**, ordered roughly from basic to advanced and grouped into five
parts. Each kata carries a **Features:** line listing exactly what it
practises, and sits under its primary feature.

Before editing this file, read [MARKDOWN-FORMAT.md](MARKDOWN-FORMAT.md) —
CI rejects markdown that drifts out of its contract. Code expressions in
questions and hints are wrapped in backticks and follow PEP 8; sample
input/output is fenced; solutions are PEP 8-gated and must not change
observable behavior (the auto-check tests are derived from them).

## Contents

- **Part A — Core language**
  1. Functions & type conversion — katas 1–7
  2. Operators, arithmetic & conditionals — katas 8–10
  3. Loops & iteration — katas 11–17
  4. Strings & character methods — katas 18–20
- **Part B — Built-in data structures**
  5. Lists & slicing — katas 21–27
  6. Tuples — katas 28–31
  7. Dictionaries — katas 32–37
- **Part C — Functional & idiomatic Python**
  8. List comprehensions — katas 38–44
  9. Recursion — katas 45–48
- **Part D — OOP, errors & introspection**
  10. Classes & objects — katas 49–52
  11. Inheritance, polymorphism & static methods — katas 53–56
  12. Exceptions & assertions — katas 57–60
- **Part E — Standard library**
  13. `math` — katas 61–62
  14. `random` — katas 63–71
  15. `timeit` — kata 72

---

# Part A — Core language

## 1. Functions & type conversion

Defining functions with `def`/`return`, parameters and calls; explicit type
conversion with `int()`, `str()`, `len()`; base-`int()` parsing.
### 1. Square of a number

**Features:** `def`, `return`, `**` operator

**Question:**
Define a function that returns the square of a number. Test it by printing the squares of 2 and 3.

**Hints:**
Use the `**` operator.
**Solution:**

```python
def square(num):
    return num ** 2


print(square(2))
print(square(3))
```

### 2. Sum of two numbers

**Features:** `def`, parameters, `return`

**Question:**
Define a function that returns the sum of two numbers. Test it by printing the sum of 1 and 2.

**Hints:**
Define a function that takes two numbers as arguments and returns their sum.
**Solution:**

```python
def sum_function(number1, number2):
    return number1 + number2


print(sum_function(1, 2))
```

### 3. Convert an integer to a string

**Features:** `str()` conversion

**Question:**
Define a function that converts an integer to a string and prints it to the console. Test it with the integer 3.

**Hints:**
Use `str()` to convert a number to a string.
**Solution:**

```python
def print_value(n):
    print(str(n))


print_value(3)
```

### 4. Sum of two numbers given as strings

**Features:** `int()` conversion, parameters

**Question:**
Define a function that takes two integers in string form, computes their sum, and prints it to the console. Test it with the strings `"3"` and `"4"`.

**Hints:**
Use `int()` to convert a string to an integer.
**Solution:**

```python
def print_value(s1, s2):
    print(int(s1) + int(s2))


print_value("3", "4")
```

### 5. Concatenate two strings

**Features:** string concatenation with `+`

**Question:**
Define a function that takes two strings, concatenates them, and prints the result to the console. Test it with the strings `"3"` and `"4"`.

**Hints:**
Use `+` to concatenate strings.
**Solution:**

```python
def print_value(s1, s2):
    print(s1 + s2)


print_value("3", "4")
```

### 6. Print the longer of two strings

**Features:** `len()`, `if`/`elif`/`else`

**Question:**
Define a function that takes two strings and prints the longer one to the console. If both strings have the same length, the function should print each string on its own line. Test it with the strings `"one"` and `"three"`.

**Hints:**
Use `len()` to get the length of a string.
**Solution:**

```python
def print_value(s1, s2):
    len1 = len(s1)
    len2 = len(s2)
    if len1 > len2:
        print(s1)
    elif len2 > len1:
        print(s2)
    else:
        print(s1)
        print(s2)


print_value("one", "three")
```

### 7. Four-digit binary numbers divisible by 5

**Features:** `int(x, 2)` base conversion, `for` loops, `not`, `list.append()`, `str.join()`

**Question:**
Write a program that accepts a sequence of comma-separated 4-digit binary numbers as input and checks whether each one is divisible by 5. The numbers that are divisible by 5 should be printed as a comma-separated sequence.

For example, given the input:

```
0100,0011,1010,1001
```

the program should print:

```
1010
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
value = []
items = [x for x in input().split(',')]
for p in items:
    intp = int(p, 2)
    if not intp % 5:
        value.append(p)

print(','.join(value))
```

## 2. Operators, arithmetic & conditionals

The `%` and `**` operators, equality tests, boolean `and`/`or`, and
`if`/`elif`/`else` branching.
### 8. Even or odd

**Features:** `%` operator, `if`/`else`

**Question:**
Define a function that takes an integer and prints "It is an even number" if the number is even, or "It is an odd number" otherwise. Test it with the number 7.

**Hints:**
Use the `%` operator to check whether a number is even or odd.
**Solution:**

```python
def check_value(n):
    if n % 2 == 0:
        print("It is an even number")
    else:
        print("It is an odd number")


check_value(7)
```

### 9. Accept only "yes", "YES" or "Yes"

**Features:** string equality, boolean `or`, `if`/`else`

**Question:**
Write a program that accepts a string as input and prints "Yes" if the string is "yes", "YES" or "Yes"; otherwise, it prints "No".

**Hints:**
Use an `if` statement to test the condition.
**Solution:**

```python
s = input()
if s == "yes" or s == "YES" or s == "Yes":
    print("Yes")
else:
    print("No")
```

### 10. Numbers whose digits are all even

**Features:** `str()` conversion, `all()`, `%` operator, `list.append()`, `str.join()`

**Question:**
Write a program that finds every number between 1000 and 3000 (both included) in which each digit is even. The numbers should be printed as a comma-separated sequence on a single line.

**Hints:**
Convert each number to a string to examine its digits.
**Solution:**

```python
values = []
for i in range(1000, 3001):
    digits = str(i)
    if all(int(digit) % 2 == 0 for digit in digits):
        values.append(digits)
print(",".join(values))
```

## 3. Loops & iteration

`for` loops with `range()`, `while` loops with sentinel conditions, nested loops, and accumulator patterns.
### 11. Divisible by 7 but not a multiple of 5

**Features:** `range()`, `for` loop, `%` with `and`, `list.append()`, `str.join()`

**Question:**
Write a program that finds every number between 2000 and 3200 (both included) that is divisible by 7 but is not a multiple of 5. The numbers should be printed as a comma-separated sequence on a single line.

**Hints:**
Use `range(begin, end)` to generate the numbers to check.
**Solution:**

```python
items = []
for i in range(2000, 3201):
    if i % 7 == 0 and i % 5 != 0:
        items.append(str(i))

print(','.join(items))
```

### 12. Capitalise input lines until a blank line

**Features:** `while` loop with a sentinel condition, `str.upper()`, `list.append()`

**Question:**
Write a program that accepts a sequence of lines as input and prints each line with all of its characters capitalised. Input ends at the first blank line.

For example, given the input:

```
Hello world
Practice makes perfect
```

the program should print:

```
HELLO WORLD
PRACTICE MAKES PERFECT
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
lines = []
line = input()
while line != '':
    lines.append(line.upper())
    line = input()

for sentence in lines:
    print(sentence)
```

### 13. Net bank balance from a transaction log

**Features:** `while` loop with a sentinel condition, `str.split()`, `if`/`elif`, accumulator

**Question:**
Write a program that computes the net balance of a bank account from a transaction log supplied through the console. Each log line has the form:

```
D 100
W 200
```

`D` means deposit and `W` means withdrawal. Input ends at the first blank line.

For example, given the input:

```
D 300
D 300
W 200
D 100
```

the program should print:

```
500
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
net_amount = 0
line = input()
while line != '':
    operation, amount = line.split(' ')
    if operation == 'D':
        net_amount += int(amount)
    elif operation == 'W':
        net_amount -= int(amount)
    line = input()

print(net_amount)
```

### 14. Sum the series 1/2 + 2/3 + … + n/(n+1)

**Features:** `for` with `range()`, float accumulator, `float()` conversion

**Question:**
Write a program that computes `1/2 + 2/3 + 3/4 + … + n/(n+1)` for a given `n` (`n > 0`) supplied through the console.

For example, given the input:

```
5
```

the program should print:

```
3.55
```

**Hints:**
Use `float()` to convert an integer to a float.
**Solution:**

```python
n = int(input())
total = 0.0
for i in range(1, n + 1):
    total += i / (i + 1)
print(total)
```

### 15. Generate all subject–verb–object sentences

**Features:** nested `for` loops, list indexing, f-strings

**Question:**
Write a program that generates all the sentences whose subject is in `["I", "You"]`, whose verb is in `["Play", "Love"]`, and whose object is in `["Hockey", "Football"]`. Print one sentence per line, ending with a full stop — for example, `I Play Hockey.`

**Hints:**
Use `list[index]` notation to get an element from a list.
**Solution:**

```python
subjects = ["I", "You"]
verbs = ["Play", "Love"]
objects = ["Hockey", "Football"]
for i in range(len(subjects)):
    for j in range(len(verbs)):
        for k in range(len(objects)):
            sentence = f"{subjects[i]} {verbs[j]} {objects[k]}."
            print(sentence)
```

### 16. Chickens and rabbits puzzle

**Features:** `for` loop brute force, function returning a tuple, tuple unpacking

**Question:**
Write a program that solves a classic ancient Chinese puzzle: a farm has chickens and rabbits, and between them there are 35 heads and 94 legs. How many chickens and how many rabbits are there? Print the answer as a `(chickens, rabbits)` tuple.

**Hints:**
Use a `for` loop to try every possible combination.
**Solution:**

```python
def solve(numheads, numlegs):
    ns = 'No solutions!'
    for i in range(numheads + 1):
        j = numheads - i
        if 2 * i + 4 * j == numlegs:
            return i, j
    return ns, ns


numheads = 35
numlegs = 94
solutions = solve(numheads, numlegs)
print(solutions)
```

### 17. Binary search in a sorted list

**Features:** `while` loop, `if`/`elif`/`else`, index arithmetic, `math.floor()`

**Question:**
Write a binary search function that searches for an item in a sorted list and returns its index, or `-1` if it is not present. Test it by searching the list `[2, 5, 7, 9, 11, 17, 222]` for 11 and then for 12.

**Hints:**
Use `if`/`elif` to decide which half of the list to search next.
**Solution:**

```python
import math


def bin_search(li, element):
    bottom = 0
    top = len(li) - 1
    index = -1
    while top >= bottom and index == -1:
        mid = int(math.floor((top + bottom) / 2.0))
        if li[mid] == element:
            index = mid
        elif li[mid] > element:
            top = mid - 1
        else:
            bottom = mid + 1

    return index


li = [2, 5, 7, 9, 11, 17, 222]
print(bin_search(li, 11))
print(bin_search(li, 12))
```

## 4. Strings & character methods

Character classification (`isdigit()`, `isalpha()`, `isupper()`,
`islower()`), case conversion, and `%`-style string formatting.
### 18. Count letters and digits in a sentence

**Features:** `str.isdigit()`, `str.isalpha()`, dict counter, `for` over a string

**Question:**
Write a program that accepts a sentence and counts the number of letters and digits in it.

For example, given the input:

```
hello world! 123
```

the program should print:

```
LETTERS 10
DIGITS 3
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
s = input()
d = {"DIGITS": 0, "LETTERS": 0}
for c in s:
    if c.isdigit():
        d["DIGITS"] += 1
    elif c.isalpha():
        d["LETTERS"] += 1
    else:
        pass
print("LETTERS", d["LETTERS"])
print("DIGITS", d["DIGITS"])
```

### 19. Count upper-case and lower-case letters

**Features:** `str.isupper()`, `str.islower()`, dict counter

**Question:**
Write a program that accepts a sentence and counts the number of upper-case letters and lower-case letters in it.

For example, given the input:

```
Hello world!
```

the program should print:

```
UPPER CASE 1
LOWER CASE 9
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
s = input()
d = {"UPPER CASE": 0, "LOWER CASE": 0}
for c in s:
    if c.isupper():
        d["UPPER CASE"] += 1
    elif c.islower():
        d["LOWER CASE"] += 1
    else:
        pass
print("UPPER CASE", d["UPPER CASE"])
print("LOWER CASE", d["LOWER CASE"])
```

### 20. Compute a + aa + aaa + aaaa

**Features:** string concatenation, `int()` conversion

**Question:**
Write a program that computes the value of `a + aa + aaa + aaaa`, where `a` is a single digit supplied through the console.

For example, given the input:

```
9
```

the program should print:

```
11106
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
a = input()
n1 = int(a)
n2 = int(a + a)
n3 = int(a + a + a)
n4 = int(a + a + a + a)
print(n1 + n2 + n3 + n4)
```

---

# Part B — Built-in data structures

## 5. Lists & slicing

Building lists with `append()`, filtering and de-duplicating them, then slicing with positive and negative indexes, `[n:m]` ranges, `[::-1]` reversal and `[::2]` steps.
### 21. Build a list of squares (1–20)

**Features:** `list.append()`, `range()`, `**` operator

**Question:**
Define a function that generates and prints a list of the squares of the numbers between 1 and 20 (both included).

**Hints:**
Use the `**` operator to raise a number to a power.
Use `range()` in a `for` loop.
Use `list.append()` to add values to a list.
**Solution:**

```python
def print_list():
    li = []
    for i in range(1, 21):
        li.append(i ** 2)
    print(li)


print_list()
```

### 22. First 5 elements of a list

**Features:** slicing `[:5]`

**Question:**
Define a function that generates a list of the squares of the numbers between 1 and 20 (both included), then prints the first 5 elements of the list.

**Hints:**
Use the `**` operator to raise a number to a power.
Use `range()` in a `for` loop.
Use `list.append()` to add values to a list.
Use `[n1:n2]` to slice a list.
**Solution:**

```python
def print_list():
    li = []
    for i in range(1, 21):
        li.append(i ** 2)
    print(li[:5])


print_list()
```

### 23. Last 5 elements of a list

**Features:** negative slicing `[-5:]`

**Question:**
Define a function that generates a list of the squares of the numbers between 1 and 20 (both included), then prints the last 5 elements of the list.

**Hints:**
Use the `**` operator to raise a number to a power.
Use `range()` in a `for` loop.
Use `list.append()` to add values to a list.
Use `[n1:n2]` to slice a list.
**Solution:**

```python
def print_list():
    li = list()
    for i in range(1, 21):
        li.append(i**2)
    print(li[-5:])


print_list()
```

### 24. All elements except the first 5

**Features:** slicing `[5:]`

**Question:**
Define a function that generates a list of the squares of the numbers between 1 and 20 (both included), then prints every element except the first 5.

**Hints:**
Use the `**` operator to raise a number to a power.
Use `range()` in a `for` loop.
Use `list.append()` to add values to a list.
Use `[n1:n2]` to slice a list.
**Solution:**

```python
def print_list():
    li = list()
    for i in range(1, 21):
        li.append(i**2)
    print(li[5:])


print_list()
```

### 25. Print a string in reverse

**Features:** `str` from `input()`, slicing with `[::-1]`

**Question:**
Write a program that accepts a string from the console and prints it in reverse order.

For example, given the input:

```
rise to vote sir
```

the program should print:

```
ris etov ot esir
```

**Hints:**
Use slicing with `[::-1]` to reverse a string.
**Solution:**

```python
s = input()
s = s[::-1]
print(s)
```

### 26. Characters at even indexes

**Features:** slice with step `[::2]`

**Question:**
Write a program that accepts a string from the console and prints the characters at the even indexes.

For example, given the input:

```
H1e2l3l4o5w6o7r8l9d
```

the program should print:

```
Helloworld
```

**Hints:**
Use slicing with `[::2]` to take every second character.
**Solution:**

```python
s = input()
s = s[::2]
print(s)
```

### 27. Remove duplicates, preserving order

**Features:** membership test `not in`, `list.append()`

**Question:**
Given the list `[12, 24, 35, 24, 88, 120, 155, 88, 120, 155]`, write a program that prints the list with all duplicate values removed, preserving the original order.

**Hints:**
Use `in` to test whether a value is already in the result list.
**Solution:**

```python
numbers = [12, 24, 35, 24, 88, 120, 155, 88, 120, 155]
values = []
for number in numbers:
    if number not in values:
        values.append(number)

print(values)
```

## 6. Tuples

Creating tuples from lists with `tuple()`, slicing tuples, and iterating over
them.
### 28. Comma-separated numbers → list and tuple

**Features:** `str.split()`, `tuple()` conversion

**Question:**
Write a program that accepts a sequence of comma-separated numbers from the console and generates a list and a tuple containing every number.

For example, given the input:

```
34,67,55,33,12,98
```

the program should print:

```
['34', '67', '55', '33', '12', '98']
('34', '67', '55', '33', '12', '98')
```

**Hints:**
Assume the input is supplied through the console.
Use `tuple()` to convert a list to a tuple.
**Solution:**

```python
values = input()
items = values.split(',')
tuple_items = tuple(items)
print(items)
print(tuple_items)
```

### 29. Tuple of squares (1–20)

**Features:** `list.append()`, `tuple()` conversion

**Question:**
Define a function that generates and prints a tuple of the squares of the numbers between 1 and 20 (both included).

**Hints:**
Use the `**` operator to raise a number to a power.
Use `range()` in a `for` loop.
Use `list.append()` to add values to a list.
Use `tuple()` to convert a list to a tuple.
**Solution:**

```python
def print_tuple():
    li = list()
    for i in range(1, 21):
        li.append(i**2)
    print(tuple(li))


print_tuple()
```

### 30. Print the two halves of a tuple

**Features:** tuple slicing `[:n]`, `[n:]`

**Question:**
Given the tuple `(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)`, write a program that prints the first half of its values on one line and the second half on the next.

**Hints:**
Use `[n1:n2]` notation to take a slice of a tuple.
**Solution:**

```python
numbers = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
first_half = numbers[:5]
second_half = numbers[5:]
print(first_half)
print(second_half)
```

### 31. Even values of a tuple as a new tuple

**Features:** `for` over a tuple, `tuple()` conversion

**Question:**
Write a program that generates and prints a new tuple containing the even numbers of the tuple `(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)`.

**Hints:**
Use a `for` loop to iterate over the tuple.
Use `tuple()` to convert a list to a tuple.
**Solution:**

```python
numbers = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
values = []
for i in range(len(numbers)):
    if numbers[i] % 2 == 0:
        values.append(numbers[i])

evens = tuple(values)
print(evens)
```

## 7. Dictionaries

Building dictionaries, `dict.get()` with defaults, and iterating with
`keys()` / `items()`.
### 32. Dictionary of squares {i: i²}

**Features:** `dict()`, dictionary assignment, `range()`, `for` loop

**Question:**
Given an integer `n`, write a program that generates a dictionary containing the pairs `(i, i * i)` for every integer `i` between 1 and `n` (both included), then prints the dictionary.

For example, given the input:

```
8
```

the program should print:

```
{1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36, 7: 49, 8: 64}
```

**Hints:**
Assume the input is supplied through the console.
Use `dict()` or `{}` to create an empty dictionary.
**Solution:**

```python
n = int(input())
squares = {}
for i in range(1, n + 1):
    squares[i] = i * i

print(squares)
```

### 33. Dictionary of squares, 1–3

**Features:** `dict()`, `dict[key] = value`, `**` operator

**Question:**
Define a function that prints a dictionary whose keys are the numbers between 1 and 3 (both included) and whose values are the squares of those keys.

**Hints:**
Use the `dict[key] = value` pattern to add an entry to a dictionary.
Use the `**` operator to raise a number to a power.
**Solution:**

```python
def print_dict():
    d = dict()
    d[1] = 1
    d[2] = 2**2
    d[3] = 3**2
    print(d)


print_dict()
```

### 34. Dictionary of squares, 1–20

**Features:** `dict()`, `range()`, `for` loop

**Question:**
Define a function that prints a dictionary whose keys are the numbers between 1 and 20 (both included) and whose values are the squares of those keys.

**Hints:**
Use the `dict[key] = value` pattern to add an entry to a dictionary.
Use the `**` operator to raise a number to a power.
Use `range()` in a `for` loop.
**Solution:**

```python
def print_dict():
    d = dict()
    for i in range(1, 21):
        d[i] = i**2
    print(d)


print_dict()
```

### 35. Dictionary of squares — print the values only

**Features:** `dict.items()`, tuple unpacking

**Question:**
Define a function that generates a dictionary whose keys are the numbers between 1 and 20 (both included) and whose values are the squares of those keys, then prints only the values, one per line.

**Hints:**
Use the `dict[key] = value` pattern to add an entry to a dictionary.
Use the `**` operator to raise a number to a power.
Use `range()` in a `for` loop.
Use `dict.keys()` to iterate over the keys, or `dict.items()` to iterate over key/value pairs.
**Solution:**

```python
def print_dict():
    d = dict()
    for i in range(1, 21):
        d[i] = i**2
    for (k, v) in d.items():
        print(v)


print_dict()
```

### 36. Dictionary of squares — print the keys only

**Features:** `dict.keys()`

**Question:**
Define a function that generates a dictionary whose keys are the numbers between 1 and 20 (both included) and whose values are the squares of those keys, then prints only the keys, one per line.

**Hints:**
Use the `dict[key] = value` pattern to add an entry to a dictionary.
Use the `**` operator to raise a number to a power.
Use `range()` in a `for` loop.
Use `dict.keys()` to iterate over the keys, or `dict.items()` to iterate over key/value pairs.
**Solution:**

```python
def print_dict():
    d = dict()
    for i in range(1, 21):
        d[i] = i**2
    for k in d.keys():
        print(k)


print_dict()
```

### 37. Count each character in a string

**Features:** `dict.get(key, default)`, `dict.items()`, f-strings

**Question:**
Write a program that counts how many times each character appears in a string supplied through the console, and prints one `character,count` pair per line in first-appearance order.

For example, given the input:

```
abcdefgabc
```

the program should print:

```
a,2
b,2
c,2
d,1
e,1
f,1
g,1
```

**Hints:**
Use a `dict` to store key/value pairs.
Use `dict.get()` to look up a key with a default value.
**Solution:**

```python
counts = {}
text = input()
for char in text:
    counts[char] = counts.get(char, 0) + 1

for char, count in counts.items():
    print(f"{char},{count}")
```

---

# Part C — Functional & idiomatic Python

## 8. List comprehensions

Basic comprehensions, comprehensions with `if` filters, and comprehensions over `enumerate()` — one-dimensional only.
### 38. "Square" each odd number in a list

**Features:** list comprehension with `if` filter, `str.split()`, `str.join()`

**Question:**
Use a list comprehension to square each odd number in a list. The list is supplied as a sequence of comma-separated numbers.

For example, given the input:

```
1,2,3,4,5,6,7,8,9
```

the program should print:

```
1,9,25,49,81
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
values = input()
numbers = [str(int(x)**2) for x in values.split(",") if int(x) % 2 != 0]
print(",".join(numbers))
```

### 39. Remove even numbers from a list

**Features:** list comprehension with `if` filter

**Question:**
Write a program that prints the list `[5, 6, 77, 45, 22, 12, 24]` with the even numbers removed.

**Hints:**
Use a list comprehension to filter the list.
**Solution:**

```python
li = [5, 6, 77, 45, 22, 12, 24]
li = [x for x in li if x % 2 != 0]
print(li)
```

### 40. Remove numbers divisible by 5 and 7

**Features:** list comprehension with compound `if` filter

**Question:**
Use a list comprehension to print the list `[12, 24, 35, 70, 88, 120, 155]` with the numbers divisible by both 5 and 7 removed.

**Hints:**
Use a list comprehension to filter the list.
**Solution:**

```python
li = [12, 24, 35, 70, 88, 120, 155]
li = [x for x in li if x % 5 != 0 and x % 7 != 0]
print(li)
```

### 41. Remove all occurrences of a value

**Features:** list comprehension with equality filter

**Question:**
Use a list comprehension to print the list `[12, 24, 35, 24, 88, 120, 155]` with every occurrence of the value 24 removed.

**Hints:**
Use a list comprehension to keep the values that are not equal to 24.
**Solution:**

```python
li = [12, 24, 35, 24, 88, 120, 155]
li = [x for x in li if x != 24]
print(li)
```

### 42. Drop the even-indexed elements

**Features:** `enumerate()` in a comprehension, tuple unpacking `(i, x)`

**Question:**
Use a list comprehension to print the list `[12, 24, 35, 70, 88, 120, 155]` with the elements at indexes 0, 2, 4 and 6 removed.

**Hints:**
Use a list comprehension to filter the list.
Use `enumerate()` to get `(index, value)` tuples.
**Solution:**

```python
li = [12, 24, 35, 70, 88, 120, 155]
li = [x for (i, x) in enumerate(li) if i % 2 != 0]
print(li)
```

### 43. Drop elements at given indexes

**Features:** `enumerate()` in a comprehension, `not in` membership test against a tuple

**Question:**
Use a list comprehension to print the list `[12, 24, 35, 70, 88, 120, 155]` with the elements at indexes 0, 4 and 5 removed.

**Hints:**
Use a list comprehension to filter the list.
Use `enumerate()` to get `(index, value)` tuples.
**Solution:**

```python
li = [12, 24, 35, 70, 88, 120, 155]
li = [x for (i, x) in enumerate(li) if i not in (0, 4, 5)]
print(li)
```

### 44. 2-D multiplication array

**Features:** nested `for` loops, 2-D lists, `int()` conversion

**Question:**
Write a program that takes two numbers, `X` and `Y`, as comma-separated input and generates a 2-dimensional array in which the element in row `i` and column `j` is `i * j`, where `i = 0, 1, …, X-1` and `j = 0, 1, …, Y-1`.

For example, given the input:

```
3,5
```

the program should print:

```
[[0, 0, 0, 0, 0], [0, 1, 2, 3, 4], [0, 2, 4, 6, 8]]
```

**Hints:**
Assume the input is supplied through the console as two comma-separated numbers.
**Solution:**

```python
x_string, y_string = input().split(',')
x = int(x_string)
y = int(y_string)
matrix = []
for i in range(x):
    row = []
    for j in range(y):
        row.append(i * j)
    matrix.append(row)

print(matrix)
```

## 9. Recursion

Self-calling functions with base cases — factorial, linear recurrence,
Fibonacci — and combining recursion with a comprehension.
### 45. Factorial

**Features:** recursive `def`, base case

**Question:**
Write a program that computes the factorial of a number supplied through the console.

For example, given the input:

```
8
```

the program should print:

```
40320
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
def fact(x):
    if x == 0:
        return 1
    return x * fact(x - 1)


x = int(input())
print(fact(x))
```

### 46. f(n) = f(n−1) + 100

**Features:** recursion, `if`/`else` base case

**Question:**
Write a program that computes `f(n)` for a given `n` (`n > 0`) supplied through the console, where:

`f(n) = f(n-1) + 100` when `n > 0`, and `f(0) = 1`.

For example, given the input:

```
5
```

the program should print:

```
501
```

**Hints:**
Define a recursive function — one that calls itself — and give it a base case that stops the recursion.
**Solution:**

```python
def f(n):
    if n == 0:
        return 1
    else:
        return f(n - 1) + 100


n = int(input())
print(f(n))
```

### 47. Fibonacci number f(n)

**Features:** recursion with two base cases

**Question:**
The Fibonacci sequence is defined by:

`f(n) = 0` if `n = 0`
`f(n) = 1` if `n = 1`
`f(n) = f(n-1) + f(n-2)` if `n > 1`

Write a program that computes `f(n)` for a given `n` supplied through the console.

For example, given the input:

```
7
```

the program should print:

```
13
```

**Hints:**
Define a recursive function — one that calls itself — and give it base cases for `n = 0` and `n = 1`.
**Solution:**

```python
def f(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return f(n - 1) + f(n - 2)


n = int(input())
print(f(n))
```

### 48. Fibonacci sequence as a comma-separated string

**Features:** recursion + list comprehension, `str()`, `str.join()`

**Question:**
The Fibonacci sequence is defined by:

`f(n) = 0` if `n = 0`
`f(n) = 1` if `n = 1`
`f(n) = f(n-1) + f(n-2)` if `n > 1`

Using a list comprehension, write a program that prints the Fibonacci sequence from `f(0)` up to `f(n)` in comma-separated form, for a given `n` supplied through the console.

For example, given the input:

```
7
```

the program should print:

```
0,1,1,2,3,5,8,13
```

**Hints:**
Define a recursive function — one that calls itself — and give it base cases for `n = 0` and `n = 1`.
Use a list comprehension to build the list of values.
Use `str.join()` to join a list of strings.

Assume the input is supplied through the console.
**Solution:**

```python
def f(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return f(n - 1) + f(n - 2)


n = int(input())
values = [str(f(x)) for x in range(n + 1)]
print(",".join(values))
```

---

# Part D — OOP, errors & introspection

## 10. Classes & objects

Defining classes, `__init__` constructors, instance methods, and the
class-attribute vs instance-attribute distinction.
### 49. A string-handling class

**Features:** `class`, `__init__()`, instance methods, instance attributes, `str.upper()`

**Question:**
Define a class that has at least two methods:

`get_string()`, which reads a string from console input, and
`print_string()`, which prints the string in upper case.

Include a short test that calls both methods.

**Hints:**
Use the `__init__()` method to initialise the object's attributes.
**Solution:**

```python
class InputOutString:
    def __init__(self):
        self.s = ""

    def get_string(self):
        self.s = input()

    def print_string(self):
        print(self.s.upper())


string_obj = InputOutString()
string_obj.get_string()
string_obj.print_string()
```

### 50. Class attribute vs instance attribute

**Features:** class attributes, instance attributes, `__init__()` defaults

**Question:**
Define a class named `Person` with a class attribute `name` set to `"Person"` and an instance attribute `name` set through the constructor.

Create one instance whose name is `"Jeffrey"`, passed through the constructor, and a second instance whose name is set to `"Nico"` after construction. For each instance, print a line of the form:

```
Person name is Jeffrey
```

so the first line shows the class attribute and the second shows the instance attribute.

**Hints:**
Set an instance attribute inside the `__init__()` method.
An attribute can be passed to the constructor or assigned later.
**Solution:**

```python
class Person:
    # Define the class parameter "name"
    name = "Person"

    def __init__(self, name=None):
        # self.name is the instance parameter
        self.name = name


jeffrey = Person("Jeffrey")
print(f"{Person.name} name is {jeffrey.name}")

nico = Person()
nico.name = "Nico"
print(f"{Person.name} name is {nico.name}")
```

### 51. Circle with an area method

**Features:** `class`, `__init__()` with parameters, instance methods

**Question:**
Define a class named `Circle` that is constructed from a radius and has a method that computes the area, using 3.14 for π. Test it by printing the area of a circle of radius 2.

**Hints:**
Use `def method_name(self)` to define a method.
**Solution:**

```python
class Circle:
    def __init__(self, r):
        self.radius = r

    def area(self):
        return self.radius**2 * 3.14


circle = Circle(2)
print(circle.area())
```

### 52. Rectangle with an area method

**Features:** `class`, `__init__()` with parameters, instance methods

**Question:**
Define a class named `Rectangle` that is constructed from a length and a width and has a method that computes the area. Test it by printing the area of a 2 × 10 rectangle.

**Hints:**
Use `def method_name(self)` to define a method.
**Solution:**

```python
class Rectangle:
    def __init__(self, length, width):
        self.length = length
        self.width = width

    def area(self):
        return self.length * self.width


rectangle = Rectangle(2, 10)
print(rectangle.area())
```

## 11. Inheritance, polymorphism & static methods

Subclassing, method overriding, polymorphic dispatch, and the
`@staticmethod` decorator.
### 53. American and its subclass NewYorker

**Features:** `class Subclass(Parent)`, instantiation

**Question:**
Define a class named `American` and a subclass of it named `NewYorker`.

**Hints:**
Use `class Subclass(ParentClass)` to define a subclass.
**Solution:**

```python
class American:
    pass


class NewYorker(American):
    pass


american = American()
new_yorker = NewYorker()
print(american)
print(new_yorker)
```

### 54. Shape and Square: overriding `area()`

**Features:** inheritance, method overriding, `super().__init__()`

**Question:**
Define a class named `Shape` and a subclass of it named `Square`. The `Square` class has an `__init__()` method that takes a length as its argument. Both classes have an `area()` method that returns the area of the shape; a `Shape`'s area is 0 by default. Test it by printing the area of a square of length 3.

**Hints:**
To override a method of the parent class, define a method with the same name in the subclass.
**Solution:**

```python
class Shape:
    def __init__(self):
        pass

    def area(self):
        return 0


class Square(Shape):
    def __init__(self, length):
        super().__init__()
        self.length = length

    def area(self):
        return self.length ** 2


square = Square(3)
print(square.area())
```

### 55. Person, Male, Female — polymorphic `get_gender()`

**Features:** inheritance, method overriding, polymorphism

**Question:**
Define a class `Person` and two subclasses of it, `Male` and `Female`. Every class has a method `get_gender()`, which returns "Male" for the `Male` class and "Female" for the `Female` class. Test it by printing the gender of a `Male` instance and then of a `Female` instance.

**Hints:**
Use `class Subclass(ParentClass)` to define a subclass.
**Solution:**

```python
class Person:
    def get_gender(self):
        return "Unknown"


class Male(Person):
    def get_gender(self):
        return "Male"


class Female(Person):
    def get_gender(self):
        return "Female"


male = Male()
female = Female()
print(male.get_gender())
print(female.get_gender())
```

### 56. A class with a static method

**Features:** `@staticmethod` decorator

**Question:**
Define a class named `American` that has a static method called `print_nationality()`, which prints "America". Test it by calling the method once on an instance and once on the class itself.

**Hints:**
Use the `@staticmethod` decorator to define a static method.
**Solution:**

```python
class American:
    @staticmethod
    def print_nationality():
        print("America")


american = American()
american.print_nationality()
American.print_nationality()
```

## 12. Exceptions & assertions

Raising exceptions, catching them with `try`/`except`/`finally`, defining
custom exception classes, and `assert` statements.
### 57. Raise a RuntimeError

**Features:** `raise`

**Question:**
Write a program that raises a `RuntimeError` exception.

**Hints:**
Use the `raise` statement to raise an exception.
**Solution:**

```python
raise RuntimeError('something wrong')
```

### 58. Catch a division by zero

**Features:** `try`/`except`/`finally`, `ZeroDivisionError`, generic `Exception` handler

**Question:**
Write a function that computes `5 / 0`, and call it inside a `try`/`except` block that catches the `ZeroDivisionError`. Print `"division by zero!"` when the error is caught, and print `"In finally block for cleanup"` from a `finally` clause.

**Hints:**
Use `try`/`except` to catch exceptions, and `finally` for code that must always run.
**Solution:**

```python
def throws():
    return 5 / 0


try:
    throws()
except ZeroDivisionError:
    print("division by zero!")
except Exception as err:
    print('Caught an exception')
finally:
    print('In finally block for cleanup')
```

### 59. A custom exception class

**Features:** inheriting from `Exception`, docstrings

**Question:**
Define a custom exception class that takes a string message as an attribute.

**Hints:**
A custom exception is a class that inherits from `Exception`.
**Solution:**

```python
class MyError(Exception):
    """My own exception class

    Attributes:
        msg  -- explanation of the error
    """

    def __init__(self, msg):
        self.msg = msg


error = MyError("something wrong")
```

### 60. Assert every number is even

**Features:** `assert` statement

**Question:**
Write `assert` statements to verify that every number in the list `[2, 4, 6, 8]` is even.

**Hints:**
Use `assert expression` to make an assertion.
**Solution:**

```python
li = [2, 4, 6, 8]
for i in li:
    assert i % 2 == 0
```

---

# Part E — Standard library

## 13. `math`

Square roots, rounding and distance computations with the `math` module.
### 61. Evaluate Q = √(2CD/H)

**Features:** `math.sqrt()`, `round()`, `float()`, `int()`, `str.split()`, `str.join()`

**Question:**
Write a program that calculates and prints values according to the formula:

`Q = square root of [(2 * C * D) / H]`

where `C = 50` and `H = 30` are fixed, and the values of `D` are supplied to the program as a comma-separated sequence. Round each result to the nearest integer and print the results as a comma-separated sequence.

For example, given the input:

```
100,150,180
```

the program should print:

```
18,22,24
```

**Hints:**
If a result is a decimal, round it to the nearest whole number — for example, `26.0` should be printed as `26`.
Assume the input is supplied through the console.
**Solution:**

```python
#!/usr/bin/env python
import math
c = 50
h = 30
value = []
items = [x for x in input().split(',')]
for d in items:
    value.append(str(int(round(math.sqrt(2 * c * float(d) / h)))))

print(','.join(value))
```

### 62. Robot's distance from the origin

**Features:** `math.sqrt()`, `round()`, `while` loop with a sentinel condition, `str.split()`, `if`/`elif` dispatch

**Question:**
A robot moves in a plane, starting from the origin `(0, 0)`. It can move UP, DOWN, LEFT or RIGHT by a given number of steps, and its movements are recorded in a trace like this:

```
UP 5
DOWN 3
LEFT 3
RIGHT 2
```

The number after each direction is the number of steps. Write a program that computes the distance between the robot's final position and the origin after a sequence of movements. If the distance is not a whole number, print the nearest integer. Input ends at the first blank line.

For example, given the input:

```
UP 5
DOWN 3
LEFT 3
RIGHT 2
```

the program should print:

```
2
```

**Hints:**
Assume the input is supplied through the console.
**Solution:**

```python
import math

pos = [0, 0]
line = input()
while line != '':
    direction, steps = line.split(' ')
    if direction == 'UP':
        pos[0] += int(steps)
    elif direction == 'DOWN':
        pos[0] -= int(steps)
    elif direction == 'LEFT':
        pos[1] -= int(steps)
    elif direction == 'RIGHT':
        pos[1] += int(steps)
    line = input()

print(int(round(math.sqrt(pos[1] ** 2 + pos[0] ** 2))))
```

## 14. `random`

`random()`, `choice()`, `sample()`, `randrange()` and `shuffle()` — often
combined with list comprehensions to constrain the candidate pool.
### 63. A random float (scaled)

**Features:** `random.uniform()`

**Question:**
Use the `random` module to generate a random float between 10 and 100.

**Hints:**
Use `random.uniform()` to generate a random float within a range.
**Solution:**

```python
import random
print(random.uniform(10, 100))
```

### 64. A random float between 5 and 95

**Features:** `random.uniform()`

**Question:**
Use the `random` module to generate a random float between 5 and 95.

**Hints:**
Use `random.uniform()` to generate a random float within a range.
**Solution:**

```python
import random
print(random.uniform(5, 95))
```

### 65. Random even number between 0 and 10

**Features:** `random.choice()`, list comprehension

**Question:**
Use the `random` module and a list comprehension to print a random even number between 0 and 10 (both included).

**Hints:**
Use `random.choice()` to pick a random element from a list.
**Solution:**

```python
import random
print(random.choice([i for i in range(0, 11) if i % 2 == 0]))
```

### 66. Random number divisible by 5 and 7

**Features:** `random.choice()`, list comprehension with a compound filter

**Question:**
Use the `random` module and a list comprehension to print a random number between 0 and 1000 (both included) that is divisible by both 5 and 7.

**Hints:**
Use `random.choice()` to pick a random element from a list.
**Solution:**

```python
import random
print(random.choice([i for i in range(0, 1001) if i % 5 == 0 and i % 7 == 0]))
```

### 67. A list of 5 random numbers

**Features:** `random.sample()`

**Question:**
Write a program that generates a list of 5 random numbers between 100 and 200 (both included).

**Hints:**
Use `random.sample()` to pick several random values without repetition.
**Solution:**

```python
import random
print(random.sample(range(100, 201), 5))
```

### 68. 5 random even numbers (100–200)

**Features:** `random.sample()`, list comprehension

**Question:**
Write a program that generates a list of 5 random even numbers between 100 and 200 (both included).

**Hints:**
Use `random.sample()` to pick several random values without repetition.
**Solution:**

```python
import random
print(random.sample([i for i in range(100, 201) if i % 2 == 0], 5))
```

### 69. 5 random multiples of 5 and 7 (1–1000)

**Features:** `random.sample()`, list comprehension with a compound filter

**Question:**
Write a program that generates a list of 5 random numbers between 1 and 1000 (both included) that are divisible by both 5 and 7.

**Hints:**
Use `random.sample()` to pick several random values without repetition.
**Solution:**

```python
import random

multiples = [i for i in range(1, 1001) if i % 5 == 0 and i % 7 == 0]
print(random.sample(multiples, 5))
```

### 70. Random integer between 7 and 15

**Features:** `random.randrange()`

**Question:**
Write a program that prints a random integer between 7 and 15 (both included).

**Hints:**
Use `random.randrange()` to get a random integer from a range.
**Solution:**

```python
import random
print(random.randrange(7, 16))
```

### 71. Shuffle a list

**Features:** `random.shuffle()`, `from … import`

**Question:**
Write a program that shuffles and prints the list `[3, 6, 7, 8]`.

**Hints:**
Use `random.shuffle()` to shuffle a list in place.
**Solution:**

```python
from random import shuffle
li = [3, 6, 7, 8]
shuffle(li)
print(li)
```

## 15. `timeit`

Timing snippet execution with the `timeit` module.
### 72. Measure execution time

**Features:** `timeit.Timer`, `Timer.timeit()`

**Question:**
Write a program that prints the time taken to execute the statement `1 + 1` 100 times.

**Hints:**
Use the `timeit` module to measure execution time.
**Solution:**

```python
from timeit import Timer
timer = Timer("for i in range(100): 1 + 1")
print(timer.timeit())
```
