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
Write a method which can calculate square value of number

**Hints:**
Using the `**` operator

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
Define a function which can compute the sum of two numbers.

**Hints:**
Define a function with two numbers as arguments. You can compute the sum in the function and return the value.

**Solution:**

```python
def sum_function(number1, number2):
    return number1+number2


print(sum_function(1, 2))
```

### 3. Convert an integer to a string

**Features:** `str()` conversion

**Question:**
Define a function that can convert a integer into a string and print it in console.

**Hints:**
Use `str()` to convert a number to string.

**Solution:**

```python
def print_value(n):
    print(str(n))


print_value(3)
```

### 4. Sum of two numbers given as strings

**Features:** `int()` conversion, parameters

**Question:**
Define a function that can receive two integral numbers in string form and compute their sum and then print it in console.

**Hints:**
Use `int()` to convert a string to integer.

**Solution:**

```python
def print_value(s1, s2):
    print(int(s1)+int(s2))


print_value("3", "4")  # 7
```

### 5. Concatenate two strings

**Features:** string concatenation with `+`

**Question:**
Define a function that can accept two strings as input and concatenate them and then print it in console.

**Hints:**
Use `+` to concatenate the strings.

**Solution:**

```python
def print_value(s1, s2):
    print(s1+s2)


print_value("3", "4")
```

### 6. Print the longer of two strings

**Features:** `len()`, `if`/`elif`/`else`

**Question:**
Define a function that can accept two strings as input and print the string with maximum length in console. If two strings have the same length, then the function should print all strings line by line.

**Hints:**
Use the `len()` function to get the length of a string.

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

**Features:** `int(x, 2)` base conversion, `for` loops, `not`, `list.append`, `str.join`

**Question:**
Write a program which accepts a sequence of comma separated 4 digit binary numbers as its input and then check whether they are divisible by 5 or not. The numbers that are divisible by 5 are to be printed in a comma separated sequence.

Example:
If the following input is given to the program:

```
0100,0011,1010,1001
```

Then the output should be:

```
1010
```

Notes: Assume the data is input by console.

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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
Define a function that can accept an integer number as input and print the "It is an even number" if the number is even, otherwise print "It is an odd number".

**Hints:**
Use the `%` operator to check if a number is even or odd.

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
Write a program which accepts a string as input to print "Yes" if the string is "yes" or "YES" or "Yes", otherwise print "No".

**Hints:**
Use `if` statement to judge condition.

**Solution:**

```python
s = input()
if s == "yes" or s == "YES" or s == "Yes":
    print("Yes")
else:
    print("No")
```

### 10. Numbers whose digits are all even

**Features:** `str()` indexing, `%` operator, chained `and` conditions, `list.append`, `str.join`

**Question:**
Write a program, which will find all such numbers between 1000 and 3000 (both included) such that each digit of the number is an even number.
The numbers obtained should be printed in a comma-separated sequence on a single line.

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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

**Features:** `range()`, `for` loop, `%` with `and`, `list.append`, `str.join`

**Question:**
Write a program which will find all such numbers which are divisible by 7 but are not a multiple of 5,
between 2000 and 3200 (both included).
The numbers obtained should be printed in a comma-separated sequence on a single line.

**Hints:**
Consider using the `range(begin, end)` method.

**Solution:**

```python
items = []
for i in range(2000, 3201):
    if i % 7 == 0 and i % 5 != 0:
        items.append(str(i))

print(','.join(items))
```

### 12. Capitalise input lines until a blank line

**Features:** `while True`, `break`, `str.upper()`, `list.append`

**Question:**
Write a program that accepts sequence of lines as input and prints the lines after making all characters in the sentence capitalized.

Suppose the following input is supplied to the program:

```
Hello world
Practice makes perfect
```

Then, the output should be:

