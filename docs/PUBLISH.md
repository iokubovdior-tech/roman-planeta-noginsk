# Как выложить сайт в интернет

Сайт готов локально. Чтобы его видели клиенты, нужны **хостинг** (бесплатно на старте) и по желанию **домен** (~200–400 ₽/год за `.ru`).

## Вариант A — Vercel (рекомендую)

### 1. Аккаунт
1. Откройте https://vercel.com/signup  
2. Зарегистрируйтесь через Google или GitHub (удобнее).

### 2. Загрузка проекта
**Через сайт Vercel (проще без Git):**
1. Dashboard → **Add New…** → **Project**
2. **Upload** папку проекта `roman-planeta-noginsk`  
   (или подключите GitHub-репозиторий, если уже есть)
3. Framework: **Next.js** (определится сам)
4. **Deploy**

Через несколько минут появится ссылка вида:
`https://roman-planeta-noginsk.vercel.app`

Её уже можно ставить в закреп VK (временно, до своего домена).

### 3. Свой домен `.ru`
1. Купите домен у регистратора (Reg.ru, Timeweb, Beget…)
2. В Vercel: Project → **Settings** → **Domains** → добавьте домен
3. У регистратора укажите DNS-записи, которые покажет Vercel (обычно A / CNAME)

Примеры имён:
- `roman-noginsk.ru`
- `yamnikov-planeta.ru`
- `rieltor-roman.ru`
- `planeta-roman.ru`

## Вариант B — через GitHub + Vercel
1. Установите Git: https://git-scm.com/download/win  
2. Создайте репозиторий на GitHub  
3. Залейте проект  
4. В Vercel: Import Git Repository → Deploy  

Так проще обновлять сайт потом: изменили файлы → push → сайт обновился.

## После публикации
1. Вставьте ссылку в закреп VK (`docs/VK-zakrep.md`)
2. Добавьте ссылку на Яндекс Карты (офис: Рабочая, 20)
3. Подключите Яндекс.Метрику (счётчик в `layout.tsx`)

## Локальный запуск (как сейчас)
```powershell
cd C:\Users\Roman\roman-planeta-noginsk
npm run dev
```
Открыть: http://localhost:3000
