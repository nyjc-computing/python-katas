# Python katas
## Contents
# Part A — Core language
## 1. Functions & type conversion
### 1. Square of a number

**Skills:** function, arithmetic operators, output

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

**Skills:** function, arithmetic operators, output

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

**Skills:** function, data types, output

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

**Skills:** function, data types, arithmetic operators, output

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

**Skills:** function, arithmetic operators, output

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

**Skills:** function, comparison operators, selection, output

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

**Skills:** input, tokenisation, data types, fixed iteration, filtering, output, string methods

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
### 8. Even or odd

**Skills:** function, arithmetic operators, selection, output

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

**Skills:** input, data validation, selection, comparison operators

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

**Skills:** fixed iteration, data types, selection, comparison operators

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
### 11. Divisible by 7 but not a multiple of 5

**Skills:** fixed iteration, arithmetic operators, logical operators, selection, output

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

### 12. FizzBuzz

**Skills:** fixed iteration, selection, arithmetic operators, logical operators, output

**Question:**
Write a program that prints the numbers from 1 to 100, replacing every multiple of three with "Fizz", every multiple of five with "Buzz", and every multiple of both three and five with "FizzBuzz".

**Hints:**
A number divisible by both 3 and 5 is divisible by 15.
**Solution:**

```python
for i in range(1, 101):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
```


### 13. Capitalise input lines until a blank line

**Skills:** input, sentinel loop, string methods, accumulator, output, conditional iteration

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

### 14. Net bank balance from a transaction log

**Skills:** input, sentinel loop, tokenisation, selection, accumulator, conditional iteration

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

### 15. Sum the series 1/2 + 2/3 + … + n/(n+1)

**Skills:** input, fixed iteration, accumulator, data types

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

### 16. Generate all subject–verb–object sentences

**Skills:** cartesian product, string formatting, tuple and list, output

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

### 17. Chickens and rabbits puzzle

**Skills:** function, search, fixed iteration, arithmetic operators, early return

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

### 18. Binary search in a sorted list

**Skills:** search, conditional iteration, function, indexing

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

### 19. 2-D multiplication array

**Skills:** input, tokenisation, cartesian product, nested data structure, accumulator

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

### 20. Multiplication table

**Skills:** function, fixed iteration, string formatting, output

**Question:**
Define a function `mult_table(n)` that takes an integer `n` and prints the n × n multiplication table. Each cell must be right-aligned, with at least a space between columns.

For example, `mult_table(5)` should print:

```
 1  2  3  4  5
 2  4  6  8 10
 3  6  9 12 15
 4  8 12 16 20
 5 10 15 20 25
```

**Hints:**
Right-align each cell with a format spec such as `{row * col:>{width}}`, where `width = len(str(n * n))`.
**Solution:**

```python
def mult_table(n):
    width = len(str(n * n))
    for row in range(1, n + 1):
        cells = []
        for col in range(1, n + 1):
            cells.append(f"{row * col:>{width}}")
        print(" ".join(cells))


mult_table(5)
```


## 4. Strings & character methods
### 21. Count letters and digits in a sentence

**Skills:** input, string methods, accumulator, selection

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

### 22. Count upper-case and lower-case letters

**Skills:** input, string methods, accumulator, selection

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

### 23. Compute a + aa + aaa + aaaa

**Skills:** input, data types, arithmetic operators, output

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

### 24. Percent-encode a string

**Skills:** function, fixed iteration, selection, string formatting, membership check

**Question:**
URLs only allow letters, digits, and the characters `-` `_` `.` `~`; every other character must be percent-encoded: replaced by `%` followed by the character code in upper-case hexadecimal.

Define a function `percent_encode(text)` that returns `text` with every character outside the allowed set encoded. For example, `percent_encode("!*'();:@&=+$,/?%#[]")` returns `'%21%2A%27%28%29%3B%3A%40%26%3D%2B%24%2C%2F%3F%25%23%5B%5D'`, and `percent_encode("Send a message")` returns `'Send%20a%20message'`.

**Hints:**
Test each character with `c.isalnum()` or membership in the string `"-_.~"`, and format the code with `f"%{ord(c):X}"`.
**Solution:**

