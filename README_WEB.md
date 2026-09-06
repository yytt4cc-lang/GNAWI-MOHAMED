# 🎮 Quest Completer Web v2.0

تحويل بوت Discord الأصلي إلى **موقع ويب احترافي** يسمح بإكمال مهام Discord تلقائياً من خلال واجهة ويب سهلة الاستخدام!

## ✨ المميزات

- ✅ **واجهة ويب حديثة** - تصميم أنيق وداكن مستوحى من Discord
- 🔗 **ربط آمن للتوكن** - حفظ التوكن في قاعدة بيانات محلية
- 🎯 **إكمال مهام واحدة أو متعددة** - اختر بنفسك أو أكمل الكل دفعة واحدة
- 📊 **عرض تفصيلي للمهام** - اعرض المهام المتاحة مع تفاصيل كاملة
- ✅ **التحقق من صحة التوكن** - تأكد من أن التوكن صحيح قبل الاستخدام
- 📱 **تصميم متجاوب** - يعمل على الهاتف والكمبيوتر
- 💾 **حفظ السجل** - تتبع المهام المكتملة والفاشلة

## 🚀 البدء السريع

### المتطلبات

- Node.js >= 20.0.0
- npm أو yarn

### التثبيت

```bash
# 1. استنساخ المستودع أو فتح الفرع web-version
git checkout web-version

# 2. تثبيت المتطلبات
npm install

# 3. إنشاء ملف .env
cat > .env << EOF
PORT=3000
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_id_here
EOF

# 4. تشغيل الخادم
npm start
```

الموقع سيكون متاحاً على: **http://localhost:3000** 🌐

## 📖 الاستخدام

### 1️⃣ ربط التوكن

```
1. أفتح الموقع http://localhost:3000
2. اذهب إلى قسم "ربط توكن Discord"
3. احصل على التوكن:
   - افتح Discord في المتصفح
   - اضغط F12 → Console
   - ألصق: document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token
   - انسخ التوكن الذي يظهر
4. ألصق التوكن في النموذج واضغط "ربط التوكن"
```

### 2️⃣ عرض المهام

بعد ربط التوكن، ستشاهد:
- 📋 قائمة بجميع المهام المتاحة
- 🎮 صورة المباراة وتفاصيلها
- 🎁 المكافآت المتوفرة
- ⏳ الوقت المتبقي قبل انتهاء كل مهمة

### 3️⃣ إكمال المهام

هناك 3 طرق:

#### أ) إكمال مهمة واحدة
- اضغط على زر "✅ إكمال" على أي مهمة
- أو اذهب إلى "إكمال مهمة واحدة" وأدخل معرّف المهمة

#### ب) إكمال جميع المهام
- اضغط على زر "⚡ إكمال جميع المهام"
- تأكد في نافذة التأكيد
- سيتم إكمال جميع المهام تلقائياً

#### ج) التحقق من التوكن
- اضغط على "✅ التحقق من التوكن"
- سيُظهر لك حالة التوكن وحساب Discord المرتبط

## 📁 هيكل المشروع

```
web-version/
├── server.js                    # نقطة البداية الرئيسية
├── package.json                 # المتطلبات والـ scripts
├── .env                         # متغيرات البيئة
│
├── database/
│   └── db.js                   # إدارة قاعدة البيانات SQLite
│
├── routes/
│   └── quests.js               # جميع API endpoints
│
├── public/                      # ملفات الويب الثابتة
│   ├── index.html              # الصفحة الرئيسية
│   ├── style.css               # الأنماط (CSS)
│   └── script.js               # التفاعل (JavaScript)
│
└── src/                         # الكود الأصلي من البوت
    ├── quest/                  # منطق المهام
    └── utils/                  # أدوات مساعدة
```

## 🔌 API Endpoints

### POST `/api/link`
**ربط توكن Discord**

Request:
```json
{
  "userId": "your_user_id",
  "token": "discord_token_here"
}
```

Response:
```json
{
  "success": true,
  "message": "✅ تم ربط التوكن بنجاح! الحساب: Username",
  "accountName": "Username"
}
```

---

### GET `/api/quest-list`
**الحصول على قائمة المهام المتاحة**

Query Params:
- `userId`: معرّف المستخدم

Response:
```json
{
  "success": true,
  "quests": [
    {
      "id": "quest_id_123",
      "name": "Quest Name",
      "game": "Game Title",
      "publisher": "Publisher Name",
      "expiresAt": "2026-09-13T00:00:00Z",
      "thumbnail": "https://...",
      "rewards": [
        {
          "name": "Nitro Gift",
          "orbs": 0,
          "nitro": 7
        }
      ]
    }
  ]
}
```

---

### POST `/api/quest-complete`
**إكمال مهمة واحدة**

