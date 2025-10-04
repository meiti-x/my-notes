
چرا اصلا کانکارنسی سخته چون معمولا غیر قابل پیش بینی هستی و  پیدا کردن مشکل سخت. فکر کن شما یه کد اسینکی نوشتی که درست کار میکنه ولی بعد ۵ سال یه تسک در پس و پیش اون کده اضافه میشه که باعث ترکیدن کد قبلی میشه
### Race Condition
کلا این پدیده زمانی اتفاق میفته که دو یا چند عملیات باید توی ترتیب درست اجرا شن که برنامه درست کار کنه ولی این شرایط و ترتیب همیشه گارانتی نمیشن. مثلا کد زیر:
~~~ go
var data int

go func() {
 data++ // 1
}()

if data == 0 { // 2
fmt.printf("the value is %v \n", data) // 3
}

~~~
سه تا حالت داره
- اول ۲ اجرا میشه بعد ۳ و بعد ۱
- اول ۱ اجرا میشه بعد ۲ و بعد ۳
- اول ۲ اجرا میشه بعد ۱ و بعد ۳
دقیقا مشکل کد کانکارنت همینه موقع نوشتن کد باید همه سناریو های لازم در نظر بگیریم. حالا اگه بیایم این کار رو بکنیم چی:
~~~ go
var data int

go func() {
 data++ // 1
}()

time.sleep(1*time.second)

if data == 0 { // 2
fmt.printf("the value is %v \n", data) // 3
}

~~~
ما با تاخیری که اضافه کردیم فقط احتمال وقوع رو کم کردیم ولی مشکل همچنان هست

### Atomicity
وقتی میگیم یه چیزی اتمیک هستش یعنی در اون کانتکستی که اجرا میشه غیرقابل تقسیم و غیرقابل وقفه است. یا همه اش رو انجام بده یا هیچی. چیزی که اینجا مهمه کانتکست هستش، یک چیزی میتونه در یک لایه اتمیک باشه ولی در لایه های دیگر اتمیک نباشه
مثلا این دستور ساده `++i` میتونه اتمیک باشه یا نه بستگی به کانتسک ما داره
- دریافت مقدار i
- افزایش مقدار i

حالا ممکنه هر کدوم از این مراحل **در سطح CPU به تنهایی اتمیک باشن**،  
ولی **ترکیبشون با هم** ممکنه اتمیک نباشه،  
مخصوصاً اگه **چند تا Thread یا Process** همزمان بخوان این دستور رو اجرا کنن.

یا فرض کن داریم یه رکورد جدید توی یه جدول دیتابیس اضافه می‌کنیم:

~~~sql
INSERT INTO users (id, name, balance) VALUES (1, 'Ali', 100);
~~~
 در سطح دیتابیس این دستور اتمیکه. یعنی یا کل رکورد `users` با همه ستون‌ها وارد میشه، یا اگه خطایی پیش بیاد **هیچ‌چیزی وارد نمی‌شه**. پس تو این لایه، این عملیات **اتمیک** هست.

حالا فرض کن ما از دیتابیسمون از طریق یه API استفاده می‌کنیم و چند تا سرور داریم. حالا دو کاربر تقریباً هم‌زمان درخواست می‌فرستن برای ساخت یوزر با همون `id = 1`.

اگه ما در سطح اپلیکیشن قبل از INSERT یه چک بکنیم که «آیا کاربری با این id وجود داره؟» و بعد تصمیم بگیریم که رکورد رو درج کنیم، ممکنه این سناریو پیش بیاد:

1. اThread A بررسی می‌کنه و می‌بینه که id = 1 وجود نداره
    
2. هم‌زمان Thread B هم همین کار رو می‌کنه
    
3. هر دو به این نتیجه می‌رسن که باید رکورد درج بشه
    
4. هر دو همزمان سعی می‌کنن INSERT بزنن
    
5. یکی موفق میشه، یکی خطا می‌گیره
    

### Memory Access Synchronization

وقتی چند goroutine دارن به یه تکه حافظه (مثلاً یه متغیر مشترک) هم‌زمان دسترسی پیدا می‌کنن، باید یه جوری **هماهنگشون کنیم** که داده خراب نشه.  به این هماهنگی برای دسترسی به حافظه می‌گیم **Memory Access Synchronization**.
حالا اگه اینارو مدیریت نکنیم ممکنه چندتا حالت پیش بیاد

### DeadLock

