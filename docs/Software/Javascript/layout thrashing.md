وقتی در جاوااسکریپت **مدام اندازه یا موقعیت المان‌های صفحه رو میخونی و بلافاصله تغییر میدی**، مرورگر مجبور میشه **بارها و بارها** محاسبات مربوط به چیدمان (Layout) رو انجام بده. به این پدیده **Layout Thrashing** میگن که باعث **کند شدن شدید صفحه** میشه.

---

## **چطوری اتفاق می‌افته؟ (مثال)**

فرض کن این کد رو اجرا کنی:


~~~javascript

const element = document.getElementById('box');
const width = element.offsetWidth; 
element.style.width = width + 10 + 'px'; 
const newWidth = element.offsetWidth;
~~~

![[layout-thrashing.png]]

 الان توی این عکس recalculate ها قسمت های  محاسبه مجدد ما هستن