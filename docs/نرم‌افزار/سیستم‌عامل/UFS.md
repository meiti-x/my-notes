---
title: Union File System
tags:
  - os
  - docker
description: توضیح نحوه کارکرد فایل سیستم لایه ای لینوکس
---

![UFS](/img/ufs2.png)

ا**Union File System** (یا UnionFS) یه تکنیک توی فایل‌سیستم‌هاست که بهت اجازه می‌ده **چند تا فایل‌سیستم جدا رو به شکل یه فایل‌سیستم یکپارچه ببینی و استفاده کنی.**

به جای اینکه همه‌چیزو تو یه جا بریزه، میاد چند تا «لایه» (layer) می‌سازه که هرکدوم فقط تغییرات مربوط به خودشونو دارن، و این لایه‌ها رو با هم «ترکیب» می‌کنه تا انگار یه ساختار منسجم داری.

:::tip

مثل همیشه داکر در دنیای لینوکس چیز جدید اختراع نکرده ما قبلا هم ufs رو داشتیم

مثلا اوبونتوهای Live:

- فایل‌سیستم اصلی به‌صورت read-only توی CD یا ISO هست
- یه لایه‌ی writable (tmpfs یا ramfs) روش سوار می‌شه
- کاربر انگار داره روی یه سیستم کامل کار می‌کنه
- ولی هیچ فایلی واقعاً توی دیسک نوشته نمی‌شه (چون CD یا ISO فقط خوندنیه)

📌 این دقیقاً همون فلسفه‌ی **UFSه**: base image read-only + یه لایه‌ی قابل نوشتن موقتی.

:::

:::note

tmpfs یه فایل‌سیستم موقتیه که فایل‌هاش رو تو رم ذخیره می‌کنه، یعنی خیلی سریع، ولی همه چیز با خاموش کردن سیستم پاک می‌شه.

مثال ملموسش همون مسیر /tmp هست که معمولا روی tmpfs قرار داره و واسه فایل‌های موقتی استفاده می‌شه.

برای دیتاهای با persistance هم میتونیم از bind mounts یا volume استفاده کنیم

:::

---

## چرا UFS اختراع شد؟

فرض کن یه عکس از یه منظره داری (ایمیج پایه). حالا می‌خوای روش یه عینک بکشی. نمیای رو خود عکس بکشی، یه کاغذ شفاف می‌ذاری روش (لایه جدید) و فقط عینک رو اونجا می‌کشی. عکس اصلی سالم می‌مونه. اگه از نقاشیت خوشت نیومد، کاغذ شفاف رو میکنی و از اول شروع می‌کنی. این دقیقا همون کاریه که داکر با فایل‌سیستمش می‌کنه.

علت اینکه این اسم براش انتخاب شده میاد چندتا فایل سیستم رو بهم وصل میکنه و یه فایل سیستم واحد میسازه. یعنی چندتا پوشه یا دایرکتوری که ممکنه تو جاهای مختلف باشن رو می‌چسبونه کنار هم طوری که انگار یه دونه پوشه هستن. بیشتر از اینکه خودش سیستم فایل باشه، یه روش وصل کردن و نمایش فایل‌ها روی هم هست. بیشترین کاربردش توی داکر هستش. هر خط در Dockerfile یه لایه از فایل سیستم میسازه که این لایه readable فقط هستش. علت اصلی که این کارو میکنه برای کشینگ هستش. مثلا بتونه base image رو توی داکر فایل های مختلف کش کنه

حالا هر موقع ما یه داکر فایل رو ران میکنم یه writable layer روی همه ی لایه ها اضافه میکنه تا چیزهای که میخوایم بنویسیم مثلا لاگ یا تغییرات دیتابیسی توی این لایه نوشته میشه

✅ **کشینگ (caching)**  
✅ **استفاده مجدد از base image تو پروژه‌های مختلف**  
✅ **ساخت incremental و سریع‌تر**

---

## وقتی کانتینر اجرا می‌شه چی می‌شه؟

وقتی یه ایمیج رو با `docker run` اجرا می‌کنی:

- یه لایه‌ی جدید writable به صورت موقتی روی همه‌ی لایه‌های قبلی سوار می‌شه
- هر چیزی که توی کانتینر تغییر کنه (مثلاً لاگ‌ها، فایل‌هایی که برنامه می‌نویسه)، فقط توی همین لایه writable ذخیره می‌شه
- لایه‌های پایین‌تر read-only باقی می‌مونن
- به این سبک می‌گن **Copy-on-Write** — اگه یه فایل تغییر کنه، نسخه‌ی جدیدش فقط توی لایه writable ساخته می‌شه. مثلا

```javascript
// لایه اصلی
const baseLayer = {
  name: "Mahdi",
  age: 30,
  city: "Tehran",
};

// لایه نوشستی که اول خالیه
const writableLayer = {};

function read(key) {
  // اول می‌گردیم تو لایه نوشتنی
  if (key in writableLayer) {
    return writableLayer[key];
  }
  // اگه نبود، می‌ریم تو لایه بیس
  return baseLayer[key];
}

function write(key, value) {
  writableLayer[key] = value;
}

console.log(read("city")); // Tehran

write("city", "Mashhad");

console.log(read("city")); // Mashhad

console.log(baseLayer.city); // Tehran، هنوز تغییر نکرده
```