```
HELLO WORLD
PRACTICE MAKES PERFECT
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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

**Features:** `while True`/`break`, `str.split()`, `if`/`elif`, accumulator

**Question:**
Write a program that computes the net amount of a bank account based on a transaction log from console input. The transaction log format is shown as following:

```
D 100
W 200
```

`D` means deposit while `W` means withdrawal.

Suppose the following input is supplied to the program:

```
D 300
D 300
W 200
D 100
```

Then, the output should be:

```
500
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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
Write a program to compute `1/2 + 2/3 + 3/4 + … + n/(n+1)` with a given n input by console (`n > 0`).

Example:
If the following n is given as input to the program:

```
5
```

Then, the output of the program should be:

```
3.55
```

In case of input data being supplied to the question, it should be assumed to be a console input.

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
Please write a program to generate all sentences where subject is in `["I", "You"]` and verb is in `["Play", "Love"]` and the object is in `["Hockey", "Football"]`.

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
Write a program to solve a classic ancient Chinese puzzle:
We count 35 heads and 94 legs among the chickens and rabbits in a farm. How many rabbits and how many chickens do we have?

**Hints:**
Use a `for` loop to iterate all possible solutions.

**Solution:**

```python
def solve(numheads, numlegs):
    ns = 'No solutions!'
    for i in range(numheads+1):
        j = numheads-i
        if 2*i+4*j == numlegs:
            return i, j
    return ns, ns


numheads = 35
numlegs = 94
solutions = solve(numheads, numlegs)
print(solutions)
```

### 17. Binary search in a sorted list

**Features:** `while` loop, `if`/`elif`/`else`, index arithmetic, `math.floor`

**Question:**
Please write a binary search function which searches an item in a sorted list. The function should return the index of element to be searched in the list.

**Hints:**
Use `if`/`elif` to deal with conditions.

**Solution:**

```python
import math


def bin_search(li, element):
    bottom = 0
    top = len(li)-1
    index = -1
    while top >= bottom and index == -1:
        mid = int(math.floor((top+bottom)/2.0))
        if li[mid] == element:
            index = mid
        elif li[mid] > element:
            top = mid-1
        else:
            bottom = mid+1

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
Write a program that accepts a sentence and calculate the number of letters and digits.

Suppose the following input is supplied to the program:

```
hello world! 123
```

Then, the output should be:

```
LETTERS 10
DIGITS 3
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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
Write a program that accepts a sentence and calculate the number of upper case letters and lower case letters.

Suppose the following input is supplied to the program:

```
Hello world!
```

Then, the output should be:

```
UPPER CASE 1
LOWER CASE 9
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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
Write a program that computes the value of `a + aa + aaa + aaaa` with a given digit as the value of `a`.

Suppose the following input is supplied to the program:

```
9
```

Then, the output should be:

```
11106
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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

**Features:** `list()`, `list.append()`, `range()`, `**` operator

**Question:**
Define a function which can generate and print a list where the values are square of numbers between 1 and 20 (both included).

**Hints:**
Use `**` operator to get power of a number.
Use `range()` for loops.
Use `list.append()` to add values into a list.

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
Define a function which can generate a list where the values are square of numbers between 1 and 20 (both included). Then the function needs to print the first 5 elements in the list.

**Hints:**
Use `**` operator to get power of a number.
Use `range()` for loops.
Use `list.append()` to add values into a list.
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
Define a function which can generate a list where the values are square of numbers between 1 and 20 (both included). Then the function needs to print the last 5 elements in the list.

**Hints:**
Use `**` operator to get power of a number.
Use `range()` for loops.
Use `list.append()` to add values into a list.
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
Define a function which can generate a list where the values are square of numbers between 1 and 20 (both included). Then the function needs to print all values except the first 5 elements in the list.

**Hints:**
Use `**` operator to get power of a number.
Use `range()` for loops.
Use `list.append()` to add values into a list.
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

**Features:** `str` indexing, `while` loop with sentinel condition, slicing with `[::-1]`

**Question:**
Please write a program which accepts a string from console and print it in reverse order.

Example:
If the following string is given as input to the program:

```
rise to vote sir
```

Then, the output of the program should be:

```
ris etov ot esir
```

**Hints:**
Use `list[::-1]` to iterate a list in reverse order.

