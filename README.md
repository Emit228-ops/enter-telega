# Enter Change - Telegram Mini App

Финансовое мини-приложение в Telegram для виртуальных USD карт, криптовалютных операций и трейдинга.

## О проекте

Enter Change - финансовый сервис с минималистичным дизайном:
- Виртуальные USD карты для онлайн-покупок
- Трейдинг криптовалют (спот-торговля)
- Конвертация между 20 криптовалютами
- Пополнение и вывод крипто
- QR оплата
- Управление кошельками

## Страницы

- **index.html** - главная страница с балансом и быстрыми действиями
- **card.html** - виртуальная USD карта
- **card-issue.html** - выпуск новой карты
- **card-topup.html** - пополнение карты
- **issue-card.html** - оформление карты
- **trading.html** - торговый терминал (Bybit-style)
- **trading-pairs.html** - выбор торговой пары
- **trading-history.html** - история ордеров
- **convert.html** - конвертация между валютами
- **wallets.html** - криптокошельки (20 валют)
- **deposit.html** - пополнение баланса
- **crypto-topup.html** - пополнение криптовалютой
- **withdraw.html** - вывод криптовалюты
- **qr-payment.html** - QR сканер для оплаты
- **history.html** - история транзакций
- **profile.html** - профиль пользователя
- **settings.html** - настройки аккаунта
- **kyc.html** - верификация через SumSub
- **faq.html** - частые вопросы
- **support.html** - поддержка 24/7
- **terms.html** - условия использования

## Технологии

- Чистый HTML/CSS/JS без фреймворков
- Telegram WebApp API (HapticFeedback)
- localStorage для хранения данных кошелька
- Canvas-анимация фона (neon-background.js)
- Единый стейт кошелька (wallet-state.js)

## Дизайн

Тёмная тема с cyan акцентом:
- Primary: `#06b6d4` (Cyan)
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Purple: `#8b5cf6`

Все стили в файле `design-system.css`
