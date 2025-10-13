use std::{thread, time::Duration};
use std::sync::{Arc, Mutex};

struct Table {
    forks: Vec<Mutex<()>>
}

struct Philosopher {
    name: String,
    left: usize,
    right: usize
}

impl Philosopher {
    fn new(name: &str, left: usize, right: usize) -> Philosopher {
        Philosopher { 
            name: name.to_string(),
            left: left,
            right: right 
        }
    }

    fn eat(&self, table: &Table) {
        println!("{} is eating.", self.name);

        let _left = table.forks[self.left].lock().unwrap();
        let _right = table.forks[self.right].lock().unwrap();

        thread::sleep(Duration::from_millis(1000));

        println!("{} is done eating.", self.name);
    }
}

fn main() {
    let table = Arc::new(Table { forks: vec![
        Mutex::new(()),
        Mutex::new(()),
        Mutex::new(()),
        Mutex::new(()),
        Mutex::new(()),
    ]});

    let philosophers = vec![
        Philosopher::new("Sartre", 0, 1),
        Philosopher::new("Seneca", 1, 2),
        Philosopher::new("Camus", 2, 3),
        Philosopher::new("Russell", 3, 4),
        Philosopher::new("Nietzsche", 0, 4)
    ];

    let handles: Vec<_> = philosophers.into_iter().map(|p| {
        let table = table.clone();

        thread::spawn(move || {
            p.eat(&table);
        })
    }).collect();

    for h in handles {
        h.join().unwrap()
    }
}
