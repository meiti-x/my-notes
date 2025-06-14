---
title: Docker In Action
keywords:
  - book
  - document
  - docker in action
description: برداشت های من از کتاب داکر در عمل
---

<img src="https://m.media-amazon.com/images/I/71VgrJPXWiL._SL1500_.jpg"  height="400"/>

**نام کتاب**: داکر در عمل

**ویرایش:** دوم

**سال چاپ**:۱۳۹۶

**سال خوندن من**: ۱۴۰۴ بهار

---

## مقدمه

این قسمت بیشتر در مورد فلسفه داکر و چرایی اش هست و اینکه چرا داکر باعث _serviceability_ _longevity_ در برنامه هامون میشه

### داکر چیه؟

داکر یک ابزار لجستیکی که برای بسته بندی و حمل و نقل کانتینر ها هستش و همه این هارو به کمک مفهموی به اسم _containers_ که در سیستم عامل ها هست انجام میده. داکر ابزار جدیدی اختراع نکرده و و همه چیزهای که که در کنار هم قرار داده وجود داشته صرفا پیچیدگی پیاده سازی کانتینر ها یا jail هارو از دید ما پنهون کرده که باعث شده ایزوله سازی برای ما کار راحتی باشه مثل اکتشاف کانتینر برای اولین بار. داکر از این مفاهیم برای ایزوله کردن استفاده میکنه:

<span dir="ltr">

- **UTS** _namespace_ -> host and domain name
- **MNT** _namespace_ -> filesystem access and structure
- **IPC** _namespace_ -> process communication over shared memory
- **NET** _namespace_ -> network access and structure
- **USR** _namespace_ -> usernames and identifier
- **chroot syscall** -> control the location of filesystem root
- **cgroup** -> resource protection
- **CAP drop** -> OS feature restriction
- **security modules**

</span>

بخاطر همین موارد داکر توی ویندوز فقط با VM یا WSL اجرا میشه

#### کانتینر چیه؟

به صورت تاریخی اگه بخوایم بگیم سیستم عامل های `UNIX-style` مثل لینوکس از عبارتی مثل _jail_ برای این موضوع استفاده میکردن. این باعث میشد که یه ران تایم داشته باشیم که محدوده دسترسی یک برنامه ای که jail شده مدیریت کنیم.

**آیا کانتینر همون مفهوم VM یا Virtualization هستش؟** جواب کوتاه نه

جواب بلند: برخلاف VM ها داکر از هیچ منابع virtual سخت افزاری استفاده نمیکنه. برنامه های که داخل کانتینر هاست شدن مستقیما با کرنل در ارتباط هستن (با واسطه سیستم عامل) خیلی از برنامه های در isolation اجرا میشن بدون اینکه نیاز باشه مثل VM ها سیستم عامل کاملا بوت بشن.

با توجه به پیشرفت سخت افزار VM ها هم گزینه سریعی هستن. ولی فقط وقتی که `OS` کاملا بوت شود ولی این delay رو در داکر نداریم و از طرفی VM یک برنامه <mark> user space هستش ولی داکر kernel space هستش </mark> که باعث میشه `syscall` هامون سریعتر بشه و درنهایت از منابع بهینه استفاده میشه

**تفاوت image با کانتینر چیه؟** به کامپوننتی که یه کانیتنر رو پر میکنه میگن image. داکر کانتینر هارو با image ها میسازن

- یک Docker image مثل یک کانتینر فیزیکی حمل بار هست که اپلیکیشن و وابستگی‌هاش رو (به‌جز هسته سیستم‌عامل) با خودش حمل می‌کنه.

- **Image:** الگوی فقط-خواندنی که شامل تمام وابستگی‌ها و تنظیمات لازم برای اجرای برنامه است
- **کانتینر:** نمونه‌ی درحال اجرا از یک Image که لایه نوشتنی نیز به آن اضافه شده است

### چه مشکلاتی رو داکر حل میکنه؟

#### انسجام

