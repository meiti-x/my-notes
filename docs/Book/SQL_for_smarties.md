## Part 1
### chapter 2: Transactional and Concurrency control
[[ACID]]
[[BASE]]
[[Isolation Level]]
[[DeadLock]]
[[Livelock]]

### Chapter 3: Tables
> Conceptually, a table is a set of zero or more rows, and a row is a set of
> one or more columns. This hierarchy is important; actions apply at
> either the schema level, table level, row level, or column level.

- DROP TABLE is a schema level command that removes a table completely.

#### Check

- - ا`WHERE` توی **SELECT**، سطرهایی که مقدار `UNKNOWN` دارن رو هم فیلتر می‌کنه.
    - ولی `CHECK` مقدار `UNKNOWN` رو رد نمی‌کنه، مگر اینکه `NOT NULL` هم تنظیم شده باشه.
- **کاربردها:**
        `CHECK (rating BETWEEN 1 AND 10)`