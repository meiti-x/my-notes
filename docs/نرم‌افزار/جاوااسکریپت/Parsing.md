---
tags:
  - js
---

پارس تایم مدت زمانی هست که موتور جاوااسکریپت (مثل V8 در کروم) طول میکشه تا کد شما رو بخونه، تحلیل کنه و آماده اجرا کنه. این فرآیند سه مرحله اصلی داره:
1. **تجزیه کد** به توکن‌های معنادار
2. **ساخت درخت نحو (AST)** از کد
3. **کامپایل به بایت‌کد** یا کد ماشین

هرچه کد شما حجیم‌تر و پیچیده‌تر باشه، این مرحله زمان بیشتری می‌گیره. برای بهینه‌سازی می‌تونید:

- کد رو به بخش‌های کوچکتر تقسیم کنید (مثلاً با import داینامیک)
- کد رو فشرده (minify) کنید تا حجمش کم بشه

پارس به صورت در لحظه و lazy انحام میشه لیزی برای اونایی که موتور حدس میزنه بعدا لازم میشه و مثلا ما خودمون میتونیم این کار رو بکنیم



- **توابع کم‌استفاده را به صورت arrow function بنویسید:**
~~~javascript
// Lazy Parsed 
const calculate = (a, b) => a + b;
    
// Eager Parsed 
function init() {  }