ددلاک وقتی اتفاق می‌افته که چند تا goroutine منتظر همدیگه باشن و هیچ‌کدوم نتونه کارشو ادامه بده. مثلا فرض کن دو تا قفل داریم. goroutine اول قفل A رو می‌گیره و منتظره قفل B آزاد بشه، هم‌زمان goroutine دوم قفل B رو گرفته و اونم منتظره قفل A. هیچ‌کدوم حاضر نیستن قفل رو ول کنن، پس برنامه همین‌جوری گیر می‌کنه و هیچ اتفاقی نمی‌افته.

### Livelock
لایولاک شبیه deadlock هست ولی یه تفاوت داره. تو deadlock همه متوقف شدن، ولی تو livelock همه دارن حرکت می‌کنن، فقط هیچ‌کدوم به نتیجه نمی‌رسن. انگار دو نفر روبروی هم ایستادن، هر دو می‌خوان کنار برن تا راه بدن، اما هر بار همزمان حرکت می‌کنن و دوباره جلوی هم قرار می‌گیرن. این چرخه همین‌جوری تکرار می‌شه و در نهایت هیچ‌کس جلو نمی‌ره.
مثلاً فرض کن دو goroutine داریم که هر وقت می‌بینن منبعی اشغاله، سریع عقب‌نشینی می‌کنن و دوباره امتحان می‌کنن(استیتشون عوض میشه). اگر این عقب‌نشینی‌ها و تلاش‌ها به‌شکلی باشه که هر بار دقیقاً با هم انجام بشن، هیچ‌وقت به منبع دسترسی پیدا نمی‌کنن. برنامه گیر نمی‌کنه مثل deadlock، ولی همچنان هیچ پیشرفتی هم اتفاق نمی‌افته.
### Starvation
گرسنگی زمانی پیش میاد که یه goroutine هیچ‌وقت به منبعی که لازم داره دسترسی پیدا نمی‌کنه. مثلا اگه منابع همیشه توسط بقیه goroutineها اشغال باشن، اون یکی بی‌نوا :) هیچ‌وقت نوبتش نمی‌رسه. نه به خاطر اینکه قفل شده یا گیر کرده، بلکه چون اولویت یا سیاست اجرای برنامه اجازه نمی‌ده بهش برسه.

## 2. Modeling your Code: Communicating Sequentional Process

## 3. Go's Concurrency Building Blocks
### goroutine
گوروتین ها پایه ای ترین واحد در برنامه های goی هستن. هر برنامه ای که ما ایجاد میکنیم حداقل داخل یک گوروتین اجرا میشه. گورتین ها **green thread** هستن که توسط runtime مدیریت میشه. گو از M/N model برای برنامه ریزی استفاده میکنه به این معنی که که n تا green thread به mتا thread واقعی مپ میشن یعنی در حین این مپپینگ ممکنه کد ما parallel یا concurrent اجرا شه که تصمیمش در اختیار runtime گو هستش

>**concurrency is a property of the code; parallelism is a property of the running program**

ما کدمون رو بصورت کانکارنت مینویسم و امیدواریم که به صورت paralel اجرا شه

:::tip
**آیا همیشه paralelism از concurrency بهتره؟**

قطعا خیر. parallelism برای مسائلی هستش که CPU-bound هستن یعنی پردازش موازی باعث افزایش سرعت پراسس میشن ولی کانکارنسی برای مسائل IO-Bound هستن مثلا تا زمانی که کانکشن دیتابیس آماده نشده یه کار دیگه بکنیم
:::

#### Fork-join Model
تو Go، مدل fork-join یعنی کار اصلی رو به چند goroutine تقسیم می‌کنی (fork) و بعد صبر می‌کنی همه تموم شن تا ادامه بدی (join). join می‌تونه با `WaitGroup` یا channel انجام بشه، و بدون هیچ sync، ممکنه go-routine ها اجرا نشن چون main زود تموم میشه.

~~~go
package main

import (
	"fmt"
	"sync"
)

// worker simulates some work for a given ID
func worker(id int, wg *sync.WaitGroup) {
	defer wg.Done() // signal that this goroutine is done
	fmt.Printf("Worker %d started\n", id)
	// simulate some work
	// time.Sleep(time.Second) // optional
	fmt.Printf("Worker %d finished\n", id)
}

func main() {
	var wg sync.WaitGroup

	// Fork: start multiple goroutines
	for i := 1; i <= 5; i++ {
		wg.Add(1)        // increment WaitGroup counter
		go worker(i, &wg) // start goroutine
	}

	// Join: wait for all goroutines to finish
	wg.Wait()

	fmt.Println("All workers finished, continue main flow...")
}

