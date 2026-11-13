# 90 Python Katas — Organised by Python Feature

Reorganised from `100+ Python katas.txt`. The source groups the katas into
"Levels" 1–3 plus assorted section markers (`2.10`, `2.14`, `3.4`, `3.5`,
`7.2`); that categorisation has been discarded. Katas are now sorted by the
**Python features they use or require**, ordered roughly from basic to
advanced and grouped into five parts.

Each kata carries a **Features:** line listing exactly what it practises, and
sits under its *primary* feature. Many katas combine several features — loops
and console input show up almost everywhere — so the per-kata feature line is
the more precise guide.

## Contents

- **Part A — Core language**
  1. Functions & type conversion — katas 1–7
  2. Operators, arithmetic & conditionals — katas 8–10
  3. Loops & iteration — katas 11–17
  4. Strings & character methods — katas 18–20
  5. Unicode & encodings — katas 21–23
- **Part B — Built-in data structures**
  6. Lists & slicing — katas 24–29
  7. Tuples — katas 30–33
  8. Dictionaries — katas 34–40
  9. Sets — katas 41–43
- **Part C — Functional & idiomatic Python**
  10. List comprehensions — katas 44–51
  11. `map`, `filter`, `lambda` & `itertools` — katas 52–57
  12. Sorting & sort keys — katas 58–59
  13. Recursion — katas 60–63
  14. Generators & `yield` — katas 64–66
- **Part D — OOP, errors & introspection**
  15. Classes & objects — katas 67–70
  16. Inheritance, polymorphism & static methods — katas 71–74
  17. Exceptions & assertions — katas 75–78
- **Part E — Standard library**
  18. `math` — katas 79–80
  19. `random` — katas 81–89
  20. `timeit` — kata 90

## Notes on fidelity

- Question texts and hints are kept **verbatim** from the source; solutions
  have been **refreshed to Python 3** (the source used Python 2) and repaired
  where they contradicted their own questions.
- Repairs made during the refresh: kata 33 indexed the tuple with its own
  values; kata 44 filtered odd numbers without squaring them (sample output
  updated to `1,9,25,49,81`); kata 61 returned `f(0)=0` against the stated
  `f(0)=1` (sample output updated to `501`); kata 64 called an undefined
  `reverse()`; katas 81–82 didn't produce the stated random ranges (now
  `random.uniform`).
- Removed at the maintainer's request: the three katas that appeared twice
  verbatim in the source, and the `eval`, `zlib`, `__doc__` and `re` katas
  (90 katas remain). The Unicode section is kept but expressed with Python 3
  semantics — `str` is already unicode, so kata 21 needs no `u""` prefix,
  kata 22 converts via `bytes.encode`, and kata 23's coding declaration is
  optional in Python 3.
- Encoding mojibake in the source (`Question£º`, `¡­`) has been cleaned to
  `Question:` and `…`.

---

# Part A — Core language

## 1. Functions & type conversion

Defining functions with `def`/`return`, parameters and calls; explicit type
conversion with `int()`, `str()`, `len()`; base-`int()` parsing.

### 1. Square of a number *(original Question 23)*

**Features:** `def`, `return`, `**` operator

**Question:**
Write a method which can calculate square value of number

**Hints:**
Using the ** operator

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
def SumFunction(number1, number2):
    return number1+number2

print(SumFunction(1,2))
```

### 3. Convert an integer to a string

**Features:** `str()` conversion

**Question:**
Define a function that can convert a integer into a string and print it in console.

**Hints:**
Use str() to convert a number to string.

**Solution:**

```python
def printValue(n):
    print(str(n))

printValue(3)
```

### 4. Sum of two numbers given as strings

**Features:** `int()` conversion, parameters

**Question:**
Define a function that can receive two integral numbers in string form and compute their sum and then print it in console.

**Hints:**
Use int() to convert a string to integer.

**Solution:**

```python
def printValue(s1,s2):
    print(int(s1)+int(s2))

printValue("3","4") #7
```

### 5. Concatenate two strings

**Features:** string concatenation with `+`

**Question:**
Define a function that can accept two strings as input and concatenate them and then print it in console.

**Hints:**
Use + to concatenate the strings

**Solution:**

```python
def printValue(s1,s2):
    print(s1+s2)

printValue("3","4") #34
```

### 6. Print the longer of two strings

**Features:** `len()`, `if`/`elif`/`else`

**Question:**
Define a function that can accept two strings as input and print the string with maximum length in console. If two strings have the same length, then the function should print all strings line by line.

**Hints:**
Use len() function to get the length of a string

**Solution:**

```python
def printValue(s1,s2):
    len1 = len(s1)
    len2 = len(s2)
    if len1>len2:
        print(s1)
    elif len2>len1:
        print(s2)
    else:
        print(s1)
        print(s2)

printValue("one","three")
```

### 7. Four-digit binary numbers divisible by 5 *(original Question 11)*

**Features:** `int(x, 2)` base conversion, `for` loops, `not`, `list.append`, `str.join`

**Question:**
Write a program which accepts a sequence of comma separated 4 digit binary numbers as its input and then check whether they are divisible by 5 or not. The numbers that are divisible by 5 are to be printed in a comma separated sequence.
Example:
0100,0011,1010,1001
Then the output should be:
1010
Notes: Assume the data is input by console.

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
value = []
items=[x for x in input().split(',')]
for p in items:
    intp = int(p, 2)
    if not intp%5:
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
Use % operator to check if a number is even or odd.

**Solution:**

```python
def checkValue(n):
    if n%2 == 0:
        print("It is an even number")
    else:
        print("It is an odd number")

checkValue(7)
```

### 9. Accept only "yes", "YES" or "Yes"

**Features:** string equality, boolean `or`, `if`/`else`

**Question:**
Write a program which accepts a string as input to print "Yes" if the string is "yes" or "YES" or "Yes", otherwise print "No".

**Hints:**
Use if statement to judge condition.

**Solution:**

```python
s= input()
if s=="yes" or s=="YES" or s=="Yes":
    print("Yes")
else:
    print("No")
```

### 10. Numbers whose digits are all even *(original Question 12)*

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
    s = str(i)
    if (int(s[0])%2==0) and (int(s[1])%2==0) and (int(s[2])%2==0) and (int(s[3])%2==0):
        values.append(s)
print(",".join(values))
```

## 3. Loops & iteration