**Solution:**

```python
s = input()
s = s[::-1]
print(s)
```

### 26. Characters at even indexes

**Features:** slice with step `[::2]`

**Question:**
Please write a program which accepts a string from console and print the characters that have even indexes.

Example:
If the following string is given as input to the program:

```
H1e2l3l4o5w6o7r8l9d
```

Then, the output of the program should be:

```
Helloworld
```

**Hints:**
Use `list[::2]` to iterate a list by step 2.

**Solution:**

```python
s = input()
s = s[::2]
print(s)
```

### 27. Remove duplicates, preserving order

**Features:** membership test `not in`, `list.append()`

**Question:**
With a given list `[12, 24, 35, 24, 88, 120, 155, 88, 120, 155]`, write a program to print this list after removing all duplicate values with original order reserved.

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
Write a program which accepts a sequence of comma-separated numbers from console and generate a list and a tuple which contains every number.

Suppose the following input is supplied to the program:

```
34,67,55,33,12,98
```

Then, the output should be:

```
['34', '67', '55', '33', '12', '98']
('34', '67', '55', '33', '12', '98')
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.
The `tuple()` method can convert a list to a tuple.

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
Define a function which can generate and print a tuple where the value are square of numbers between 1 and 20 (both included).

**Hints:**
Use `**` operator to get power of a number.
Use `range()` for loops.
Use `list.append()` to add values into a list.
Use `tuple()` to get a tuple from a list.

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
With a given tuple `(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)`, write a program to print the first half values in one line and the last half values in one line.

**Hints:**
Use `[n1:n2]` notation to get a slice from a tuple.

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
Write a program to generate and print another tuple whose values are even numbers in the given tuple `(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)`.

**Hints:**
Use `for` to iterate the tuple.
Use `tuple()` to generate a tuple from a list.

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
With a given integral number n, write a program to generate a dictionary that contains `(i, i * i)` such that is an integral number between 1 and n (both included), and then the program should print the dictionary.

Suppose the following input is supplied to the program:

```
8
```

Then, the output should be:

```
{1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36, 7: 49, 8: 64}
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.
Consider using `dict()`.

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
Define a function which can print a dictionary where the keys are numbers between 1 and 3 (both included) and the values are square of keys.

**Hints:**
Use the `dict[key] = value` pattern to put entry into a dictionary.
Use the `**` operator to get power of a number.

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
Define a function which can print a dictionary where the keys are numbers between 1 and 20 (both included) and the values are square of keys.

**Hints:**
Use the `dict[key] = value` pattern to put entry into a dictionary.
Use the `**` operator to get power of a number.
Use `range()` for loops.

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
Define a function which can generate a dictionary where the keys are numbers between 1 and 20 (both included) and the values are square of keys. The function should just print the values only.

**Hints:**
Use the `dict[key] = value` pattern to put entry into a dictionary.
Use the `**` operator to get power of a number.
Use `range()` for loops.
Use `keys()` to iterate keys in the dictionary. Also we can use `items()` to get key/value pairs.

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
Define a function which can generate a dictionary where the keys are numbers between 1 and 20 (both included) and the values are square of keys. The function should just print the keys only.

**Hints:**
Use the `dict[key] = value` pattern to put entry into a dictionary.
Use the `**` operator to get power of a number.
Use `range()` for loops.
Use `keys()` to iterate keys in the dictionary. Also we can use `items()` to get key/value pairs.

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
Please write a program which count and print the numbers of each character in a string input by console.

Example:
If the following string is given as input to the program:

```
abcdefgabc
```

Then, the output of the program should be:

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
Use the `dict.get()` method to look up a key with default value.

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
Use a list comprehension to square each odd number in a list. The list is input by a sequence of comma-separated numbers.

Suppose the following input is supplied to the program:

```
1,2,3,4,5,6,7,8,9
```

Then, the output should be:

```
1,9,25,49,81
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
values = input()
numbers = [str(int(x)**2) for x in values.split(",") if int(x) % 2 != 0]
print(",".join(numbers))
```

