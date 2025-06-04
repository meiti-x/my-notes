

## **۱. S - Single Responsibility Principle (SRP)**

**"هر کلاس یا ماژول باید فقط یک دلیل برای تغییر داشته باشد."**  
یعنی هر کلاس فقط باید **یک مسئولیت** داشته باشد.

✅ **خوب:**

```go
type ReportGenerator struct{}

func (r ReportGenerator) GenerateReport() string {
    return "Report Content"
}

type ReportSaver struct{}

func (r ReportSaver) Save(report string) {
    fmt.Println("Saving report:", report)
}
```

❌ **بد:**

```go
type Report struct{}

func (r Report) GenerateReport() string {
    return "Report Content"
}

func (r Report) Save() {
    fmt.Println("Saving report...")
}
```

🚨 **چرا؟**  
در نسخه بد، کلاس `Report` دو وظیفه دارد: **تولید گزارش و ذخیره آن**. اگر نیاز به تغییر نحوه ذخیره باشد، کلاس باید تغییر کند، که ناقض اصل SRP است.

---

## **۲. O - Open/Closed Principle (OCP)**

**"کلاس‌ها باید برای توسعه باز باشند، اما برای تغییر بسته باشند."**  
یعنی بتوانیم **رفتار جدیدی به کلاس اضافه کنیم بدون تغییر در کد قبلی**.

✅ **استفاده از اینترفیس برای توسعه‌پذیری**

```go
type Discount interface {
    Apply(price float64) float64
}

type NoDiscount struct{}

func (d NoDiscount) Apply(price float64) float64 {
    return price
}

type PercentageDiscount struct {
    percent float64
}

func (d PercentageDiscount) Apply(price float64) float64 {
    return price * (1 - d.percent/100)
}
```

در اینجا اگر نیاز به تخفیف جدیدی داشته باشیم، بدون تغییر کد قبلی فقط کافی است **یک Struct جدید اضافه کنیم**.

---

## **۳. L - Liskov Substitution Principle (LSP)**

**"هر زیرکلاس باید بدون ایجاد مشکل، جایگزین کلاس والد خود شود."**  
یعنی اگر `B` زیرکلاس `A` است، بتوانیم از `B` در هر جایی که `A` استفاده می‌شود، بدون ایجاد مشکل استفاده کنیم.

❌ **نقض LSP:**

```go
type Bird struct{}

func (b Bird) Fly() {
    fmt.Println("Flying...")
}

type Penguin struct {
    Bird
}
```

`Penguin` پرنده است اما **نمی‌تواند پرواز کند**. اگر تابعی وجود داشته باشد که از `Bird.Fly()` استفاده کند، با `Penguin` مشکل پیدا می‌کند. این **ناقض LSP** است.

✅ **اصلاح شده:**

```go
type Bird interface {
    Move()
}

type FlyingBird struct{}

func (b FlyingBird) Move() {
    fmt.Println("Flying...")
}

type WalkingBird struct{}

func (b WalkingBird) Move() {
    fmt.Println("Walking...")
}
```

در این مدل، `Penguin` را در دسته پرندگان **پیاده‌رو** قرار دادیم و دیگر مشکلی پیش نمی‌آید.

---

## **۴. I - Interface Segregation Principle (ISP)**

**"نباید کلاس‌ها را مجبور کنیم متدهایی را پیاده‌سازی کنند که به آن‌ها نیازی ندارند."**  
✅ **ایجاد اینترفیس‌های کوچک و هدفمند** به‌جای یک اینترفیس بزرگ.

❌ **نقض ISP:**

```go
type Worker interface {
    Work()
    Eat()
}
```

این باعث می‌شود که **همه کارگران مجبور باشند `Eat()` را پیاده‌سازی کنند**، حتی اگر نیازی نداشته باشند (مثلاً یک ربات).

✅ **اصلاح شده:**

```go
type Worker interface {
    Work()
}

type Eater interface {
    Eat()
}
```

حالا یک کلاس می‌تواند **فقط آنچه نیاز دارد** پیاده‌سازی کند.

---

## **۵. D - Dependency Inversion Principle (DIP)**

**"ماژول‌های سطح بالا نباید به ماژول‌های سطح پایین وابسته باشند، بلکه هر دو باید به یک انتزاع وابسته باشند."**  
یعنی **به جای وابستگی مستقیم به کلاس‌ها، از اینترفیس‌ها استفاده کنیم**.

❌ **نقض DIP:**

```go
type MySQLDB struct{}

func (db MySQLDB) GetData() string {
    return "data from MySQL"
}

type Service struct {
    db MySQLDB
}

func (s Service) Fetch() string {
    return s.db.GetData()
}
```

🚨 **مشکل:** `Service` به `MySQLDB` وابسته است و تغییر نوع دیتابیس سخت خواهد بود.

✅ **اصلاح شده با DIP:**

```go
type Database interface {
    GetData() string
}

type MySQLDB struct{}

func (db MySQLDB) GetData() string {
    return "data from MySQL"
}

type PostgresDB struct{}

func (db PostgresDB) GetData() string {
    return "data from Postgres"
}

type Service struct {
    db Database
}

func (s Service) Fetch() string {
    return s.db.GetData()
}
```

🔹 حالا می‌توانیم `MySQLDB` یا `PostgresDB` را بدون تغییر در `Service` جایگزین کنیم.

---