~~~


#### Mutex and RWMutex

تو Go، `Mutex` و `RWMutex` ابزارهایی برای همزمانی هستن که دسترسی سیف به داده‌های مشترک رو فراهم می‌کنن. `Mutex` یا همون "mutual exclusion" وقتی استفاده می‌شه که می‌خوای یه بخش کد رو به صورت **انحصاری** محافظت کنی؛ یعنی وقتی یه goroutine `Lock()` می‌کنه، بقیه باید صبر کنن تا `Unlock()` بشه. معمولاً از `defer lock.Unlock()` استفاده می‌کنن تا حتی اگه فانکشن panic کنه، قفل آزاد بشه.

ا`RWMutex` یا "Read/Write Mutex" مشابه `Mutex` عمل می‌کنه ولی با کنترل دقیق‌تر: چند goroutine می‌تونن همزمان داده‌ها رو بخونن (`RLock()`)، ولی وقتی یه goroutine بخواد بنویسه (`Lock()`)، دسترسی همه خواننده‌ها و نویسنده‌های دیگه مسدود می‌شه. این باعث می‌شه تو سناریوهایی که تعداد خواننده‌ها زیاده و نویسنده‌ها کم، عملکرد بهتر باشه.

هر دو برای همگام‌سازی حافظه در مقیاس کوچک و محلی مفید هستن و مکمل ابزارهای همزمانی دیگه مثل channelها هستن. Go اصولاً توصیه می‌کنه "share memory by communicating" ولی وقتی لازم باشه، این قفل‌ها ابزار مناسبی هستن.

:::note
برای سیگنال دادن تو Go از struct{} استفاده می‌کنن چون حجمش صفره و حافظه اضافه مصرف نمی‌کنه، علاوه بر اینکه مشخص می‌کنه فقط وجود سیگنال مهمه و مقدارش اهمیتی نداره، بر خلاف bool که ممکنه باعث سردرگمی یا مصرف حافظه اضافی بشه.

~~~go
done := make(chan struct{})
done <- struct{}{} // send signal
<-done             // receive signal
~~~
:::

#### Cond

#### Once

#### Pool
## 4. Concurrency patterns in Go

> این راهنما هر کدوم از الگوهای کانکارنسی در Go که گفتی رو **خیلی مفصل** توضیح می‌ده: تعریف، موارد استفاده، نکات پروڈاکشن، تله‌های رایج، و مثال کد تمیز. کدها همه با `context` و تمهیدات ضد-leak نوشته شدن.

---

# 🔒 1) Confinement (Actor-style Ownership)

**ایده:** یک goroutine «مالک» داده است؛ بقیه فقط از طریق پیام (channel) با این مالک حرف می‌زنند. قفل‌ها (mutex) به حداقل می‌رسند و invariants مرکزی ساده‌تر می‌شود.

**کِی استفاده کنیم؟**

- وقتی state اشتراکی حساس داریم (مثلاً `map`, LRU cache, حساب بانکی) و می‌خواهیم race نداشته باشیم.
    
- زمانی که throughput بالا ولی الگوی دسترسی ساده/سریالی است.
    

**مزایا:** ساده‌سازی reasoning، حذف deadlock کلاسیک، encapsulation.  
**معایب:** ممکن است یک bottleneck سریالی بسازد؛ اگر latency یک پیام زیاد شود، همه صبر می‌کنند.

**الگوی کلی (mini-actor):**

```go
package actor

import (
    "context"
)

type Command interface{}

type Get struct{ Reply chan<- int }
type Add struct{ N int }

type Counter struct {
    cmds chan Command
}

func NewCounter(buffer int) *Counter {
    return &Counter{cmds: make(chan Command, buffer)}
}

func (c *Counter) Run(ctx context.Context) {
    var val int
    for {
        select {
        case <-ctx.Done():
            return
        case cmd := <-c.cmds:
            switch m := cmd.(type) {
            case Add:
                val += m.N
            case Get:
                // non-blocking safety: اگر مصرف‌کننده crash کرد باعث deadlock نشویم
                select {
                case m.Reply <- val:
                case <-ctx.Done():
                    return
                }
            }
        }
    }
}

func (c *Counter) Add(n int) { c.cmds <- Add{N: n} }

func (c *Counter) Get(ctx context.Context) (int, bool) {
    reply := make(chan int, 1)
    select {
    case c.cmds <- Get{Reply: reply}:
    case <-ctx.Done():
        return 0, false
    }
    select {
    case v := <-reply:
        return v, true
    case <-ctx.Done():
        return 0, false
    }
}
```