داکر مثل یک پرتال میمونه :) بعد از پایانش چیزی روی ذخیره نمیکن مگر ما بهش گفته بشیم که ذخیره کنه که این باعث میشه انسجام در سیستم خودمون داشته باشیم

#### پرتابیلیتی

- اجرای یکسان روی هر سیستمی که داکر داشته باشه
- استقرار در محیط‌های مختلف بدون تغییرات

#### امنیت

مثل زندان های معمولی(‍`jail`) هر چیزی که داخل کانتینر هستش فقط به چیزهای دسترسی داخلش وجود داره. مگر اینکه یه مجوزی به صورت explicit از سمت یوزر داده بشه. کانتینر ها محمدوده تاثیر روی برنامه های دیگه رو محدود میکنن، دیتای که میتونن دسترسی داشته باشن، شبکه ای که میتونن باشن، و ریسورس های که میتونن داشته باشن

### چرا داکر مهمه

داکر یک _انتزاع_ ایجاد میکنه. انتزاعی که به شما کمک میکنه روی مسايل سخت تر کار کنید. یعنی به جای اینکه فکرمون رو معطوف به چگونگی نصب و استقرار برنامه مون کنیم به نوشتن خوده برنامه فکر کنیم

---

## بخش اول: Process Isolation And Enviroment Independet Computing

داکر از یک چیزی به اسم <mark>PID namespace </mark> برای ایزوله کردن پراسس های داخل کانتیر استفاده کرده(برای جزئییات داک PID رو پیدا کن)

کانتینر های داکر توی ۶ تا وضعیت هستن `Created, Running, Restarting, Paused, Removing and Exited`
به صورت پیشفرض داکر توی کامند `docker ps` فقط کانتینر های در حال اجر رو نشون میده

> داکر جلوی Circular Depdencies رو میگیره

#### داکر image layers

وقتی توی Dockerfile مثلاً از دستوراتی مثل `RUN`, `COPY`, `ADD` استفاده می‌کنی، Docker برای هر کدوم یه لایه جدید می‌سازه. به این لایه های میگن image layers(برای جزییات دنبال Union File system بگرد)

##### ساخت و تغییرات🏗️

- وقتی از یک Dockerfile استفاده می‌کنی، هر دستور مثل `RUN` یا `COPY` باعث ساختن یک لایه جدید می‌شه.
- همچنین می‌تونی داخل یک container تغییر بدی و بعد با `‍docker container commit‍‍` اون تغییرات رو به شکل یک لایه جدید ذخیره کنی.
- وقتی داخل یک container فایلی رو تغییر بدی یا حذف کنی، اون تغییر توی **بالا‌ترین** لایه ثبت می‌شه. Docker از چیزی به‌اسم _union filesystem_ استفاده می‌کنه تا این لایه‌ها رو ترکیب کنه.
- اگر فایلی تغییر کنه، معمولاً نسخه‌ی جدیدش کپی می‌شه توی لایه بالا و تغییر روی اون اعمال می‌شه (این رو می‌گن _copy-on-write_). این می‌تونه روی performance و حجم imag تأثیر بذاره.
- اگه تغییری در لایه ای اتفاق بیافته لایه های بعدی هم از کش استفاده نمیکنن و دوباره حساب میکنن
- هر دستور در Dockerfile (مثل COPY, RUN, ADD, …) به همراه داده‌هایی که روی اون اثر می‌ذاره، تبدیل به یک **هش** (hash) می‌شه. و این یه جا ذخیره میشه داکر از روی این میفهمه که یه لایه تغییر کرده یا نه

داخل کانتینر ها ساختار ایزوله ای دقیقا مشابه با ساختار سیستم های unixی ساخته میشه و این به کمک **mnt namespace** برای ایجاد ایزولیشن هستش

#### Storage and Volume

هر داکر فایل در زمان اجرا یک writeable layer داره که روی همه لایه ها هست برای نوشتن تغییرات داخل یه کانتینر و وقتی کانتینر ها به دلیلی خارج میشن، هر چی که در اینجا نوشته شده دور ریخته میشه به همین دلیل هستش که ما برای دیتا های که طولانی مدت لازم داریم به volume احتیاج داریم

