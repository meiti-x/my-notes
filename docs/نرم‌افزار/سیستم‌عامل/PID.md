---
tags:
  - os
---



تو لینوکس هر پردازه یه id منحصر بفرد میگیره که برای مدیرتیش در آینده به درد میخوره

ولی هر pid میتونه یه ppid هم داشته باشه. یعنی این پراسس پرنتش کیه؟ تا وقتی که پرنت کیل شد بچه هاش هم کشته شن

## PID namespace

این از مفاهیم پایه لینوکسی هستش که داکر هم برای isolation ازش استفاده میکنه. توی مثال داکر همه sub-process ها ppid به یه پرنت دارن. شاید بگید پس namespace با ppid چه فرقی دار؟ فرقشون توی isolation هستش توی حالت namespace تو به process های بیرون از namespace ات دسترسی نداری. مگر اینکه خودمون توی داکر به صورت اکسپلیست دسترسی داده باشیم

## PID init

توی سیستم های لینوکسی اولین پراسسی که بعد بوت شدن اجرا میشه init هستش که pid یک هم داره و تمام پراسس های که بعدش اجرا میشن پرنتشون میشه این که برای gracefully هندل کردن سیگنال کیل هستش
