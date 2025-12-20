# הוראות הגדרת Mailchimp

## שלב 1: יצירת רשימה ב-Mailchimp

1. היכנסי ל-Mailchimp: <https://mailchimp.com/>
2. לך ל-**Audience** > **All contacts**
3. לחצי על **Create Audience** (אם אין לך רשימה)
4. צרי רשימה חדשה בשם "הרשמות לוטוס פילאטיס"

## שלב 2: יצירת Custom Fields

1. לך ל-**Audience** > **Settings** > **Audience fields and |MERGE| tags**
2. לחצי על **Add A Field**
3. הוסף את השדות הבאים (אם לא קיימים):
   - **PHONE** (טלפון) - מסוג Phone - Tag: `PHONE`
   - **FNAME** (שם פרטי) - מסוג Text - Tag: `FNAME` (קיים כבר בדרך כלל)
   - **LNAME** (שם משפחה) - מסוג Text - Tag: `LNAME` (קיים כבר בדרך כלל)
   - **EMAIL** - שדה מייל (קיים כבר - חובה)

**חשוב:** וודאי שה-Tags תואמים: `FNAME`, `LNAME`, `PHONE`

## שלב 3: קבלת Form Action URL

1. לך ל-**Audience** > **Signup forms** > **Embedded forms**
2. בחרי **Classic** או **Unstyled**
3. העתיקי את ה-**Form Action URL** מהקוד שנוצר
   - זה נראה כך: `https://xxxxx.us21.list-manage.com/subscribe/post?u=xxxxx&id=xxxxx`
4. העתיקי גם את ה-**b_xxxxx_xxxxx** value (זה ה-bot protection field)

## שלב 4: עדכון הקוד ✅ הושלם

הקוד כבר עודכן עם הנתונים מ-Mailchimp:

- Form Action URL עודכן ב-`index.html` וב-`script.js`
- Bot Protection field עודכן ב-`index.html`
- הטופס מוכן לשימוש!

## הערות חשובות

- **מייל נסתר**: Mailchimp דורש שדה מייל חובה, אז הוספנו שדה מייל נסתר שיוצג אוטומטית מהטלפון (פורמט: `0501234567@lotuspilates.local`)
- **הטופס נשלח ל-Mailchimp** אחרי שהמשתמש רואה את המתנה שלו
- כל ההרשמות יאספו ברשימה ב-Mailchimp מסודרות לפי סדר ההרשמה
- הנתונים כוללים: שם פרטי, שם משפחה, טלפון, ומייל אוטומטי

## בדיקה

לאחר ההגדרה:

1. מלאי את הטופס באתר
2. לך ל-Mailchimp > Audience > All contacts
3. בדקי שהנרשם נוסף לרשימה עם כל הפרטים