فرض کن داخل کانتینر میری و این کارو می‌کنی:

```
rm -rf node_modules
npm install lodash
```

خب الان چی شد؟

- ا`node_modules` که توی لایه فقط‌خواندنی بود، نمی‌تونه مستقیم حذف شه. پس داکر یه **علامت حذف (whiteout)** توی لایه writable می‌ذاره که بگه این دیگه وجود نداره.
- بعد `npm install lodash` اجرا می‌شه و `lodash` توی لایه writable نصب می‌شه.

**فقط این تغییرات (حذف + نصب جدید)** توی لایه writable ذخیره می‌شن. نه بقیه چیزا.

نکته جالب اینه که اگه lodash رو پاک کنی اون از روی writable layer پاک نمیشه صرفا یه لایه جدید دیگه اضافه میشه که داخلش علامت خورده به عنوان حذف شده. UFS یه جورایی مثل اینه که داری **از هر مرحله یه اسنپ‌شات (snapshot)** می‌گیری. ولی نکته مهم اینه که این اسنپ‌شات‌ها فقط اضافه می‌شن، کم نمی‌شن، مگه اینکه ایمیج رو دوباره بسازی. مثلاً اگه یه چیزی رو add کنی بعد پاکش کنی، **سایز کم نمی‌شه** چون اون فایل هنوز توی لایه‌های پایین‌تر هست، فقط از دید ما hide شده.

:::tip

وقتی داری یه ایمیج داکر می‌سازی، همه لایه‌ها در نهایت فقط‌خواندنی هستن و هیچ لایه نوشتنی دائمی وجود نداره. هر دستور توی Dockerfile مثل `COPY` یا `RUN` باعث می‌شه یه لایه جدید ساخته بشه که تغییراتش فقط‌خواندنی ذخیره می‌شه. ولی وقتی می‌رسیم به دستورهایی مثل `RUN npm install` که باید فایل بسازن یا تغییر بدن، داکر یه کانتینر موقتی با یه لایه نوشتنی ایجاد می‌کنه و اون دستور توی این محیط اجرا می‌شه. بعدش خروجی‌ش رو به یه لایه فقط‌خواندنی تبدیل می‌کنه و ذخیره می‌کنه. پس یعنی در زمان build همه چیز فقط‌خواندنیه، ولی داکر بهت اجازه می‌ده هر مرحله رو توی یه فضای writable موقت اجرا کنی.  
همچنین داکر برای اینکه مراحل ساخت سریع‌تر بشه، هش فایل‌ها رو چک می‌کنه و اگه چیزی تغییر نکرده باشه، لایه‌ها رو کش می‌کنه تا دوباره نسازه. این باعث می‌شه فقط وقتی لازم باشه، لایه دوباره ساخته بشه وگرنه سریعتر کار پیش بره.
:::

در انتها هر لایه تغییراتی روی لایه قبلیه؛ این باعث اشتراک فایل‌ها و صرفه‌جویی در فضا می‌شه ولی اگه لایه قبلی تغییر کنه تمام لایه های بعدی هم دوباره ساخته میشن

---

## 📦 مثال واقعی با Dockerfile

```yaml

# Base layer
FROM node:18

# لایه دوم - فایل‌ها رو کپی می‌کنیم
COPY . /app

# لایه سوم - npm install
RUN cd /app && npm install

# لایه چهارم - اجرای برنامه
CMD ["node", "/app/index.js"]

```

وقتی این ایمیج build بشه:

```javascript
Layer 1 → "node:18 image (سیستم پایه + Node.js)"
Layer 2 → "فایل‌های پروژه توی مسیر /app"
Layer 3 → "node_modules و خروجی npm install"
Layer 4 → "فقط یه دستور اجرا هست، توی لایه حساب می‌شه"
```

حالا وقتی با این ایمیج کانتینر اجرا می‌کنی:

```
docker run my-app-image
```

→ یه **لایه‌ی writable موقتی** هم روی همه‌ی این لایه‌ها سوار می‌شه.  
هر چیزی که توی `/app/logs` یا دیتابیس موقت ساخته شه، فقط اون بالا ذخیره می‌شه.

---

```yaml
FROM node:18
# اینجا اگه فقط کد ما یک حرف عوض بشه کل لایه های بعدی باید دوباره حساب بشه
COPY . /app

WORKDIR /app

RUN npm install

CMD ["node", "index.js"]
```

```yaml
FROM node:18

WORKDIR /app

# فقط فایل‌های لازم برای نصب پکیج‌ها رو اول کپی می‌کنیم
COPY package*.json ./

# اینجا زمانی پکیج ها نصب میشه که دوتا فایل قبلی عوض شده باشن
RUN npm install

# حالا بقیه فایل‌های پروژه رو کپی می‌کنیم
COPY . .

CMD ["node", "index.js"]
```

و اینکه فرق ufs و volume در اینه که والیوم اصلا وارد UFS نمی‌شه، چون خارج از ایمیجه و فقط mount میشه