```python
def percent_encode(text):
    encoded = ""
    for c in text:
        if c.isalnum() or c in "-_.~":
            encoded += c
        else:
            encoded += f"%{ord(c):X}"
    return encoded


print(percent_encode("!*'();:@&=+$,/?%#[]"))
print(percent_encode("Send a message"))
```

### 25. Unwrap a Google redirect URL

**Skills:** function, string methods, tokenisation, search, early return

**Question:**
Links in Google search results are rewritten to route through `google.com` before the browser follows them. Each rewritten link carries the destination, percent-encoded, in the `url` query parameter, like this:

```
https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjAhNDPz7zqAhVt_XMBHepeBf8QFjAAegQIBRAB&url=https%3A%2F%2Fmoz.com%2Flearn%2Fseo%2Fredirection&usg=AOvVaw0OxLud1UuZx_hO1HV9QrJ2
```

Define a function `undirect(link)` that takes a rewritten link and returns the original destination: the value of the `url` parameter, with `%3A` restored to `:` and `%2F` restored to `/`.

**Hints:**
Split the query string on `&` and `=`, look for the pair whose name is `url`, and decode it with `str.replace()` twice — once for `%3A`, once for `%2F`.
**Solution:**

```python
def undirect(link):
    for pair in link.split('?')[1].split('&'):
        name, value = pair.split('=')
        if name == 'url':
            return value.replace('%3A', ':').replace('%2F', '/')


redirect_url = (
    'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd='
    '&cad=rja&uact=8&ved=2ahUKEwjAhNDPz7zqAhVt_XMBHepeBf8QFjAAegQIBRAB'
    '&url=https%3A%2F%2Fmoz.com%2Flearn%2Fseo%2Fredirection'
    '&usg=AOvVaw0OxLud1UuZx_hO1HV9QrJ2'
)
print(undirect(redirect_url))
```

### 26. Look-and-say sequence

**Skills:** accumulator, indexed iteration, conditional iteration, string formatting

**Question:**
The look-and-say sequence starts from `1`. Each later term describes the previous term by reading off its runs of identical digits: a run of `M` consecutive copies of a digit `N` is written as the count followed by the digit, so `1211` — one 1, one 2, two 1s — reads as `111221`.

Write a program that prints the first 8 terms of the look-and-say sequence, one per line:

```
1
11
21
1211
111221
312211
13112221
1113213211
```

**Hints:**
Keep the current term in a string, and repeat 8 times: print the term, then build the next term from it.

Walk the term with an index `i`: while the character after `term[i]` matches it, extend the run and count it; when the run ends, append `f"{count}{term[i]}"` to the next term and move past the run.

**Solution:**
```python
term = "1"
for _ in range(8):
    print(term)
    next_term = ""
    i = 0
    while i < len(term):
        count = 1
        while i + 1 < len(term) and term[i] == term[i + 1]:
            i += 1
            count += 1
        next_term += f"{count}{term[i]}"
        i += 1
    term = next_term
```


---

# Part B — Built-in data structures
## 5. Lists & slicing
### 27. Build a list of squares (1–20)

**Skills:** function, fixed iteration, accumulator, arithmetic operators

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

### 28. First 5 elements of a list

**Skills:** function, accumulator, slicing, output

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

### 29. Last 5 elements of a list

**Skills:** function, accumulator, slicing, output

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

### 30. All elements except the first 5

**Skills:** function, accumulator, slicing, output

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

### 31. Print a string in reverse

**Skills:** input, slicing, output

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

### 32. Characters at even indexes

**Skills:** input, slicing, output

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

### 33. Remove duplicates, preserving order

**Skills:** tuple and list, membership check, fixed iteration, output

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
### 34. Comma-separated numbers → list and tuple

**Skills:** input, tokenisation, tuple and list, data types, output

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

### 35. Tuple of squares (1–20)

**Skills:** function, fixed iteration, tuple and list, arithmetic operators

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

### 36. Print the two halves of a tuple

**Skills:** tuple and list, slicing, output

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

### 37. Even values of a tuple as a new tuple

**Skills:** fixed iteration, selection, tuple and list, output

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
### 38. Dictionary of squares {i: i²}

**Skills:** input, dict, fixed iteration, arithmetic operators, output

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

### 39. Dictionary of squares, 1–3