### 39. Remove even numbers from a list

**Features:** list comprehension with `if` filter

**Question:**
Please write a program to print the list after removing even numbers in `[5, 6, 77, 45, 22, 12, 24]`.

**Hints:**
Use a list comprehension to remove elements from a list.

**Solution:**

```python
li = [5, 6, 77, 45, 22, 12, 24]
li = [x for x in li if x % 2 != 0]
print(li)
```

### 40. Remove numbers divisible by 5 and 7

**Features:** list comprehension with compound `if` filter

**Question:**
By using list comprehension, please write a program to print the list after removing numbers which are divisible by 5 and 7 in `[12, 24, 35, 70, 88, 120, 155]`.

**Hints:**
Use a list comprehension to remove elements from a list.

**Solution:**

```python
li = [12, 24, 35, 70, 88, 120, 155]
li = [x for x in li if x % 5 != 0 and x % 7 != 0]
print(li)
```

### 41. Remove all occurrences of a value

**Features:** list comprehension with equality filter

**Question:**
By using list comprehension, please write a program to print the list after removing the value 24 in [12,24,35,24,88,120,155].

**Hints:**
Use the list's `remove()` method to delete a value.

**Solution:**

```python
li = [12, 24, 35, 24, 88, 120, 155]
li = [x for x in li if x != 24]
print(li)
```

### 42. Drop the even-indexed elements

**Features:** `enumerate()` in a comprehension, tuple unpacking `(i, x)`

**Question:**
By using list comprehension, please write a program to print the list after removing the 0th, 2nd, 4th, 6th numbers in `[12, 24, 35, 70, 88, 120, 155]`.

**Hints:**
Use a list comprehension to remove elements from a list.
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
By using list comprehension, please write a program to print the list after removing the 0th, 4th, 5th numbers in `[12, 24, 35, 70, 88, 120, 155]`.

**Hints:**
Use a list comprehension to remove elements from a list.
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
Write a program which takes 2 digits, X,Y as input and generates a 2-dimensional array. The element value in the i-th row and j-th column of the array should be `i * j`.

Note: `i = 0, 1, …, X-1`; `j = 0, 1, …, Y-1`.

Example
Suppose the following inputs are given to the program:

```
3,5
```

Then, the output of the program should be:

```
[[0, 0, 0, 0, 0], [0, 1, 2, 3, 4], [0, 2, 4, 6, 8]]
```

**Hints:**
Note: In case of input data being supplied to the question, it should be assumed to be a console input in a comma-separated form.

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
Write a program which can compute the factorial of a given number.
The results should be printed in a comma-separated sequence on a single line.

Suppose the following input is supplied to the program:

```
8
```

Then, the output should be:

```
40320
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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
Write a program to compute:

`f(n) = f(n-1) + 100` when `n > 0`
and `f(0) = 1`

with a given n input by console (`n > 0`).

Example:
If the following n is given as input to the program:

```
5
```

Then, the output of the program should be:

```
501
```

In case of input data being supplied to the question, it should be assumed to be a console input.

**Hints:**
We can define recursive function in Python.

**Solution:**

```python
def f(n):
    if n == 0:
        return 1
    else:
        return f(n-1)+100


