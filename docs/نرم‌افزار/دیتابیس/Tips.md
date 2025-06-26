---
tags:
  - system_design
---

1. استفاده از offset برای pagintaion باعث میشه همه موارد قبلش رو بگیره و موارد لازم رو بده و بقیه رو دراپ کنه. خیلی بهتره که برای ایدی از فیلدهای ترتیبی استفاده کنیم مثل [[Twitter Snowflake]] تا uuid تا بتونیم همچین کوئری بزنیم:
~~~sql
select title from news where id < 13032458 order by id desc limit 10;

