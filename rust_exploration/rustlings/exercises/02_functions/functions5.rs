fn square(num: i32) -> i32 {
    let res: i32 = num * num;
    res
}

fn main() {
    let answer = square(3);
    println!("The square of 3 is {answer}");
}
