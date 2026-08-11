# Выложить сайт (просто, по шагам)

Сайт уже готов на компьютере. Нужны бесплатные аккаунты **GitHub** и **Vercel**.

---

## Экран Install (Vercel → GitHub)

Если видите **Install on your personal account** и выбор репозиториев:

1. Выберите **All repositories** (проще на старте).
2. Нажмите зелёную кнопку **Install** / **Install & Authorize** внизу.
3. Дождитесь возврата на Vercel.

*(«Only select repositories» тоже можно — тогда потом отметьте свой репозиторий.)*

---

## Создать пустой репозиторий на GitHub

1. Откройте: https://github.com/new  
2. **Repository name:** `roman-planeta-noginsk`  
3. Оставьте **Public**  
4. **Не** ставьте галочки README / .gitignore / license (репозиторий должен быть пустым)  
5. Нажмите **Create repository**  
6. Скопируйте ссылку вида:  
   `https://github.com/iokubovdior-tech/roman-planeta-noginsk`  
7. Пришлите эту ссылку в чат — сайт зальём с компьютера.

---

## Потом (сделаем вместе)

1. Залить код на GitHub (`git push`).  
2. На Vercel: **Import** этот репозиторий → **Deploy**.  
3. Получите ссылку `https://….vercel.app` для VK.

### Важно про оплату
Если Vercel просит **$20** — выберите тариф **Hobby / Personal** (личное), не Pro.  
Платить не нужно для старта.

---

## Локально (уже работает)

```powershell
cd C:\Users\Roman\roman-planeta-noginsk
npm run dev
```

Открыть: http://localhost:3000