n = int(input())
print(f(n))
```

### 47. Fibonacci number f(n)

**Features:** recursion with two base cases

**Question:**
The Fibonacci Sequence is computed based on the following formula:

`f(n) = 0` if `n = 0`
`f(n) = 1` if `n = 1`
`f(n) = f(n-1) + f(n-2)` if `n > 1`

Please write a program to compute the value of f(n) with a given n input by console.

Example:
If the following n is given as input to the program:

```
7
```

Then, the output of the program should be:

```
13
```

In case of input data being supplied to the question, it should be assumed to be a console input.

**Hints:**
We can define recursive function in Python.

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
The Fibonacci Sequence is computed based on the following formula:

`f(n) = 0` if `n = 0`
`f(n) = 1` if `n = 1`
`f(n) = f(n-1) + f(n-2)` if `n > 1`

Please write a program using list comprehension to print the Fibonacci Sequence in comma separated form with a given n input by console.

Example:
If the following n is given as input to the program:

```
7
```

Then, the output of the program should be:

```
0,1,1,2,3,5,8,13
```

**Hints:**
We can define recursive function in Python.
Use a list comprehension to generate a list from an existing list.
Use `str.join()` to join a list of strings.

In case of input data being supplied to the question, it should be assumed to be a console input.

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

**Features:** `class`, `__init__`, instance methods, instance attributes, `str.upper()`

**Question:**
Define a class which has at least two methods:
`get_string()`: to get a string from console input
`print_string()`: to print the string in upper case.
Also please include simple test function to test the class methods.

**Hints:**
Use the `__init__()` method to construct some parameters.

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

### 50. Class parameter vs instance parameter

**Features:** class attributes, instance attributes, `__init__` defaults

**Question:**
Define a class which has a class parameter and an instance parameter with the same name.

**Hints:**
Define an instance parameter by adding it in the `__init__()` method.
You can initialise an object with constructor parameters or set the value later.

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

**Features:** `class`, `__init__` with parameters, instance methods

**Question:**
Define a class named `Circle` which can be constructed by a radius. The `Circle` class has a method which can compute the area.

**Hints:**
Use `def method_name(self)` to define a method.

**Solution:**

```python
class Circle:
    def __init__(self, r):
        self.radius = r

    def area(self):
        return self.radius**2*3.14


circle = Circle(2)
print(circle.area())
```

### 52. Rectangle with an area method

**Features:** `class`, `__init__` with parameters, instance methods

**Question:**
Define a class named `Rectangle` which can be constructed by a length and width. The `Rectangle` class has a method which can compute the area.

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
Define a class named `American` and its subclass `NewYorker`.

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

**Features:** inheritance, method overriding, calling the parent `__init__`

**Question:**
Define a class named `Shape` and its subclass `Square`. The `Square` class has an `__init__()` function which takes a length as argument. Both classes have an `area()` function which can print the area of the shape where `Shape`'s area is 0 by default.

**Hints:**
To override a method in the super class, we can define a method with the same name in the subclass.

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

### 55. Person, Male, Female — polymorphic `getGender`

**Features:** inheritance, method overriding, polymorphism

**Question:**
Define a class `Person` and its two child classes: `Male` and `Female`. All classes have a method `get_gender()` which can print "Male" for `Male` class and "Female" for `Female` class.

**Hints:**
Use `class Subclass(ParentClass)` to define a child class.

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
Define a class named `American` which has a static method called `print_nationality()`.

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
Please raise a RuntimeError exception.

**Hints:**
Use the `raise` statement to raise an exception.

**Solution:**

```python
raise RuntimeError('something wrong')
```

### 58. Catch a division by zero

**Features:** `try`/`except`/`finally`, `ZeroDivisionError`, generic `Exception` handler

**Question:**
Write a function to compute `5 / 0` and use `try`/`except` to catch the exception.

**Hints:**
Use `try`/`except` to catch exceptions.

**Solution:**

```python
def throws():
    return 5/0


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
Define a custom exception class which takes a string message as attribute.

**Hints:**
To define a custom exception, we need to define a class inherited from `Exception`.

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
Please write `assert` statements to verify that every number in the list `[2, 4, 6, 8]` is even.

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
Write a program that calculates and prints the value according to the given formula:

`Q = square root of [(2 * C * D) / H]`

Following are the fixed values of C and H:

`C = 50`. `H = 30`.

D is the variable whose values should be input to your program in a comma-separated sequence.

Example
Let us assume the following comma separated input sequence is given to the program:

```
100,150,180
```

The output of the program should be:

```
18,22,24
```

**Hints:**
If the output received is in decimal form, it should be rounded off to its nearest value (for example, if the output received is `26.0`, it should be printed as `26`).
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
#!/usr/bin/env python
import math
c = 50
h = 30
value = []
items = [x for x in input().split(',')]
for d in items:
    value.append(str(int(round(math.sqrt(2*c*float(d)/h)))))