**Skills:** function, dict, fixed iteration, arithmetic operators

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

### 40. Dictionary of squares, 1–20

**Skills:** function, dict, fixed iteration, arithmetic operators

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

### 41. Dictionary of squares — print the values only

**Skills:** function, dict, fixed iteration, output

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

### 42. Dictionary of squares — print the keys only

**Skills:** function, dict, fixed iteration, output

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

### 43. Count each character in a string

**Skills:** input, dict, accumulator, output

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
### 44. "Square" each odd number in a list

**Skills:** input, tokenisation, list comprehension, mapping, filtering

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

### 45. Remove even numbers from a list

**Skills:** list comprehension, filtering, arithmetic operators

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

### 46. Remove numbers divisible by 5 and 7

**Skills:** list comprehension, filtering, arithmetic operators, logical operators

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

### 47. Remove all occurrences of a value

**Skills:** list comprehension, filtering, comparison operators

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

### 48. Drop the even-indexed elements

**Skills:** list comprehension, indexed iteration, filtering

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

### 49. Drop elements at given indexes

**Skills:** list comprehension, indexed iteration, membership check

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

## 9. Recursion
### 50. Factorial

**Skills:** recursion, input, output

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

### 51. f(n) = f(n−1) + 100

**Skills:** recursion, input, output

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

### 52. Fibonacci number f(n)

**Skills:** recursion, input, output

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

### 53. Fibonacci sequence as a comma-separated string

**Skills:** recursion, list comprehension, mapping, input, output

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
### 54. A string-handling class

**Skills:** class, input, string methods, output

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

### 55. Class attribute vs instance attribute

**Skills:** class, class attribute, output

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

### 56. Circle with an area method

**Skills:** class, arithmetic operators, output

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

### 57. Rectangle with an area method

**Skills:** class, arithmetic operators, output

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

### 58. Caesar cipher class

**Skills:** class, string methods, fixed iteration, arithmetic operators

**Question:**
A Caesar cipher replaces each letter with the letter a fixed number of positions down the alphabet, wrapping around: with a shift of 5, `'a'` becomes `'f'` and `'y'` becomes `'d'`. Punctuation and spaces are left unchanged.

Define a class `CaesarCipher` instantiated with an integer shift. It should implement two methods: `encode(text)`, which returns the text with each letter shifted, and `decode(text)`, which restores it.

For example, `CaesarCipher(7)` encodes `'If he had anything confidential to say, he wrote it in cipher, that is, by so changing the order of the letters of the alphabet, that not a word could be made out.'` as `'Pm ol ohk hufaopun jvumpkluaphs av zhf, ol dyval pa pu jpwoly, aoha pz, if zv johunpun aol vykly vm aol slaalyz vm aol hswohila, aoha uva h dvyk jvbsk il thkl vba.'`

**Hints:**
Shift letters with `chr((ord(c) - base + shift) % 26 + base)`, where `base` is `ord('a')` or `ord('A')`.
Decoding is encoding with the opposite shift.
**Solution:**

```python
class CaesarCipher:
    def __init__(self, shift):
        self.shift = shift

    def encode(self, text):
        encoded = ""
        for c in text:
            if c.isalpha():
                if c.islower():
                    base = ord('a')
                else:
                    base = ord('A')
                encoded += chr((ord(c) - base + self.shift) % 26 + base)
            else:
                encoded += c
        return encoded

    def decode(self, text):
        return CaesarCipher(26 - self.shift).encode(text)


cipher = CaesarCipher(7)
sentence = ('If he had anything confidential to say, he wrote it in '
            'cipher, that is, by so changing the order of the letters '
            'of the alphabet, that not a word could be made out.')
encoded = cipher.encode(sentence)
print(encoded)
print(cipher.decode(encoded))
```


## 11. Inheritance, polymorphism & static methods
### 59. American and its subclass NewYorker

**Skills:** class, inheritance

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

### 60. Shape and Square: overriding `area()`

**Skills:** class, inheritance, polymorphism, output

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

### 61. Person, Male, Female — polymorphic `get_gender()`

**Skills:** class, inheritance, polymorphism, output

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

### 62. A class with a static method

**Skills:** class, staticmethod, output

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
### 63. Raise a RuntimeError

**Skills:** exception raising