Union filesystem که داکر ازش استفاده می‌کنه برای اجرای موقت برنامه‌ها خوبه، چون از چند لایه ساخته شده و تغییرات فقط روی لایه بالایی نوشته می‌شن. اما برای نگه‌داری داده‌های بلندمدت یا اشتراک‌گذاری داده بین کانتینرها و سیستم میزبان مناسب نیست، چون این تغییرات ناپایدارن و با پاک شدن کانتینر از بین می‌رن.

در مقابل، لینوکس با استفاده از mount point به ما اجازه می‌ده مسیرهایی در فایل‌سیستم رو به دیسک‌های واقعی یا مجازی متصل کنیم. این ساختار باعث می‌شه داده‌ها مستقل از کانتینر باقی بمونن و بتونیم اون‌ها رو بین کانتینرها یا با میزبان به اشتراک بذاریم.

پس برای کار با داده‌های مهم و دائمی، باید از mount point (مثل volumeها در داکر) استفاده کنیم، نه صرفاً union filesystem.

فرض کن یه فلش USB داری که می‌خوای توی لینوکس بهش دسترسی داشته باشی.

🔹 بدون اینکه بدونی از کدوم دیسک استفاده می‌کنی:

وقتی فلش رو به سیستم وصل می‌کنی، لینوکس اون رو به یه مسیر مثل /media/mahdi/usb-drive mount می‌کنه.

از اون لحظه به بعد، تو فقط با اون مسیر کار می‌کنی، مثلا:

```bash
cd /media/mahdi/usb-drive
```

🧩 ارتباطش با کانتینر:

همین مفهوم توی کانتینر هم هست. مثلاً اگه بخوای یه دایرکتوری از سیستم میزبان رو داخل کانتینر ببری، انگار اون USB رو mount کردی تو کانتینر. از دید برنامه داخل کانتینر، انگار اون مسیر بخشی از فایل‌سیستمشه، ولی در واقع داره از یه جای دیگه میاد.

#### Networking

وقتی کانتینرها روی یک ماشین (هاست) اجرا میشن، باید بتونن با هم و با خارج هاست ارتباط برقرار کنن. داکر برای این ارتباط، یک لایه انتزاعی شبکه می‌سازه که به کانتینرها امکان می‌ده بدون وابستگی مستقیم به شبکه میزبان، به صورت ایزوله ولی قابل دسترسی کار کنن.

**انواع شبکه‌های در داکر:**

- **Bridge** (پیش‌فرض):
  کانتینرها آدرس _IP_ خصوصی منحصر به فرد می‌گیرن و می‌تونن با هم روی همین شبکه داخلی صحبت کنن. داکر با _NAT_ ترافیک خروجی رو به بیرون منتقل می‌کنه.
- **Host**:
  کانتینر شبکه میزبان رو مستقیماً استفاده می‌کنه، یعنی مثل یه برنامه عادی روی سیستم اجرا می‌شه و تمام شبکه میزبان رو داره. این حالت ایزوله نیست و کمتر توصیه می‌شه.
- **None**:
  کانتینر هیچ شبکه‌ای نداره، فقط loopback داخلی داره. برای برنامه‌هایی که به شبکه نیازی ندارن مناسب است.

نقش **پورت‌ها**: برای دسترسی به برنامه‌های داخل کانتینر از خارج، باید پورت‌های کانتینر به پورت‌های میزبان متصل (publish) بشن. مثلاً -p 8080:80 یعنی پورت ۸۰ کانتینر روی پورت ۸۰۸۰ میزبان قرار می‌گیره.

وقتی یک کانتینر ایجاد می‌کنی، داکر براش یک **network namespace** جداگانه می‌سازه. این یعنی کانتینر:

- کارت شبکه خودش رو داره (مثل eth0)
- جدول routing خودش رو داره
- آدرس‌های IP خودش رو داره
  بنابراین از دید سیستم‌عامل، کانتینر یه سیستم مستقل با شبکه مجزاست.