print(','.join(value))
```

### 62. Robot's distance from the origin

**Features:** `math.sqrt()`, `round()`, `while` loop with sentinel condition, `str.split()`, `if`/`elif` dispatch

**Question:**
A robot moves in a plane starting from the original point `(0, 0)`. The robot can move toward UP, DOWN, LEFT and RIGHT with a given steps. The trace of robot movement is shown as the following:

```
UP 5
DOWN 3
LEFT 3
RIGHT 2
…
```

The numbers after the direction are steps. Please write a program to compute the distance from current position after a sequence of movement and original point. If the distance is a float, then just print the nearest integer.

Example:
If the following movements are given as input to the program:

```
UP 5
DOWN 3
LEFT 3
RIGHT 2
```

Then, the output of the program should be:

```
2
```

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

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

**Features:** `random.random()`

**Question:**
Please generate a random float where the value is between 10 and 100 using the `random` module.

**Hints:**
Use `random.random()` to generate a random float in `[0, 1]`.

**Solution:**

```python
import random
print(random.uniform(10, 100))
```

### 64. A random float between 5 and 95

**Features:** `random.random()`

**Question:**
Please generate a random float where the value is between 5 and 95 using the `random` module.

**Hints:**
Use `random.random()` to generate a random float in `[0, 1]`.

**Solution:**

```python
import random
print(random.uniform(5, 95))
```

### 65. Random even number between 0 and 10

**Features:** `random.choice()`, list comprehension

**Question:**
Please write a program to output a random even number between 0 and 10 inclusive using the `random` module and a list comprehension.

**Hints:**
Use `random.choice()` to pick a random element from a list.

**Solution:**

```python
import random
print(random.choice([i for i in range(0, 11) if i % 2 == 0]))
```

### 66. Random number divisible by 5 and 7

**Features:** `random.choice()`, list comprehension with compound filter

**Question:**
Please write a program to output a random number, which is divisible by 5 and 7, between 0 and 1000 inclusive using the `random` module and a list comprehension.

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
Please write a program to generate a list with 5 random numbers between 100 and 200 inclusive.

**Hints:**
Use `random.sample()` to generate a list of random values.

**Solution:**

```python
import random
print(random.sample(range(100, 201), 5))
```

### 68. 5 random even numbers (100–200)

**Features:** `random.sample()`, list comprehension

**Question:**
Please write a program to randomly generate a list with 5 even numbers between 100 and 200 inclusive.

**Hints:**
Use `random.sample()` to generate a list of random values.

**Solution:**

```python
import random
print(random.sample([i for i in range(100, 201) if i % 2 == 0], 5))
```

### 69. 5 random multiples of 5 and 7 (1–1000)

**Features:** `random.sample()`, list comprehension with compound filter

**Question:**
Please write a program to randomly generate a list with 5 numbers, which are divisible by 5 and 7, between 1 and 1000 inclusive.

**Hints:**
Use `random.sample()` to generate a list of random values.

**Solution:**

```python
import random

multiples = [i for i in range(1, 1001) if i % 5 == 0 and i % 7 == 0]
print(random.sample(multiples, 5))
```

### 70. Random integer between 7 and 15

**Features:** `random.randrange()`

**Question:**
Please write a program to randomly print a integer number between 7 and 15 inclusive.

**Hints:**
Use `random.randrange()` to get a random integer in a given range.

**Solution:**

```python
import random
print(random.randrange(7, 16))
```

### 71. Shuffle a list

**Features:** `random.shuffle()`, `from … import`

**Question:**
Please write a program to shuffle and print the list [3,6,7,8].

**Hints:**
Use `random.shuffle()` to shuffle a list.

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
Please write a program to print the running time of execution of `"1 + 1"` for 100 times.

**Hints:**
Use the `timeit` module to measure the running time.

**Solution:**

```python
from timeit import Timer
timer = Timer("for i in range(100): 1 + 1")
print(timer.timeit())
```
