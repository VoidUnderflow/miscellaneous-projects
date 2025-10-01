Crate = library | binary (executable) = basic unit of compilation
Every target defined for a Cargo package is a crate. Why do we have two names for them?
Types of targets:
1. Cargo target. Cargo packages consist of targets which correspond to artifacts that will be produced: library, binary, example, test, benchmark.
   List of targets in Cargo.toml manifest.
2. Target directory. Where all artifacts + interm files are put.
3. Target architecture (OS + machine)
4. Target triple = way to specify target architecture, `<arch><sub>-<vendor>-<sys>-<abi>` e.g: armv7-pc-linux-gnu
A crate can be subdivided into modules.

Cargo = Rust package manager, ensures repeatable build.

Creating a binary program:
`cargo new hello_world --bin --vcs none`
`--bin` can be replaced by `--lib` (but it also initialises a new git repo by default)
`cargo build --release` = compile files with optimizations turned on.

Add packages by first updating the .toml deps:
```toml
[dependencies]
time="0.1.12"
regex="0.1.41"
```

#### Rust project structure
`src/lib.rs` = default library file
`src/main.rs` = default exe file
`benches` = benchmarks
`tests` = integration tests

#### Cargo.toml vs Cargo.lock
.toml describes dependencies, you write it, .lock generated from .toml by Cargo, don't edit it

Revisions in deps: 
```toml
regex = { git = "https://github.com/rust-lang/regex.git", rev = "9f9f693" }
```
Can update packages to latest version with `cargo update`, `cargo update specific_package`.

#### Ownership

Safety = absence of undefined behaviour

**Variables live in the stack.**
Variables live in frames; frame = mapping from variable to value within a single scope, like a function.
Frames are organized into a stack of currently-called functions. 

**Boxes live in the heap**
Heap = separate region of memory where data can live indefinitely, not tied to a specific stack frame.
Box = construct that allows putting data on the heap.

**Rust does not permit manual memory management**
A box's owner manages deallocation.
```rust
let a = Box::new([0; 1_000_000]);
let b = a;
```
First line: allocates an array of 1M zeros and binds it to a.
Second line: ownership is transferred from a to b.

Can **clone** elements.

### References and Borrowing
```rust
fn main() {
    let m1 = String::from("Hello");
    let m2 = String::from("world");
    greet(m1, m2);
    let s = format!("{} {}", m1, m2); // Error: m1 and m2 are moved
}

fn greet(g1: String, g2: String) {
    println!("{} {}!", g1, g2);
}
```
This is so weird, so the greet function moves m1 and m2??
As an inconvenient workaround, you could return g1, g2 in the greet function.
Convenient solution: references
```rust
fn main() {
    let m1 = String::from("Hello");
    let m2 = String::from("world");
    greet(&m1, &m2); // note the ampersands
    let s = format!("{} {}", m1, m2);
}

fn greet(g1: &String, g2: &String) { // note the ampersands
    println!("{} {}!", g1, g2);
}
```
g1 does not own m1 and neither the heap string "Hello".

**References** = non-owning pointers.

```rust
// Puts the number 1 on the heap.
// x is a pointer on the stack, pointing to the 1 on the heap.
// x OWNS the 1 on the heap.
let mut x: Box<i32> = Box::new(1);

// Since a is an i32, the following operation makes a copy of the value referenced by x.
// The copied value is on the stack, with a pointing to it.
let a: i32 = *x;

// This modifies the heap value x is pointing to.
*x += 1;

// If we were to print x and a in this order, we would get 2 and 1.

// r1 is a pointer on the stack, that points to x.
let r1: &Box<i32> = &x; 

// *r1 = x (the box itself)
// **r1 = 1 (the integer inside the box)
let b: i32 = **r1;

// *x dereferences the Box<i32>, so is basically the integer on the heap
// &*x = direct reference to the i32 on the heap.
let r2: &i32 = &*x;

// c is the value on the heap.
let c: i32 = *r2; 
```

Implicit de-referencing with the dot operator:
```rust
// x is on the stack, pointing to an i32 on the heap (-1)
let x: Box<i32> = Box::new(-1);

// Two ways to dereference x and call abs on it.
let x_abs1 = i32::abs(*x);
let x_abs2 = x.abs();
assert_eq!(x_abs1, x_abs2);
```

```rust
// r is on the stack, pointing to x, which is also on the stack.
let r: &Box<i32> = &x;

// De-referencing the "old way", *r = x, **r = -1
let r_abs1 = i32::abs(**r);

// De-referencing with the dot.
let r_abs2 = r.abs();
```

I don't understand this one yet.
```rust
let s = String::from("Hello");
let s_len1 = str::len(&s);
let s_len2 = s.len();   
assert_eq!(s_len1, s_len2);
```
So s is a string.
The len function requires a string address (why?)

```rust
fn main() {
	let x = Box::new(0);
	let y = Box::new(&x);
}
```
How many dereferences on y to copy 0?

So. x is on the stack, pointing to a 0 on the heap. y is on the stack, pointing to the heap to a reference to x. 
`*y = &x`
`**y = x`
`***y = 0`

#### How Rust avoids simultaneous aliasing and mutation
**Aliasing**  = accessing the same data through different variables.
**Aliasing + mutation** = big problem:
- One variable can deallocate the aliased data, leaving the other variable to point to deallocated memory.
- Mutating aliased data => other var's expectations can be invalidated.
- Concurrently mutating aliased data => undefined behaviour.