**نکات پروڈاکشن:**

- همیشه `ctx.Done()` را در loop چک کنید.
    
- کانال‌ها را bufferدار بگیرید تا backpressure مدیریت شود (بسته به SLA).
    
- از counters/metrics (مانند طول صف) برای capacity planning استفاده کنید.
    

---

# 🔄 2) for-select Loop

**الگو:** حلقه‌ی بی‌نهایت با `select` برای multiplex روی چند کانال + cancel.

**نکات مهم:**

- برای timeouts از `time.NewTimer`/`time.Ticker` استفاده کنید (نه `time.After` در حلقهٔ تنگ) تا leak تایمر ندهید.
    
- `default` در `select` یعنی non-blocking؛ با احتیاط استفاده کنید که busy-loop نسازید.
    

**مثال با heartbeat و idle-timeout درست:**

```go
func serve(ctx context.Context, in <-chan string, out chan<- string) error {
    defer close(out)

    heartbeat := time.NewTicker(5 * time.Second)
    defer heartbeat.Stop()

    idle := time.NewTimer(30 * time.Second)
    defer idle.Stop()

    resetIdle := func() {
        if !idle.Stop() {
            select { case <-idle.C: default: }
        }
        idle.Reset(30 * time.Second)
    }

    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        case <-heartbeat.C:
            select { case out <- "ping": case <-ctx.Done(): return ctx.Err() }
        case <-idle.C:
            return errors.New("idle timeout")
        case msg, ok := <-in:
            if !ok { return nil }
            resetIdle()
            // پردازش msg
            select { case out <- strings.ToUpper(msg): case <-ctx.Done(): return ctx.Err() }
        }
    }
}
```

---

# 🛑 3) Preventing Goroutine Leaks

**مشکلات رایج:**

- ا`range` روی کانالی که هرگز بسته نمی‌شود.
    
- اgoroutine منتظر روی send به کانال بدون مصرف‌کننده.
    
- استفاده از `time.After` در loop → ساختن تایمرهای رهاشده.
    

**راهکارها:**

- همیشه `ctx.Done()` را در `select` بگذار.
    
- close مسیرهای خروجی را مدیریت کن.
    
- در تست‌ها از `go.uber.org/goleak` استفاده کن.
    
- برای fan-out/fan-in حتماً done/cancel داشته باش.
    

**الگوی پایهٔ anti-leak برای مصرف‌کننده:**

```go
func consume(ctx context.Context, in <-chan Item) {
    for {
        select {
        case <-ctx.Done():
            return
        case it, ok := <-in:
            if !ok { return }
            _ = process(it)
        }
    }
}
```

---

# ⚡ 4) or-channel

**مسئله:** چند سیگنال cancel/done داریم؛ می‌خواهیم اولین‌شان همه‌چیز را متوقف کند.

**پیاده‌سازی ساده و امن (N goroutine + sync.Once):**

```go
func Or(chs ...<-chan struct{}) <-chan struct{} {
    switch len(chs) {
    case 0:
        c := make(chan struct{})
        close(c)
        return c
    case 1:
        return chs[0]
    }
    out := make(chan struct{})
    var once sync.Once

    signal := func(ch <-chan struct{}) {
        select {
        case <-ch:
            once.Do(func() { close(out) })
        case <-out:
        }
    }

    for _, ch := range chs {
        go signal(ch)
    }
    return out
}
```

**نکته:** برای request-scoped کارها، معمولاً به جای or-channel از یک `context` مشترک با `errgroup` استفاده می‌کنیم تا cancel آبشاری شود (تمیزتر).

---

# 🚨 5) اError Handling در کانکارنسی

**الگوهای رایج:**

- ا`errgroup.Group` از `golang.org/x/sync/errgroup` → cancel اتوماتیک با اولین خطا.
    
- کانال error با بافر 1 تا block نشود.
    
- جمع‌کردن چند خطا با `go.uber.org/multierr` (وقتی همهٔ کارها را می‌خواهی تمام کنی و بعد گزارش بدهی).
    

**مثال با errgroup + context:**

