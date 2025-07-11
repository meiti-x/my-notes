---
title: IPC
tags:
  - os
  - system_design
---
ا**Inter Process Communication) IPC)** به روش‌هایی میگن  که Processها در یک سیستم عامل می‌توانند با هم ارتباط برقرار کنند و داده‌ها را بین خودشان به اشتراک بگذارند. از آنجا که پردازه‌ها معمولاً فضای حافظه مستقل دارند، سیستم‌عامل مکانیسم‌های مختلفی برای ارتباط بین آن‌ها فراهم کرده است.

### **انواع روش‌های IPC**:

۱. **Pipe**

- یک کانال یک‌طرفه برای ارتباط بین پردازه‌هاست.
- معمولاً بین پردازه‌های والد و فرزند استفاده می‌شود.
- مثال در لینوکس: `|` در خط فرمان (مثل `ls | grep "file"`).

۲. **Named Pipe (FIFO)** 
#todo

- مشابه Pipe است، اما یک فایل خاص در سیستم فایل دارد و پردازه‌های نامرتبط هم می‌توانند از آن استفاده کنند.

۳. **Message Queues (صف‌های پیام)**

- پیام‌ها در یک صف ذخیره می‌شوند و پردازه‌ها می‌توانند آن‌ها را بخوانند یا بنویسند.([[Rabbitmq]])
- برخلاف Pipe، دوطرفه است و می‌تواند بین چندین پردازه مشترک باشد.


۴. **Shared Memory (حافظه مشترک)**

- یک بخش از حافظه RAM بین چند پردازه به اشتراک گذاشته می‌شود.
- سریع‌ترین روش IPC، چون نیاز به کپی کردن داده ندارد.    
- نیاز به هماهنگی (مثلاً با Semaphore) دارد تا از تداخل جلوگیری شود.

۵. **Semaphore (سیگنال)**
#todo
- یک متغیر هماهنگ‌کننده برای کنترل دسترسی به منابع مشترک بین پردازه‌ها.
- مثلاً برای جلوگیری از Race Condition در دسترسی به حافظه مشترک.


۶. **Signal (سیگنال)**

- یک روش برای ارسال اعلان‌های ساده به پردازه‌ها (مثل `kill -9` در لینوکس).
- برای ارتباط ساده و غیرهمزمان استفاده می‌شود.    

۷. **Socket (سوکت)**

- برای ارتباط بین پردازه‌ها حتی روی ماشین‌های مختلف (شبکه).
- هم در اینترنت و هم در یک سیستم محلی کاربرد دارد.