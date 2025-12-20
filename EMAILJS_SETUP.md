# הוראות הגדרת EmailJS לשליחת מיילים

## שלב 1: יצירת חשבון EmailJS

1. הירשמי ל-EmailJS: https://www.emailjs.com/
2. צרי חשבון חינמי (100 מיילים בחודש)

## שלב 2: הגדרת Email Service

1. בחרי **Email Services** מהתפריט
2. לחצי על **Add New Service**
3. בחרי **Gmail** (או שירות אחר)
4. התחברי לחשבון Gmail שלך
5. העתיקי את ה-**Service ID** (נראה כך: `service_xxxxx`)

## שלב 3: יצירת Email Template

1. לך ל-**Email Templates** מהתפריט
2. לחצי על **Create New Template**
3. השתמשי בתבנית הבאה:

**Subject:**
```
הרשמה חדשה #{{registration_number}} - לוטוס פילאטיס
```

**Content:**
```
הרשמה חדשה לאירוע פתיחת השנה:

מספר הרשמה: {{registration_number}}
שם פרטי: {{first_name}}
שם משפחה: {{last_name}}
טלפון: {{phone}}
תאריך ושעה: {{timestamp}}

---
נשלח אוטומטית מאתר לוטוס פילאטיס
```

4. ב-**To Email** הכניסי: `lotuspilates45@gmail.com`
5. ב-**From Name** הכניסי: `לוטוס פילאטיס`
6. שמרי את התבנית והעתיקי את ה-**Template ID** (נראה כך: `template_xxxxx`)

## שלב 4: קבלת Public Key

1. לך ל-**Account** > **General**
2. העתיקי את ה-**Public Key** (נראה כך: `xxxxxxxxxxxxx`)

## שלב 5: עדכון הקוד

1. פתחי את קובץ `script.js`
2. מצאי את השורות הבאות:
```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

3. החלפי את הערכים:
   - `YOUR_SERVICE_ID` → ה-Service ID שקיבלת
   - `YOUR_TEMPLATE_ID` → ה-Template ID שקיבלת
   - `YOUR_PUBLIC_KEY` → ה-Public Key שקיבלת

## בדיקה

לאחר ההגדרה, כל הרשמה חדשה תישלח אוטומטית למייל:
**lotuspilates45@gmail.com**

המייל יכלול:
- מספר הרשמה (לפי הסדר)
- שם פרטי
- שם משפחה
- טלפון
- תאריך ושעה

## הערות חשובות

- המספר של ההרשמה נשמר ב-localStorage, כך שגם אם המשתמש ירענן את הדף, המספר יישמר
- המייל נשלח באופן אסינכרוני ולא חוסם את חוויית המשתמש
- אם שליחת המייל נכשלת, המשתמש עדיין יראה את המתנה שלו