```go
import (
    "golang.org/x/sync/errgroup"
)

func crawlAll(ctx context.Context, urls []string) error {
    g, ctx := errgroup.WithContext(ctx)
    sem := make(chan struct{}, 8) // محدودیت همزمانی

    for _, u := range urls {
        u := u
        g.Go(func() error {
            select { case sem <- struct{}{}: case <-ctx.Done(): return ctx.Err() }
            defer func() { <-sem }()
            body, err := fetch(ctx, u)
            if err != nil { return err }
            return store(ctx, u, body)
        })
    }
    return g.Wait()
}
```

---

# 📦 6) Pipelines

**ایده:** داده از چند مرحله می‌گذرد؛ هر مرحله goroutine خودش را دارد و از channel برای انتقال استفاده می‌کند.

**نکات کلیدی:**

- هر stage باید خروجی‌اش را ببندد وقتی input تمام شد.
    
- باید cancel را propagate کنی (با `ctx` یا `done`).
    
- backpressure خودبه‌خود با channel کنترل می‌شود.
    

**مثال:** read → parse → validate → write

```go
func gen(ctx context.Context, ns ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range ns {
            select { case out <- n: case <-ctx.Done(): return }
        }
    }()
    return out
}

func sq(ctx context.Context, in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            n := n
            select { case out <- n * n: case <-ctx.Done(): return }
        }
    }()
    return out
}

func pipeline(ctx context.Context) []int {
    var res []int
    for v := range sq(ctx, sq(ctx, gen(ctx, 1,2,3,4))) {
        res = append(res, v)
    }
    return res
}
```

**Production tips:**

- برای stages سنگین، fan-out کن (چند نسخهٔ موازی همان stage).
    
- از metrics برای هر stage (QPS، latency، عمق صف) استفاده کن.
    

---

# 🌪 7) Fan-Out, Fan-In (Worker Pool)

**Fan-Out:** تقسیم کار بین چند worker.  
**Fan-In:** ادغام خروجی چند worker به یک خروجی.

**الگوی Worker Pool با محدودیت همزمانی و cancel:**

```go
type Job struct{ ID int }

type Result struct{ ID int; Err error }

func worker(ctx context.Context, id int, jobs <-chan Job, results chan<- Result) {
    for {
        select {
        case <-ctx.Done():
            return
        case j, ok := <-jobs:
            if !ok { return }
            // simulate work
            err := doJob(ctx, j)
            select {
            case results <- Result{ID: j.ID, Err: err}:
            case <-ctx.Done():
                return
            }
        }
    }
}

func runPool(ctx context.Context, n int, jobsList []Job) []Result {
    jobs := make(chan Job)
    results := make(chan Result)

    var wg sync.WaitGroup
    wg.Add(n)
    for i := 0; i < n; i++ {
        i := i
        go func() { defer wg.Done(); worker(ctx, i, jobs, results) }()
    }

    go func() {
        defer close(jobs)
        for _, j := range jobsList {
            select { case jobs <- j: case <-ctx.Done(): return }
        }
    }()

    go func() { wg.Wait(); close(results) }()

    var out []Result
    for r := range results { out = append(out, r) }
    return out
}
```

**نکات:**

- ترتیب نتایج اگر مهم است، یک index نگه‌دار یا از ساختارهایی مثل `[]*Result` + sort استفاده کن.
    
- برای «دقیقاً یکبار» یا «حداقل یکبار» تحویل، semantics را روشن کن و idempotency سمت مصرف‌کننده داشته باش.
    

---

# 🚪 8) or-done-channel

وقتی از یک channel می‌خوانی ولی می‌خواهی هر لحظه بتوانی cancel کنی تا گیر نکنی.

```go
func OrDone[T any](done <-chan struct{}, in <-chan T) <-chan T {
    out := make(chan T)
    go func() {
        defer close(out)
        for {
            select {
            case <-done:
                return
            case v, ok := <-in:
                if !ok { return }
                select {
                case out <- v:
                case <-done:
                    return
                }
            }
        }
    }()
    return out
}
```

**کاربرد:** در bridge/tee و هرجایی که خواندن بلاک‌کننده است.

---

# 🔀 9) tee-channel (کپی جریان به دو خروجی)

**مسئله:** هر ورودی باید به دو مصرف‌کننده مستقل برود.

```go
func Tee[T any](done <-chan struct{}, in <-chan T) (<-chan T, <-chan T) {
    out1 := make(chan T)
    out2 := make(chan T)

    go func() {
        defer close(out1); defer close(out2)
        for v := range OrDone(done, in) {
            var o1, o2 = out1, out2
            var v1, v2 = v, v
            for i := 0; i < 2; i++ {
                select {
                case o1 <- v1:
                    o1 = nil // جلوگیری از ارسال دوباره
                case o2 <- v2:
                    o2 = nil
                case <-done:
                    return
                }
            }
        }
    }()
    return out1, out2
}
```