`for` loops with `range()`, `while` loops with `break`, nested loops, and
accumulator patterns.

### 11. Divisible by 7 but not a multiple of 5 *(original Question 1)*

**Features:** `range()`, `for` loop, `%` with `and`, `list.append`, `str.join`

**Question:**
Write a program which will find all such numbers which are divisible by 7 but are not a multiple of 5,
between 2000 and 3200 (both included).
The numbers obtained should be printed in a comma-separated sequence on a single line.

**Hints:**
Consider use range(#begin, #end) method

**Solution:**

```python
l=[]
for i in range(2000, 3201):
    if (i%7==0) and (i%5!=0):
        l.append(str(i))

print(','.join(l))
```

### 12. Capitalise input lines until a blank line *(original Question 9)*

**Features:** `while True`, `break`, `str.upper()`, `list.append`

**Question:**
Write a program that accepts sequence of lines as input and prints the lines after making all characters in the sentence capitalized.
Suppose the following input is supplied to the program:
Hello world
Practice makes perfect
Then, the output should be:
HELLO WORLD
PRACTICE MAKES PERFECT

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
lines = []
while True:
    s = input()
    if s:
        lines.append(s.upper())
    else:
        break;

for sentence in lines:
    print(sentence)
```

### 13. Net bank balance from a transaction log *(original Question 17)*

**Features:** `while True`/`break`, `str.split()`, `if`/`elif`, accumulator

**Question:**
Write a program that computes the net amount of a bank account based a transaction log from console input. The transaction log format is shown as following:
D 100
W 200

D means deposit while W means withdrawal.
Suppose the following input is supplied to the program:
D 300
D 300
W 200
D 100
Then, the output should be:
500

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
netAmount = 0
while True:
    s = input()
    if not s:
        break
    values = s.split(" ")
    operation = values[0]
    amount = int(values[1])
    if operation=="D":
        netAmount+=amount
    elif operation=="W":
        netAmount-=amount
    else:
        pass
print(netAmount)
```

### 14. Sum the series 1/2 + 2/3 + … + n/(n+1)

**Features:** `for` with `range()`, float accumulator, `float()` conversion

**Question:**
Write a program to compute 1/2+2/3+3/4+...+n/n+1 with a given n input by console (n>0).

Example:
If the following n is given as input to the program:

5

Then, the output of the program should be:

3.55

In case of input data being supplied to the question, it should be assumed to be a console input.

**Hints:**
Use float() to convert an integer to a float

**Solution:**

```python
n=int(input())
sum=0.0
for i in range(1,n+1):
    sum += float(float(i)/(i+1))
print(sum)
```

### 15. Generate all subject–verb–object sentences

**Features:** nested `for` loops, list indexing, `%` formatting

**Question:**
Please write a program to generate all sentences where subject is in ["I", "You"] and verb is in ["Play", "Love"] and the object is in ["Hockey","Football"].

**Hints:**
Use list[index] notation to get a element from a list.

**Solution:**

```python
subjects=["I", "You"]
verbs=["Play", "Love"]
objects=["Hockey","Football"]
for i in range(len(subjects)):
    for j in range(len(verbs)):
        for k in range(len(objects)):
            sentence = "%s %s %s." % (subjects[i], verbs[j], objects[k])
            print(sentence)
```

### 16. Chickens and rabbits puzzle

**Features:** `for` loop brute force, function returning a tuple, tuple unpacking

**Question:**
Write a program to solve a classic ancient Chinese puzzle:
We count 35 heads and 94 legs among the chickens and rabbits in a farm. How many rabbits and how many chickens do we have?

**Hints:**
Use for loop to iterate all possible solutions.

**Solution:**

```python
def solve(numheads,numlegs):
    ns='No solutions!'
    for i in range(numheads+1):
        j=numheads-i
        if 2*i+4*j==numlegs:
            return i,j
    return ns,ns

numheads=35
numlegs=94
solutions=solve(numheads,numlegs)
print(solutions)
```

### 17. Binary search in a sorted list

**Features:** `while` loop, `if`/`elif`/`else`, index arithmetic, `math.floor`

**Question:**
Please write a binary search function which searches an item in a sorted list. The function should return the index of element to be searched in the list.

**Hints:**
Use if/elif to deal with conditions.

**Solution:**

```python
import math
def bin_search(li, element):
    bottom = 0
    top = len(li)-1
    index = -1
    while top>=bottom and index==-1:
        mid = int(math.floor((top+bottom)/2.0))
        if li[mid]==element:
            index = mid
        elif li[mid]>element:
            top = mid-1
        else:
            bottom = mid+1

    return index

li=[2,5,7,9,11,17,222]
print(bin_search(li,11))
print(bin_search(li,12))
```

## 4. Strings & character methods

Character classification (`isdigit()`, `isalpha()`, `isupper()`,
`islower()`), case conversion, and `%`-style string formatting.

### 18. Count letters and digits in a sentence *(original Question 13)*

**Features:** `str.isdigit()`, `str.isalpha()`, dict counter, `for` over a string

**Question:**
Write a program that accepts a sentence and calculate the number of letters and digits.
Suppose the following input is supplied to the program:
hello world! 123
Then, the output should be:
LETTERS 10
DIGITS 3

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
s = input()
d={"DIGITS":0, "LETTERS":0}
for c in s:
    if c.isdigit():
        d["DIGITS"]+=1
    elif c.isalpha():
        d["LETTERS"]+=1
    else:
        pass
print("LETTERS", d["LETTERS"])
print("DIGITS", d["DIGITS"])
```

### 19. Count upper-case and lower-case letters *(original Question 14)*

**Features:** `str.isupper()`, `str.islower()`, dict counter

**Question:**
Write a program that accepts a sentence and calculate the number of upper case letters and lower case letters.
Suppose the following input is supplied to the program:
Hello world!
Then, the output should be:
UPPER CASE 1
LOWER CASE 9

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
s = input()
d={"UPPER CASE":0, "LOWER CASE":0}
for c in s:
    if c.isupper():
        d["UPPER CASE"]+=1
    elif c.islower():
        d["LOWER CASE"]+=1
    else:
        pass
print("UPPER CASE", d["UPPER CASE"])
print("LOWER CASE", d["LOWER CASE"])
```

### 20. Compute a + aa + aaa + aaaa *(original Question 15)*

**Features:** `%`-style string formatting, `int()` conversion

**Question:**
Write a program that computes the value of a+aa+aaa+aaaa with a given digit as the value of a.
Suppose the following input is supplied to the program:
9
Then, the output should be:
11106

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
a = input()
n1 = int( "%s" % a )
n2 = int( "%s%s" % (a,a) )
n3 = int( "%s%s%s" % (a,a,a) )
n4 = int( "%s%s%s%s" % (a,a,a,a) )
print(n1+n2+n3+n4)
```

## 5. Unicode & encodings

Unicode string literals, explicit encoding conversion, and source-file
encoding declarations.

### 21. Print a unicode string

**Features:** `u"..."` unicode literals

**Question:**
Print a unicode string "hello world".

**Hints:**
Use u'strings' format to define unicode string.

**Solution:**

```python
unicode_string = "hello world!"
print(unicode_string)
```

### 22. Convert an ASCII string to UTF-8 unicode

**Features:** `unicode()` conversion, encodings

**Question:**
Write a program to read an ASCII string and to convert it to a unicode string encoded by utf-8.

**Hints:**
Use unicode() function to convert.

**Solution:**

```python
s = input()
u = s.encode("utf-8")
print(u)
```

### 23. Declare a source file's encoding

**Features:** `# -*- coding -*-` declaration

**Question:**
Write a special comment to indicate a Python source code file is in unicode.

**Solution:**

```python
# -*- coding: utf-8 -*-
# Optional in Python 3: source files default to UTF-8.
```

---

# Part B — Built-in data structures

## 6. Lists & slicing

Building lists with `append()`, then slicing with positive and negative
indexes, `[n:m]` ranges, `[::-1]` reversal and `[::2]` steps.

### 24. Build a list of squares (1–20)

**Features:** `list()`, `list.append()`, `range()`, `**` operator

**Question:**
Define a function which can generate and print a list where the values are square of numbers between 1 and 20 (both included).

**Hints:**
Use ** operator to get power of a number.
Use range() for loops.
Use list.append() to add values into a list.

**Solution:**

```python
def printList():
    li=list()
    for i in range(1,21):
        li.append(i**2)
    print(li)


printList()
```

### 25. First 5 elements of a list

**Features:** slicing `[:5]`

**Question:**
Define a function which can generate a list where the values are square of numbers between 1 and 20 (both included). Then the function needs to print the first 5 elements in the list.

**Hints:**
Use ** operator to get power of a number.
Use range() for loops.
Use list.append() to add values into a list.
Use [n1:n2] to slice a list

**Solution:**

```python
def printList():
    li=list()
    for i in range(1,21):
        li.append(i**2)
    print(li[:5])


printList()
```

### 26. Last 5 elements of a list

**Features:** negative slicing `[-5:]`

**Question:**
Define a function which can generate a list where the values are square of numbers between 1 and 20 (both included). Then the function needs to print the last 5 elements in the list.

**Hints:**
Use ** operator to get power of a number.
Use range() for loops.
Use list.append() to add values into a list.
Use [n1:n2] to slice a list

**Solution:**

```python
def printList():
    li=list()
    for i in range(1,21):
        li.append(i**2)
    print(li[-5:])


printList()
```

### 27. All elements except the first 5

**Features:** slicing `[5:]`

**Question:**
Define a function which can generate a list where the values are square of numbers between 1 and 20 (both included). Then the function needs to print all values except the first 5 elements in the list.

**Hints:**
Use ** operator to get power of a number.
Use range() for loops.
Use list.append() to add values into a list.
Use [n1:n2] to slice a list

**Solution:**

```python
def printList():
    li=list()
    for i in range(1,21):
        li.append(i**2)
    print(li[5:])


printList()
```

### 28. Print a string in reverse

**Features:** slice with step `[::-1]`

**Question:**
Please write a program which accepts a string from console and print it in reverse order.

Example:
If the following string is given as input to the program:

rise to vote sir

Then, the output of the program should be:

ris etov ot esir

**Hints:**
Use list[::-1] to iterate a list in a reverse order.

**Solution:**

```python
s=input()
s = s[::-1]
print(s)
```

### 29. Characters at even indexes

**Features:** slice with step `[::2]`

**Question:**
Please write a program which accepts a string from console and print the characters that have even indexes.

Example:
If the following string is given as input to the program:

H1e2l3l4o5w6o7r8l9d

Then, the output of the program should be:

Helloworld

**Hints:**
Use list[::2] to iterate a list by step 2.

**Solution:**

```python
s=input()
s = s[::2]
print(s)
```

## 7. Tuples

Creating tuples from lists with `tuple()`, slicing tuples, and iterating over
them.

### 30. Comma-separated numbers → list and tuple *(original Question 4)*

**Features:** `str.split()`, `tuple()` conversion

**Question:**
Write a program which accepts a sequence of comma-separated numbers from console and generate a list and a tuple which contains every number.
Suppose the following input is supplied to the program:
34,67,55,33,12,98
Then, the output should be:
['34', '67', '55', '33', '12', '98']
('34', '67', '55', '33', '12', '98')

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.
tuple() method can convert list to tuple

**Solution:**

```python
values=input()
l=values.split(",")
t=tuple(l)
print(l)
print(t)
```

### 31. Tuple of squares (1–20)

**Features:** `list.append()`, `tuple()` conversion

**Question:**
Define a function which can generate and print a tuple where the value are square of numbers between 1 and 20 (both included).

**Hints:**
Use ** operator to get power of a number.
Use range() for loops.
Use list.append() to add values into a list.
Use tuple() to get a tuple from a list.

**Solution:**

```python
def printTuple():
    li=list()
    for i in range(1,21):
        li.append(i**2)
    print(tuple(li))

printTuple()
```

### 32. Print the two halves of a tuple

**Features:** tuple slicing `[:n]`, `[n:]`

**Question:**
With a given tuple (1,2,3,4,5,6,7,8,9,10), write a program to print the first half values in one line and the last half values in one line.

**Hints:**
Use [n1:n2] notation to get a slice from a tuple.

**Solution:**

```python
tp=(1,2,3,4,5,6,7,8,9,10)
tp1=tp[:5]
tp2=tp[5:]
print(tp1)
print(tp2)
```

### 33. Even values of a tuple as a new tuple

**Features:** `for` over a tuple, `tuple()` conversion

**Question:**
Write a program to generate and print another tuple whose values are even numbers in the given tuple (1,2,3,4,5,6,7,8,9,10).

**Hints:**
Use "for" to iterate the tuple
Use tuple() to generate a tuple from a list.

**Solution:**

```python
tp=(1,2,3,4,5,6,7,8,9,10)
li=list()
for i in range(len(tp)):
    if tp[i]%2==0:
        li.append(tp[i])

tp2=tuple(li)
print(tp2)
```

## 8. Dictionaries

Building dictionaries, `dict.get()` with defaults, and iterating with
`keys()` / `items()`.

### 34. Dictionary of squares {i: i²} *(original Question 3)*

**Features:** `dict()`, dictionary assignment, `range()`, `for` loop

**Question:**
With a given integral number n, write a program to generate a dictionary that contains (i, i*i) such that is an integral number between 1 and n (both included). and then the program should print the dictionary.
Suppose the following input is supplied to the program:
8
Then, the output should be:
{1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36, 7: 49, 8: 64}

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.
Consider use dict()

**Solution:**

```python
n=int(input())
d=dict()
for i in range(1,n+1):
    d[i]=i*i

print(d)
```

### 35. Dictionary of squares, 1–3

**Features:** `dict()`, `dict[key] = value`, `**` operator

**Question:**
Define a function which can print a dictionary where the keys are numbers between 1 and 3 (both included) and the values are square of keys.

**Hints:**
Use dict[key]=value pattern to put entry into a dictionary.
Use ** operator to get power of a number.

**Solution:**

```python
def printDict():
    d=dict()
    d[1]=1
    d[2]=2**2
    d[3]=3**2
    print(d)


printDict()
```

### 36. Dictionary of squares, 1–20

**Features:** `dict()`, `range()`, `for` loop

**Question:**
Define a function which can print a dictionary where the keys are numbers between 1 and 20 (both included) and the values are square of keys.

**Hints:**
Use dict[key]=value pattern to put entry into a dictionary.
Use ** operator to get power of a number.
Use range() for loops.

**Solution:**

```python
def printDict():
    d=dict()
    for i in range(1,21):
        d[i]=i**2
    print(d)


printDict()
```

### 37. Dictionary of squares — print the values only

**Features:** `dict.items()`, tuple unpacking

**Question:**
Define a function which can generate a dictionary where the keys are numbers between 1 and 20 (both included) and the values are square of keys. The function should just print the values only.

**Hints:**
Use dict[key]=value pattern to put entry into a dictionary.
Use ** operator to get power of a number.
Use range() for loops.
Use keys() to iterate keys in the dictionary. Also we can use item() to get key/value pairs.

**Solution:**

```python
def printDict():
    d=dict()
    for i in range(1,21):
        d[i]=i**2
    for (k,v) in d.items():
        print(v)


printDict()
```

### 38. Dictionary of squares — print the keys only

**Features:** `dict.keys()`

**Question:**
Define a function which can generate a dictionary where the keys are numbers between 1 and 20 (both included) and the values are square of keys. The function should just print the keys only.

**Hints:**
Use dict[key]=value pattern to put entry into a dictionary.
Use ** operator to get power of a number.
Use range() for loops.
Use keys() to iterate keys in the dictionary. Also we can use item() to get key/value pairs.

**Solution:**

```python
def printDict():
    d=dict()
    for i in range(1,21):
        d[i]=i**2
    for k in d.keys():
        print(k)


printDict()
```

### 39. Word frequency, sorted by key *(original Question 22)*

**Features:** `dict.get(key, default)`, `keys()`, in-place `sort()`, `%` formatting

**Question:**
Write a program to compute the frequency of the words from the input. The output should output after sorting the key alphanumerically.
Suppose the following input is supplied to the program:
New to Python or choosing between Python 2 and Python 3? Read Python 2 or Python 3.
Then, the output should be:
2:2
3.:1
3?:1
New:1
Python:5
Read:1
and:1
between:1
choosing:1
or:2
to:1

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
freq = {}   # frequency of words in text
line = input()
for word in line.split():
    freq[word] = freq.get(word,0)+1

for w in sorted(freq):
    print("%s:%d" % (w,freq[w]))
```

### 40. Count each character in a string

**Features:** `dict.get(key, default)`, `dict.items()`, `str.join`, `%` formatting

**Question:**
Please write a program which count and print the numbers of each character in a string input by console.

Example:
If the following string is given as input to the program:

abcdefgabc

Then, the output of the program should be:

a,2
c,2
b,2
e,1
d,1
g,1
f,1

**Hints:**
Use dict to store key/value pairs.
Use dict.get() method to lookup a key with default value.

**Solution:**

```python
dic = {}
s=input()
for s in s:
    dic[s] = dic.get(s,0)+1
print('\n'.join(['%s,%s' % (k, v) for k, v in dic.items()]))
```

## 9. Sets

Deduplication with `set()`, sorted output of sets, set intersection with `&=`,
and order-preserving deduplication.

### 41. Remove duplicate words, sorted *(original Question 10)*

**Features:** `set()` deduplication, `sorted()`, `str.split()`, `str.join`

**Question:**
Write a program that accepts a sequence of whitespace separated words as input and prints the words after removing all duplicate words and sorting them alphanumerically.
Suppose the following input is supplied to the program:
hello world and practice makes perfect and hello world again
Then, the output should be:
again and hello makes perfect practice world

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.
We use set container to remove duplicated data automatically and then use sorted() to sort the data.

**Solution:**

```python
s = input()
words = [word for word in s.split(" ")]
print(" ".join(sorted(list(set(words)))))
```

### 42. Intersection of two lists

**Features:** `set()`, `&=` intersection operator

**Question:**
With two given lists [1,3,6,78,35,55] and [12,24,35,24,88,120,155], write a program to make a list whose elements are intersection of the above given lists.

**Hints:**
Use set() and "&=" to do set intersection operation.

**Solution:**

```python
set1=set([1,3,6,78,35,55])
set2=set([12,24,35,24,88,120,155])
set1 &= set2
li=list(set1)
print(li)
```

### 43. Remove duplicates, preserving order

**Features:** `set` as a "seen" tracker, `set.add()`, membership test `not in`

**Question:**
With a given list [12,24,35,24,88,120,155,88,120,155], write a program to print this list after removing all duplicate values with original order reserved.

**Hints:**
Use set() to store a number of values without duplicate.

**Solution:**

```python
def removeDuplicate( li ):
    newli=[]
    seen = set()
    for item in li:
        if item not in seen:
            seen.add( item )
            newli.append(item)

    return newli

li=[12,24,35,24,88,120,155,88,120,155]
print(removeDuplicate(li))
```

---

# Part C — Functional & idiomatic Python

## 10. List comprehensions

Basic comprehensions, comprehensions with `if` filters, comprehensions over
`enumerate()`, and nested 2-D/3-D comprehensions.

### 44. "Square" each odd number in a list *(original Question 16)*

**Features:** list comprehension with `if` filter, `str.split`, `str.join`

**Question:**
Use a list comprehension to square each odd number in a list. The list is input by a sequence of comma-separated numbers.
Suppose the following input is supplied to the program:
1,2,3,4,5,6,7,8,9
Then, the output should be:
1,9,25,49,81

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
values = input()
numbers = [str(int(x)**2) for x in values.split(",") if int(x) % 2 != 0]
print(",".join(numbers))
```

### 45. Remove even numbers from a list

**Features:** list comprehension with `if` filter

**Question:**
Please write a program to print the list after removing delete even numbers in [5,6,77,45,22,12,24].

**Hints:**
Use list comprehension to delete a bunch of element from a list.

**Solution:**

```python
li = [5,6,77,45,22,12,24]
li = [x for x in li if x%2!=0]
print(li)
```

### 46. Remove numbers divisible by 5 and 7

**Features:** list comprehension with compound `if` filter

**Question:**
By using list comprehension, please write a program to print the list after removing delete numbers which are divisible by 5 and 7 in [12,24,35,70,88,120,155].

**Hints:**
Use list comprehension to delete a bunch of element from a list.

**Solution:**

```python
li = [12,24,35,70,88,120,155]
li = [x for x in li if x%5!=0 and x%7!=0]
print(li)
```

### 47. Remove all occurrences of a value

**Features:** list comprehension with equality filter

**Question:**
By using list comprehension, please write a program to print the list after removing the value 24 in [12,24,35,24,88,120,155].

**Hints:**
Use list's remove method to delete a value.

**Solution:**

```python
li = [12,24,35,24,88,120,155]
li = [x for x in li if x!=24]
print(li)
```

### 48. Drop the even-indexed elements

**Features:** `enumerate()` in a comprehension, tuple unpacking `(i, x)`

**Question:**
By using list comprehension, please write a program to print the list after removing the 0th, 2nd, 4th,6th numbers in [12,24,35,70,88,120,155].

**Hints:**
Use list comprehension to delete a bunch of element from a list.
Use enumerate() to get (index, value) tuple.

**Solution:**

```python
li = [12,24,35,70,88,120,155]
li = [x for (i,x) in enumerate(li) if i%2!=0]
print(li)
```

### 49. Drop elements at given indexes

**Features:** `enumerate()` in a comprehension, `not in` membership test against a tuple

**Question:**
By using list comprehension, please write a program to print the list after removing the 0th,4th,5th numbers in [12,24,35,70,88,120,155].

**Hints:**
Use list comprehension to delete a bunch of element from a list.
Use enumerate() to get (index, value) tuple.

**Solution:**

```python
li = [12,24,35,70,88,120,155]
li = [x for (i,x) in enumerate(li) if i not in (0,4,5)]
print(li)
```

### 50. 2-D multiplication array *(original Question 7)*

**Features:** nested list comprehension, 2-D indexing, `int()` conversion

**Question:**
Write a program which takes 2 digits, X,Y as input and generates a 2-dimensional array. The element value in the i-th row and j-th column of the array should be i*j.
Note: i=0,1.., X-1; j=0,1,…,Y-1.
Example
Suppose the following inputs are given to the program:
3,5
Then, the output of the program should be:
[[0, 0, 0, 0, 0], [0, 1, 2, 3, 4], [0, 2, 4, 6, 8]]

**Hints:**
Note: In case of input data being supplied to the question, it should be assumed to be a console input in a comma-separated form.

**Solution:**

```python
input_str = input()
dimensions=[int(x) for x in input_str.split(',')]
rowNum=dimensions[0]
colNum=dimensions[1]
multilist = [[0 for col in range(colNum)] for row in range(rowNum)]

for row in range(rowNum):
    for col in range(colNum):
        multilist[row][col]= row*col

print(multilist)
```

### 51. 3-D array of zeros

**Features:** nested (3-level) list comprehension

**Question:**
By using list comprehension, please write a program generate a 3*5*8 3D array whose each element is 0.

**Hints:**
Use list comprehension to make an array.

**Solution:**

```python
array = [[ [0 for col in range(8)] for col in range(5)] for row in range(3)]
print(array)
```

## 11. `map`, `filter`, `lambda` & `itertools`

The classic functional trio — anonymous `lambda` functions passed to
`map()` and `filter()` — plus `itertools.permutations()`.

### 52. Filter even numbers with `filter()`

**Features:** `filter()`, `lambda`

**Question:**
Write a program which can filter even numbers in a list by using filter function. The list is: [1,2,3,4,5,6,7,8,9,10].

**Hints:**
Use filter() to filter some elements in a list.
Use lambda to define anonymous functions.

**Solution:**

```python
li = [1,2,3,4,5,6,7,8,9,10]
evenNumbers = filter(lambda x: x%2==0, li)
print(list(evenNumbers))
```

### 53. Square elements with `map()`

**Features:** `map()`, `lambda`

**Question:**
Write a program which can map() to make a list whose elements are square of elements in [1,2,3,4,5,6,7,8,9,10].

**Hints:**
Use map() to generate a list.
Use lambda to define anonymous functions.

**Solution:**

```python
li = [1,2,3,4,5,6,7,8,9,10]
squaredNumbers = map(lambda x: x**2, li)
print(list(squaredNumbers))
```

### 54. Filter even numbers from a range

**Features:** `filter()`, `lambda`, `range()`

**Question:**
Write a program which can filter() to make a list whose elements are even number between 1 and 20 (both included).

**Hints:**
Use filter() to filter elements of a list.
Use lambda to define anonymous functions.

**Solution:**

```python
evenNumbers = filter(lambda x: x%2==0, range(1,21))
print(list(evenNumbers))
```

### 55. Map squares over a range

**Features:** `map()`, `lambda`, `range()`

**Question:**
Write a program which can map() to make a list whose elements are square of numbers between 1 and 20 (both included).

**Hints:**
Use map() to generate a list.
Use lambda to define anonymous functions.

**Solution:**

```python
squaredNumbers = map(lambda x: x**2, range(1,21))
print(list(squaredNumbers))
```

### 56. Squares of the even numbers (`map` + `filter`)

**Features:** `map()` composed with `filter()`, `lambda`

**Question:**
Write a program which can map() and filter() to make a list whose elements are square of even number in [1,2,3,4,5,6,7,8,9,10].

**Hints:**
Use map() to generate a list.
Use filter() to filter elements of a list.
Use lambda to define anonymous functions.

**Solution:**

```python
li = [1,2,3,4,5,6,7,8,9,10]
print(list(map(lambda x: x**2, filter(lambda x: x%2==0, li))))
```

### 57. All permutations of [1, 2, 3]

**Features:** `itertools.permutations()`, `list()` conversion

**Question:**
Please write a program which prints all permutations of [1,2,3]

**Hints:**
Use itertools.permutations() to get permutations of list.

**Solution:**

```python
import itertools
print(list(itertools.permutations([1,2,3])))
```

## 12. Sorting & sort keys

In-place `list.sort()`, `sorted()`, and multi-key sorting with
`operator.itemgetter`.

### 58. Sort comma-separated words alphabetically *(original Question 8)*

**Features:** `str.split()`, `list.sort()`, `str.join`

**Question:**
Write a program that accepts a comma separated sequence of words as input and prints the words in a comma-separated sequence after sorting them alphabetically.
Suppose the following input is supplied to the program:
without,hello,bag,world
Then, the output should be:
bag,hello,without,world

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
items=[x for x in input().split(',')]
items.sort()
print(','.join(items))
```

### 59. Sort (name, age, height) tuples on multiple keys *(original Question 19)*

**Features:** `sorted()` with `key=`, `operator.itemgetter`, `tuple()` conversion, `while`/`break` input loop

**Question:**
You are required to write a program to sort the (name, age, height) tuples by ascending order where name is string, age and height are numbers. The tuples are input by console. The sort criteria is:
1: Sort based on name;
2: Then sort based on age;
3: Then sort by score.
The priority is that name > age > score.
If the following tuples are given as input to the program:
Tom,19,80
John,20,90
Jony,17,91
Jony,17,93
Json,21,85
Then, the output of the program should be:
[('John', '20', '90'), ('Jony', '17', '91'), ('Jony', '17', '93'), ('Json', '21', '85'), ('Tom', '19', '80')]

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.
We use itemgetter to enable multiple sort keys.

**Solution:**

```python
from operator import itemgetter, attrgetter

l = []
while True:
    s = input()
    if not s:
        break
    l.append(tuple(s.split(",")))

print(sorted(l, key=itemgetter(0,1,2)))
```

## 13. Recursion

Self-calling functions with base cases — factorial, linear recurrence,
Fibonacci — and combining recursion with a comprehension.

### 60. Factorial *(original Question 2)*

**Features:** recursive `def`, base case

**Question:**
Write a program which can compute the factorial of a given numbers.
The results should be printed in a comma-separated sequence on a single line.
Suppose the following input is supplied to the program:
8
Then, the output should be:
40320

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
def fact(x):
    if x == 0:
        return 1
    return x * fact(x - 1)

x=int(input())
print(fact(x))
```

### 61. f(n) = f(n−1) + 100

**Features:** recursion, `if`/`else` base case

**Question:**
Write a program to compute:

f(n)=f(n-1)+100 when n>0
and f(0)=1

with a given n input by console (n>0).

Example:
If the following n is given as input to the program:

5

Then, the output of the program should be:

501

In case of input data being supplied to the question, it should be assumed to be a console input.

**Hints:**
We can define recursive function in Python.

**Solution:**

```python
def f(n):
    if n==0:
        return 1
    else:
        return f(n-1)+100

n=int(input())
print(f(n))
```

### 62. Fibonacci number f(n)

**Features:** recursion with two base cases

**Question:**
The Fibonacci Sequence is computed based on the following formula:

f(n)=0 if n=0
f(n)=1 if n=1
f(n)=f(n-1)+f(n-2) if n>1

Please write a program to compute the value of f(n) with a given n input by console.

Example:
If the following n is given as input to the program:

7

Then, the output of the program should be:

13

In case of input data being supplied to the question, it should be assumed to be a console input.

**Hints:**
We can define recursive function in Python.

**Solution:**

```python
def f(n):
    if n == 0: return 0
    elif n == 1: return 1
    else: return f(n-1)+f(n-2)

n=int(input())
print(f(n))
```

### 63. Fibonacci sequence as a comma-separated string

**Features:** recursion + list comprehension, `str()`, `str.join`

**Question:**
The Fibonacci Sequence is computed based on the following formula:

f(n)=0 if n=0
f(n)=1 if n=1
f(n)=f(n-1)+f(n-2) if n>1

Please write a program using list comprehension to print the Fibonacci Sequence in comma separated form with a given n input by console.

Example:
If the following n is given as input to the program:

7

Then, the output of the program should be:

0,1,1,2,3,5,8,13

**Hints:**
We can define recursive function in Python.
Use list comprehension to generate a list from an existing list.
Use string.join() to join a list of strings.

In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
def f(n):
    if n == 0: return 0
    elif n == 1: return 1
    else: return f(n-1)+f(n-2)

n=int(input())
values = [str(f(x)) for x in range(0, n+1)]
print(",".join(values))
```

## 14. Generators & `yield`

Generator functions that produce values lazily with `yield`, consumed by
`for` loops.

### 64. Generator of multiples of 7 *(original Question 20)*

**Features:** `yield`, generator functions

**Question:**
Define a class with a generator which can iterate the numbers, which are divisible by 7, between a given range 0 and n.

**Hints:**
Consider use yield

**Solution:**

```python
def putNumbers(n):
    i = 0
    while i<n:
        j=i
        i=i+1
        if j%7==0:
            yield j

for i in putNumbers(100):
    print(i)
```

### 65. Generator of even numbers

**Features:** `yield`, `while` loop

**Question:**
Please write a program using generator to print the even numbers between 0 and n in comma separated form while n is input by console.

Example:
If the following n is given as input to the program:

10

Then, the output should be:

0,2,4,6,8,10

**Hints:**
Use yield to produce the next value in generator.

In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
def EvenGenerator(n):
    i=0
    while i<=n:
        if i%2==0:
            yield i
        i+=1


n=int(input())
values = []
for i in EvenGenerator(n):
    values.append(str(i))

print(",".join(values))
```

### 66. Generator of multiples of 5 and 7

**Features:** `yield`, `range()`, compound `if`

**Question:**
Please write a program using generator to print the numbers which can be divisible by 5 and 7 between 0 and n in comma separated form while n is input by console.

Example:
If the following n is given as input to the program:

100

Then, the output of the program should be:

0,35,70

**Hints:**
Use yield to produce the next value in generator.

In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
def NumGenerator(n):
    for i in range(n+1):
        if i%5==0 and i%7==0:
            yield i

n=int(input())
values = []
for i in NumGenerator(n):
    values.append(str(i))

print(",".join(values))
```

---

# Part D — OOP, errors & introspection

## 15. Classes & objects

Defining classes, `__init__` constructors, instance methods, and the
class-attribute vs instance-attribute distinction.

### 67. A string-handling class *(original Question 5)*

**Features:** `class`, `__init__`, instance methods, instance attributes, `str.upper()`

**Question:**
Define a class which has at least two methods:
getString: to get a string from console input
printString: to print the string in upper case.
Also please include simple test function to test the class methods.

**Hints:**
Use __init__ method to construct some parameters

**Solution:**

```python
class InputOutString(object):
    def __init__(self):
        self.s = ""

    def getString(self):
        self.s = input()

    def printString(self):
        print(self.s.upper())

strObj = InputOutString()
strObj.getString()
strObj.printString()
```

### 68. Class parameter vs instance parameter *(original Question 25)*

**Features:** class attributes, instance attributes, `__init__` defaults

**Question:**
Define a class, which have a class parameter and have a same instance parameter.

**Hints:**
Define a instance parameter, need add it in __init__ method
You can init a object with construct parameter or set the value later

**Solution:**

```python
class Person:
    # Define the class parameter "name"
    name = "Person"

    def __init__(self, name = None):
        # self.name is the instance parameter
        self.name = name

jeffrey = Person("Jeffrey")
print("%s name is %s" % (Person.name, jeffrey.name))

nico = Person()
nico.name = "Nico"
print("%s name is %s" % (Person.name, nico.name))
```

### 69. Circle with an area method

**Features:** `class`, `__init__` with parameters, instance methods

**Question:**
Define a class named Circle which can be constructed by a radius. The Circle class has a method which can compute the area.

**Hints:**
Use def methodName(self) to define a method.

**Solution:**

```python
class Circle(object):
    def __init__(self, r):
        self.radius = r

    def area(self):
        return self.radius**2*3.14

aCircle = Circle(2)
print(aCircle.area())
```

### 70. Rectangle with an area method

**Features:** `class`, `__init__` with parameters, instance methods

**Question:**
Define a class named Rectangle which can be constructed by a length and width. The Rectangle class has a method which can compute the area.

**Hints:**
Use def methodName(self) to define a method.

**Solution:**

```python
class Rectangle(object):
    def __init__(self, l, w):
        self.length = l
        self.width  = w

    def area(self):
        return self.length*self.width

aRectangle = Rectangle(2,10)
print(aRectangle.area())
```

## 16. Inheritance, polymorphism & static methods

Subclassing, method overriding, polymorphic dispatch, and the
`@staticmethod` decorator.

### 71. American and its subclass NewYorker

**Features:** `class Subclass(Parent)`, instantiation

**Question:**
Define a class named American and its subclass NewYorker.

**Hints:**
Use class Subclass(ParentClass) to define a subclass.

**Solution:**

```python
class American(object):
    pass

class NewYorker(American):
    pass

anAmerican = American()
aNewYorker = NewYorker()
print(anAmerican)
print(aNewYorker)
```

### 72. Shape and Square: overriding `area()`

**Features:** inheritance, method overriding, calling the parent `__init__`

**Question:**
Define a class named Shape and its subclass Square. The Square class has an init function which takes a length as argument. Both classes have a area function which can print the area of the shape where Shape's area is 0 by default.

**Hints:**
To override a method in super class, we can define a method with the same name in the super class.

**Solution:**

```python
class Shape(object):
    def __init__(self):
        pass

    def area(self):
        return 0

class Square(Shape):
    def __init__(self, l):
        Shape.__init__(self)
        self.length = l

    def area(self):
        return self.length*self.length

aSquare= Square(3)
print(aSquare.area())
```

### 73. Person, Male, Female — polymorphic `getGender`

**Features:** inheritance, method overriding, polymorphism

**Question:**
Define a class Person and its two child classes: Male and Female. All classes have a method "getGender" which can print "Male" for Male class and "Female" for Female class.

**Hints:**
Use Subclass(Parentclass) to define a child class.

**Solution:**

```python
class Person(object):
    def getGender( self ):
        return "Unknown"

class Male( Person ):
    def getGender( self ):
        return "Male"

class Female( Person ):
    def getGender( self ):
        return "Female"

aMale = Male()
aFemale= Female()
print(aMale.getGender())
print(aFemale.getGender())
```

### 74. A class with a static method

**Features:** `@staticmethod` decorator

**Question:**
Define a class named American which has a static method called printNationality.

**Hints:**
Use @staticmethod decorator to define class static method.

**Solution:**

```python
class American(object):
    @staticmethod
    def printNationality():
        print("America")

anAmerican = American()
anAmerican.printNationality()
American.printNationality()
```

## 17. Exceptions & assertions

Raising exceptions, catching them with `try`/`except`/`finally`, defining
custom exception classes, and `assert` statements.

### 75. Raise a RuntimeError

**Features:** `raise`

**Question:**
Please raise a RuntimeError exception.

**Hints:**
Use raise() to raise an exception.

**Solution:**

```python
raise RuntimeError('something wrong')
```

### 76. Catch a division by zero

**Features:** `try`/`except`/`finally`, `ZeroDivisionError`, generic `Exception` handler

**Question:**
Write a function to compute 5/0 and use try/except to catch the exceptions.

**Hints:**
Use try/except to catch exceptions.

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

### 77. A custom exception class

**Features:** inheriting from `Exception`, docstrings

**Question:**
Define a custom exception class which takes a string message as attribute.

**Hints:**
To define a custom exception, we need to define a class inherited from Exception.

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

### 78. Assert every number is even

**Features:** `assert` statement

**Question:**
Please write assert statements to verify that every number in the list [2,4,6,8] is even.

**Hints:**
Use "assert expression" to make assertion.

**Solution:**

```python
li = [2,4,6,8]
for i in li:
    assert i%2==0
```

---

# Part E — Standard library

## 18. `math`

Square roots, rounding and distance computations with the `math` module.

### 79. Evaluate Q = √(2CD/H) *(original Question 6)*

**Features:** `math.sqrt()`, `round()`, `float()`, `int()`, `str.join`

**Question:**
Write a program that calculates and prints the value according to the given formula:
Q = Square root of [(2 * C * D)/H]
Following are the fixed values of C and H:
C is 50. H is 30.
D is the variable whose values should be input to your program in a comma-separated sequence.
Example
Let us assume the following comma separated input sequence is given to the program:
100,150,180
The output of the program should be:
18,22,24

**Hints:**
If the output received is in decimal form, it should be rounded off to its nearest value (for example, if the output received is 26.0, it should be printed as 26)
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
#!/usr/bin/env python
import math
c=50
h=30
value = []
items=[x for x in input().split(',')]
for d in items:
    value.append(str(int(round(math.sqrt(2*c*float(d)/h)))))

print(','.join(value))
```

### 80. Robot's distance from the origin *(original Question 21)*

**Features:** `math.sqrt()`, `round()`, `while True`/`break`, `str.split()`, `if`/`elif` dispatch

**Question:**
A robot moves in a plane starting from the original point (0,0). The robot can move toward UP, DOWN, LEFT and RIGHT with a given steps. The trace of robot movement is shown as the following:
UP 5
DOWN 3
LEFT 3
RIGHT 2
…
The numbers after the direction are steps. Please write a program to compute the distance from current position after a sequence of movement and original point. If the distance is a float, then just print the nearest integer.
Example:
If the following tuples are given as input to the program:
UP 5
DOWN 3
LEFT 3
RIGHT 2
Then, the output of the program should be:
2

**Hints:**
In case of input data being supplied to the question, it should be assumed to be a console input.

**Solution:**

```python
import math
pos = [0,0]
while True:
    s = input()
    if not s:
        break
    movement = s.split(" ")
    direction = movement[0]
    steps = int(movement[1])
    if direction=="UP":
        pos[0]+=steps
    elif direction=="DOWN":
        pos[0]-=steps
    elif direction=="LEFT":
        pos[1]-=steps
    elif direction=="RIGHT":
        pos[1]+=steps
    else:
        pass

print(int(round(math.sqrt(pos[1]**2+pos[0]**2))))
```

## 19. `random`

`random()`, `choice()`, `sample()`, `randrange()` and `shuffle()` — often
combined with list comprehensions to constrain the candidate pool.

### 81. A random float (scaled)

**Features:** `random.random()`

**Question:**
Please generate a random float where the value is between 10 and 100 using Python math module.

**Hints:**
Use random.random() to generate a random float in [0,1].

**Solution:**

```python
import random
print(random.uniform(10, 100))
```

### 82. A random float between 5 and 95

**Features:** `random.random()`

**Question:**
Please generate a random float where the value is between 5 and 95 using Python math module.

**Hints:**
Use random.random() to generate a random float in [0,1].

**Solution:**

```python
import random
print(random.uniform(5, 95))
```

### 83. Random even number between 0 and 10

**Features:** `random.choice()`, list comprehension

**Question:**
Please write a program to output a random even number between 0 and 10 inclusive using random module and list comprehension.

**Hints:**
Use random.choice() to a random element from a list.

**Solution:**

```python
import random
print(random.choice([i for i in range(11) if i%2==0]))
```

### 84. Random number divisible by 5 and 7

**Features:** `random.choice()`, list comprehension with compound filter

**Question:**
Please write a program to output a random number, which is divisible by 5 and 7, between 0 and 10 inclusive using random module and list comprehension.

**Hints:**
Use random.choice() to a random element from a list.

**Solution:**

```python
import random
print(random.choice([i for i in range(201) if i%5==0 and i%7==0]))
```

### 85. A list of 5 random numbers

**Features:** `random.sample()`

**Question:**
Please write a program to generate a list with 5 random numbers between 100 and 200 inclusive.

**Hints:**
Use random.sample() to generate a list of random values.

**Solution:**

```python
import random
print(random.sample(range(100), 5))
```

### 86. 5 random even numbers (100–200)

**Features:** `random.sample()`, list comprehension

**Question:**
Please write a program to randomly generate a list with 5 even numbers between 100 and 200 inclusive.

**Hints:**
Use random.sample() to generate a list of random values.

**Solution:**

```python
import random
print(random.sample([i for i in range(100,201) if i%2==0], 5))
```

### 87. 5 random multiples of 5 and 7 (1–1000)

**Features:** `random.sample()`, list comprehension with compound filter

**Question:**
Please write a program to randomly generate a list with 5 numbers, which are divisible by 5 and 7 , between 1 and 1000 inclusive.

**Hints:**
Use random.sample() to generate a list of random values.

**Solution:**

```python
import random
print(random.sample([i for i in range(1,1001) if i%5==0 and i%7==0], 5))
```

### 88. Random integer between 7 and 15

**Features:** `random.randrange()`

**Question:**
Please write a program to randomly print a integer number between 7 and 15 inclusive.

**Hints:**
Use random.randrange() to a random integer in a given range.

**Solution:**

```python
import random
print(random.randrange(7,16))
```

### 89. Shuffle a list

**Features:** `random.shuffle()`, `from … import`

**Question:**
Please write a program to shuffle and print the list [3,6,7,8].

**Hints:**
Use shuffle() function to shuffle a list.

**Solution:**

```python
from random import shuffle
li = [3,6,7,8]
shuffle(li)
print(li)
```

## 20. `timeit`

Timing snippet execution with the `timeit` module.

### 90. Measure execution time

**Features:** `timeit.Timer`, `timeit()`

**Question:**
Please write a program to print the running time of execution of "1+1" for 100 times.

**Hints:**
Use timeit() function to measure the running time.

**Solution:**

```python
from timeit import Timer
t = Timer("for i in range(100):1+1")
print(t.timeit())
```