Request:
```json
{
  "userId": "your_user_id",
  "questId": "quest_id_123"
}
```

Response:
```json
{
  "success": true,
  "message": "✅ تم إكمال المهمة بنجاح!",
  "questName": "Quest Name",
  "claimedRewards": 3
}
```

---

### POST `/api/quest-all`
**إكمال جميع المهام**

Request:
```json
{
  "userId": "your_user_id"
}
```

Response:
```json
{
  "success": true,
  "message": "✅ تم إكمال 3 مهام من 5",
  "results": [
    {
      "name": "Quest 1",
      "status": "✅ نجح",
      "rewards": 3
    }
  ],
  "summary": {
    "completed": 3,
    "failed": 2,
    "total": 5
  }
}
```

---

### POST `/api/token-check`
**التحقق من صحة التوكن**

Request:
```json
{
  "userId": "your_user_id"
}
```

Response:
```json
{
  "success": true,
  "valid": true,
  "message": "✅ التوكن صحيح! الحساب: Username",
  "accountName": "Username"
}
```

---

### POST `/api/unlink`
**فصل التوكن**

Request:
```json
{
  "userId": "your_user_id"
}
```

Response:
```json
{
  "success": true,
  "message": "🔓 تم فصل التوكن بنجاح"
}
```

## ⚙️ المتغيرات البيئية

```env
# رقم المنفذ (اختياري - الافتراضي 3000)
PORT=3000

# توكن البوت على Discord (اختياري للأصل)
DISCORD_TOKEN=your_bot_token

# معرّف تطبيق Discord (اختياري للأصل)
DISCORD_CLIENT_ID=your_client_id
```

## 🗄️ قاعدة البيانات

يستخدم المشروع **SQLite3** لحفظ البيانات محلياً:

### جداول البيانات

#### `users`
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  user_id TEXT UNIQUE,
  discord_token TEXT,
  account_name TEXT,
  autoquest_enabled INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### `quest_history`
```sql
CREATE TABLE quest_history (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  quest_id TEXT,
  quest_name TEXT,
  status TEXT,
  claimed_rewards INTEGER DEFAULT 0,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)
```

## 🎨 الواجهة

### الصفحة الرئيسية - تسجيل الدخول
![Login Screen]
- حقل إدخال معرّف المستخدم
- حقل إدخال التوكن
- تعليمات مفصلة للحصول على التوكن

### لوحة التحكم
![Dashboard]
- معلومات الحساب الحالي
- أزرار سريعة للعمليات الأساسية
- شبكة عرض المهام المتاحة
- قسم النتائج عند إكمال مهام

## 🛠️ التطوير

### تشغيل مع إعادة تحميل تلقائي

```bash
npm install -D nodemon
npm run dev
```

### البيانات المخزنة

- التوكنات محفوظة في قاعدة البيانات SQLite
- معرّفات المستخدمين محفوظة في localStorage
- سجل المهام محفوظ في جدول quest_history

## ⚠️ تنبيهات أمان

⚠️ **هام جداً:**

1. **لا تشارك التوكن الخاص بك** - التوكن يمنح وصول كامل لحسابك
2. **استخدم على جهازك الشخصي فقط** - لا تستخدم على خوادم عامة
3. **احم ملف .env** - لا تضعه على GitHub أو مكان عام
4. **المتوكل يُخزن محلياً فقط** - لا يُرسل إلى جهات خارجية

## 📝 السجل

### v2.0 (Web Version)
- ✅ تحويل البوت إلى موقع ويب
- ✅ واجهة حديثة مستجيبة
- ✅ API endpoints شاملة
- ✅ قاعدة بيانات SQLite
- ✅ دعم لغة عربية كاملة

### v1.0 (Original Bot)
- ✅ بوت Discord أصلي
- ✅ أوامر Slash
- ✅ أوامر بادئة

## 🤝 المساهمة

نرحب بأي مساهمات! يمكنك:
- الإبلاغ عن الأخطاء
- اقتراح تحسينات
- إضافة مميزات جديدة
- تحسين التوثيق

## 📞 الدعم

- **خادم الدعم:** [dsc.gg/synoraxdev](https://dsc.gg/synoraxdev)
- **المطور الأصلي:** KiT2|.ggnoobies - Synora 乂 Development
- **نسخة الويب:** Customized for Web Platform

## 📜 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

---

## 🎯 التالي

الميزات القادمة:
- 🤖 Auto-Quest - إكمال المهام تلقائياً عند ظهورها
- 📊 لوحة إحصائيات متقدمة
- 🔔 إشعارات عند انتهاء المهام
- 👥 دعم مستخدمين متعددين
- 🌙 وضع فاتح/داكن
- 🌍 دعم لغات إضافية

---

**استمتع بإكمال مهامك على Discord بسهولة! 🚀**