**نکات:** اگر یکی از خروجی‌ها کند باشد، backpressure ایجاد می‌شود. اگر نمی‌خواهی، باید بافر و سیاست drop تعریف کنی.

---

# 🌉 10) bridge-channel (flatten کردن channel-of-channels)

**مسئله:** یک channel داری که خودش channel تولید می‌کند (streamهای متعدد). می‌خواهی یک خروجی یکپارچه داشته باشی.

```go
func Bridge[T any](done <-chan struct{}, chanStream <-chan (<-chan T)) <-chan T {
    out := make(chan T)
    go func() {
        defer close(out)
        for ch := range OrDone(done, chanStream) {
            for v := range OrDone(done, ch) {
                select {
                case out <- v:
                case <-done:
                    return
                }
            }
        }
    }()
    return out
}
```

**نکات:**

- اگر یک زیرجریان hang کند، `OrDone` جلوی leak را می‌گیرد.
    
- می‌توان برای هر زیرجریان deadline جداگانه گذاشت.
    

---

# 📥 11) Queuing 

**گزینه‌ها:**

- کانال بافر‌دار به عنوان صف bounded.
    
- اRing buffer برای کارایی بیشتر و حذف realloc (مثلاً `container/ring` یا پیاده‌سازی شخصی).
    
- اPriority Queue با `container/heap`.
    

**الگوی bounded queue با سیاست drop-new:**

```go
type Task struct{ ID int }

type Queue struct{
    ch chan Task
}

func NewQueue(n int) *Queue { return &Queue{ch: make(chan Task, n)} }

// اگر صف پر باشد، تسکِ جدید drop می‌شود
func (q *Queue) EnqueueNonBlocking(t Task) bool {
    select {
    case q.ch <- t:
        return true
    default:
        return false
    }
}

func (q *Queue) Dequeue(ctx context.Context) (Task, bool) {
    select {
    case t, ok := <-q.ch:
        return t, ok
    case <-ctx.Done():
        return Task{}, false
    }
}
```

**سیاست‌ها:** drop-tail، drop-head، sampling، یا blocking با timeout. انتخاب سیاست به SLA/UX بستگی دارد.

**نکات پروڈاکشن:**

- metric طول صف + نرخ drop.
    
- alert وقتی عمق صف طولانی شد.
    

---

# 🧰 12) پکیج `context`

**اصول طلایی:**

- ا`ctx` اولین آرگومان تابع.
    
-ا `context` را در struct نگه ندار؛ عبور بده.
    
- ا`context.Background()` فقط در لایه‌ی بوت/ریشه.
    
- اnil نده؛ اگر نداری `context.TODO()` بده.
    
- برای timeout از `WithTimeout`/`WithDeadline` استفاده کن؛ برای manual cancel از `WithCancel`.
    
- از `WithValue` فقط برای داده‌های request-scoped سبک (trace-id و ...) با کلید type-safe.
    
- از Go 1.20 به بعد: `context.WithCancelCause` و `context.Cause(ctx)` برای علت cancel.
    

**مثال cancel آبشاری با errgroup:**

```go
func doAll(ctx context.Context) error {
    g, ctx := errgroup.WithContext(ctx)

    g.Go(func() error { return taskA(ctx) })
    g.Go(func() error { return taskB(ctx) })

    // اگر یکی fail شود، ctx برای بقیه cancel می‌شود
    return g.Wait()
}
```

**pattern فراگیر در حلقه‌ها:**

```go
for {
    select {
    case <-ctx.Done():
        return ctx.Err()
    case msg := <-ch:
        _ = handle(ctx, msg)
    }
}
```

---

## نکات تکمیلی و Best Practices

- **Metrics و Tracing:** کانکارنسی بدون observability دردسرساز است. برای هر stage/worker، latency/QPS/queue-depth داشته باش (Prometheus + OpenTelemetry).
    
- **Limits:** همیشه یک گلوگاه کنترل‌شده داشته باش (semaphore/buffer) تا از overload جلوگیری شود.
    
- **Testability:** با `context.WithTimeout` تست‌ها را fail-fast کن؛ از `goleak.VerifyNone` بعد از تست‌ها استفاده کن.
    
- **T

## 5. Concurrency at Scale

## 6. Goroutines and the Go runtime