**Question:**
Write a program that raises a `RuntimeError` exception.

**Hints:**
Use the `raise` statement to raise an exception.
**Solution:**

```python
raise RuntimeError('something wrong')
```

### 64. Catch a division by zero

**Skills:** exception handling, function, output

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

### 65. A custom exception class

**Skills:** class, inheritance

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

### 66. Assert every number is even

**Skills:** assert, fixed iteration, tuple and list

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
### 67. Evaluate Q = √(2CD/H)

**Skills:** input, tokenisation, math module, data types, output

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

### 68. Robot's distance from the origin

**Skills:** input, sentinel loop, tokenisation, math module, selection, conditional iteration

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
### 69. A random float (scaled)

**Skills:** random numbers, output

**Question:**
Use the `random` module to generate a random float between 10 and 100.

**Hints:**
Use `random.uniform()` to generate a random float within a range.
**Solution:**

```python
import random
print(random.uniform(10, 100))
```

### 70. A random float between 5 and 95

**Skills:** random numbers, output

**Question:**
Use the `random` module to generate a random float between 5 and 95.

**Hints:**
Use `random.uniform()` to generate a random float within a range.
**Solution:**

```python
import random
print(random.uniform(5, 95))
```

### 71. Random even number between 0 and 10

**Skills:** random numbers, list comprehension, selection, output

**Question:**
Use the `random` module and a list comprehension to print a random even number between 0 and 10 (both included).

**Hints:**
Use `random.choice()` to pick a random element from a list.
**Solution:**

```python
import random
print(random.choice([i for i in range(0, 11) if i % 2 == 0]))
```

### 72. Random number divisible by 5 and 7

**Skills:** random numbers, list comprehension, filtering

**Question:**
Use the `random` module and a list comprehension to print a random number between 0 and 1000 (both included) that is divisible by both 5 and 7.

**Hints:**
Use `random.choice()` to pick a random element from a list.
**Solution:**

```python
import random
print(random.choice([i for i in range(0, 1001) if i % 5 == 0 and i % 7 == 0]))
```

### 73. A list of 5 random numbers

**Skills:** random numbers, output

**Question:**
Write a program that generates a list of 5 random numbers between 100 and 200 (both included).

**Hints:**
Use `random.sample()` to pick several random values without repetition.
**Solution:**

```python
import random
print(random.sample(range(100, 201), 5))
```

### 74. 5 random even numbers (100–200)

**Skills:** random numbers, list comprehension, filtering

**Question:**
Write a program that generates a list of 5 random even numbers between 100 and 200 (both included).

**Hints:**
Use `random.sample()` to pick several random values without repetition.
**Solution:**

```python
import random
print(random.sample([i for i in range(100, 201) if i % 2 == 0], 5))
```

### 75. 5 random multiples of 5 and 7 (1–1000)

**Skills:** random numbers, list comprehension, filtering

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

### 76. Random integer between 7 and 15

**Skills:** random numbers, output

**Question:**
Write a program that prints a random integer between 7 and 15 (both included).

**Hints:**
Use `random.randrange()` to get a random integer from a range.
**Solution:**

```python
import random
print(random.randrange(7, 16))
```

### 77. Shuffle a list

**Skills:** random numbers, tuple and list, output

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
### 78. Measure execution time

**Skills:** time measurement, output

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


## 16. `datetime`
### 79. HTTP date string

**Skills:** date and time, string formatting, function

**Question:**
When a browser and server communicate over HTTP, the protocol fixes a format for dates: `Sun, 06 Nov 1994 08:49:37 GMT`. Define a function `http_date(moment)` that takes a `datetime` object representing a GMT time and returns it in this format.

**Hints:**
Build a fixed datetime with `datetime(1994, 11, 6, 8, 49, 37)`.
Format codes: `%a` weekday abbreviation, `%d` day, `%b` month abbreviation, `%Y` year, and `%H` `%M` `%S` for hour, minute, second.
**Solution:**

```python
from datetime import datetime


def http_date(moment):
    return f"{moment:%a, %d %b %Y %H:%M:%S} GMT"


print(http_date(datetime(1994, 11, 6, 8, 49, 37)))
print(http_date(datetime(2020, 7, 8, 10, 25, 28)))
```