```rust
// Declare a vector and a pointer to the 3rd element.
let mut v: Vec<i32> = vec![1, 2, 3];
let num: &i32 = &v[2];

// Since v was at capacity, the push creates a new vector and copies the first three elements and appends the 4.
v.push(4);

println!("Third element is {}", *num); // undefined behavior, the third element might no longer be at this address
```

Basic principle in Rust:
**Pointer safety = data should never be aliased and mutated at the same time.**


#### Borrow checker
Variables have three kinds of permissions:
- R = Read = data can be copied to another location
- W = Write = data can be mutated
- O = Own = data can be moved or dropped
These permissions exist only at compile time.

A variable has RO permissions on its data, by default. 
If it was declared with `let mut` => also has W permission.
**References can temporarily remove these permissions.**

Example:
```rust
let mut v: Vec<i32> = vec![1, 2, 3];
// v gained RWO

let num: &i32 = &v[2];
// v lost WO
// num gained RO
// *num gained R

println!("Third element is {}", *num);
// v regained WO, because this is the last time num is used in the program;
// num lost RO
// *num lost R

v.push(4);
// v loses RWO as this is the last time it's used;
```
Q: Why do we have permissions for both `num` and `*num`?
A: Because accessing data through a reference is not the same as manipulating the reference itself.

```rust
// x has RO
let x = 0;

let mut x_ref = &x;
// x lost O
// x_ref gained RWO
// *x_ref only has R - why? Because *x_ref is basically x
```
This means that you can assign a different reference to x_ref, but not mutate the value it points to.

**Permissions are defined on places**, not just variables.
Place = anything on the LHS of an assignment:
- Variables `a`
- Dereferences of places `*a`
- Array accesses of places `a[0]`
- Fields of places `a.0` or `a.field`
- Any combination of the above `*((*a))[0].1` for example.

**Mutable references** = **unique references** = unique + non-owning.

More fun things:
Make a read-only, immutable reference `= &x`
Make a mutable reference: `= &mut x`


`let y: &mut i32 = &mut x;` = can mutate value, can't reassign binding;
`let mut y: &mut i32` = can mutate value, can reassign binding;
`let mut y: &i32` = can't mutate value, can reassign binding;


`let num: &mut i32 = &mut v[2];` -> v loses **all permissions**
`num` has RO
`*num` has  RW

**Permissions are returned at the end of a reference's lifetime**

**Data must outlive all of its references**
Example of error within a function:
```rust
let s = String::from("Hello world");
let s_ref = &s; // s loses O

drop(s); // error, to drop s, it must have O
println("{}", s_ref); // just a stmt to keep s_ref in the fold
```

Example when references cross function boundaries:
```rust
fn first(strings: &Vec<String>) -> &String {
	let s_ref = &strings[0];
	s_ref
}
```

When references come into or out of functions, Rust can't tell how long those references will live just from the body of the function => new permission named "flow permission" F.

F = this reference can safely flow in or out;
RWO = can change within the function
F is stable, if ref has F => can return it or use it as input safely

Error 1: missing lifetime specifier
```rust
fn first_or(strings: &Vec<String>, default: &String) -> &String {
    // returns either strings[0] or default
}
```
Doesn't know if the output &String is a reference to either strings or default.
If you were to create a new String within the function, you'd just create a new one and return String not &String (kinda weird, so does this imply that a &String return type implies that it's a reference to one of the two inputs necessarily??).
**A returned reference must always be linked to some input reference or a global/static value.**

Example where the previous function would be an issue:
```rust
fn main() {
    let strings = vec![];
    let default = String::from("default");
    let s = first_or(&strings, &default);
    drop(default);
    println!("{}", s);
}
```
Default can flow into s, which makes the drop undefined, since default wouldn't hold O in this case (s would).

Similar example:
```rust
fn return_a_string() -> &String {
    let s = String::from("Hello world");
    let s_ref = &s;
    s_ref
}
```
`s_ref` would be invalidated on function return

### Fixing ownership errors
```rust
fn return_a_string() -> &String {
    let s = String::from("Hello world");
    &s
}
```
Return reference to something that's scoped inside the function => bad.
1. Just return the thing, replace `&s` by `s`.
2. Return the string itself (`&'static str`). `'static` = lifetime that lasts the entire program;
3. ```rust
use std::rc::Rc;
fn return_a_string() -> Rc<String> {
    let s = Rc::new(String::from("Hello world"));
    Rc::clone(&s)
}
```
You increment refcount of the data.
4. Caller provides slot to put the string in using a mutable reference.
```rust
fn return_a_string(output: &mut String) {
    output.replace_range(.., "Hello world");
}
```


**There are cases in which safe programs can be marked as unsafe.**
### Structs
Just normal stuff, `struct User {...}` -> `User {...}`
Entire struct must be mutable (no fine-grained control).
Update struct pattern:
```rust
    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
```
Tuple struct:
```rust
struct Color(i32, i32, i32);
```
Unit struct:
```rust
struct AlwaysEqual;
```
Implementing struct methods with `impl`:
```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
```
If you omit self, you can have something like `fn Square(size: u32) -> Self`, called with `Rectangle::square(20)`.

Enums, `Some(val)`, `Option<i32>`, `None`.
Vectors, hashmaps, traits.