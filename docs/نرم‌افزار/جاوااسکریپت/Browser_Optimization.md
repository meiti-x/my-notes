---
title: Browser Optimization
tags:
  - js
---

اصلا چرا بحث پرفرومنس در فرانت مهمه. یه جمله ای هست کخ میگه توسعه دهنده ها گرون تر از سروران پس بیایم یه زبانی بهشون بدیم که سریع بزنن و منابع رو زیاد کنم ولی این کار رو نمیشه در فرانت کرد نمیشه به همه یه دیوایس خفن داد.

توی بحث پرفرومنس باید اول بفهمیم js چجوری در بخش های مختلف کار میکنه <mark>Parsing and Garbage Collection</mark>


## reflow
در ابتدا ما یه درخت از عناصر داریم به اسم *DOM* همچنین یه درخت برای استایل هامون که میشه *CSSOM* که با مرج شدن اینا ما یه درخت داریم به اسم Render Tree حالا مرحله *reflow* در مرورگر موقعیت مکانی و ابعاد دقیق هر المان رو توی صفحه محاسبه می‌کنه. یعنی مثلاً:

- عنصر A باید در مختصات (x: 50px, y: 200px) قرار بگیره
- عرض عنصر B باید 300px باشه چون 50٪ از والدشه
![[reflow.png]]

هر وقت تغییری توی ساختار صفحه بیفته که روی اندازه یا موقعیت المان‌ها تأثیر بذاره، مرورگر باید **Reflow** انجام بده. یعنی میشه گفت pipeline ش اینجوریه:
javascript->style-> layout -> paint -> composite

## repaint
اگه یه تغییری(که تغییر بهینه هم هست) فقط فاز repaint رو اجرا کنه یعنی فقط paint و composite بهینه است
از طرفی reflow روی ترد اصلی اجرا میشه و بلاکر ولی repaint روی ترد جدای که برای compositor هستش اجرا میشه و اینکه repaint توسط gpu انحام میشه ولی ری فلو توسط سی پی یو


آیا reflow سنگینه؟ آره. چون ممکنه برای یک تغییر، کل درخت یا بخش بزرگی از درخت دوباره محاسبه بشه. Reflow‌های زیاد باعث **کند شدن UI** می‌شن، به‌خصوص توی دستگاه‌های ضعیف.

حالا چطور میتونیم بهینه اش کنیم ؟
- از `transform` و `opacity` استفاده کنی چون اون‌ها فقط Paint/Composite لازم دارن نه Reflow
- تغییرات رو دام اصلی رو به صورت batch انجام بده


این سایته نشون میده هر دستور چه تغییری ایجاد میکه
https://css-triggers.com/

در کنار اینا باید اصول [[RAIL]] رو هم در نظر بگیریم که اپمون نرم تر اجرا شه


## compositor
اول اینکه، به جای اینکه هر بار کل تابلو رو از اول بکشه، تابلو رو به قسمت‌های جداگانه تقسیم می‌کنه (مثلاً آسمون، درخت، کوه). هر قسمت رو روی یه کاغذ جداگانه می‌کشه. این کاغذها همون **لایه‌ها** هستن.

**۱. Reflow (Layout) - تغییر چیدمان:**  
مثل وقتی که نقاش مجبور میشه کل طرح رو از اول بکشه چون مثلاً یه درخت رو وسط تابلو اضافه کرده. این کار خیلی وقت میبره!

**۲. Repaint - رنگ‌آمیزی مجدد:**  
مثل وقتی که نقاش فقط رنگ آسمون رو عوض میکنه. کل طرح رو نمیکشه، فقط یه بخش رو دوباره رنگ میزنه.

**۳. Compositing - وصله‌کاری:**  
حالا تصور کن نقاش از قبل آسمون، درختا و بقیه قسمتها رو روی برگه‌های جداگانه کشیده. اگه بخواد رنگ آسمون رو عوض کنه، فقط همون برگه آسمون رو عوض میکنه و بعد همه برگه‌ها رو دوباره کنار هم میذاره. اینطوری خیلی سریعتره!

**مثال واقعی:**  
وقتی تو یه صفحه وب اسکرول می‌کنی، اگه از Compositor استفاده بشه، مرورگر مثل اینه که یه عکس از صفحه گرفته و همون عکس رو بالا پایین می‌کنه - خیلی راحت و نرم. ولی اگه از Compositor استفاده نشه، هر بار باید کل صفحه رو از اول نقاشی کنه

**چرا اینطوری بهتره؟**

- چون نقاش اصلی (CPU) کمتر خسته می‌شه
    
- دستیار (GPU) خیلی سریع‌تر می‌تونه کاغذها رو جابجا کنه
    
- حتی اگه نقاش اصلی یه کار سنگین انجام بده، بیننده متوجه نمی‌شه و صفحه همچنان نرم به نظر می‌رسه

[[layout thrashing]]

