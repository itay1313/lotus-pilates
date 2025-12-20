# הוראות הגדרת Google Sheets

## שלב 1: יצירת Google Apps Script

1. פתחי את המסמך: https://docs.google.com/spreadsheets/d/1fOAYop08k9abeqK5b3sQ2xyaIZFjIhiLfNmGC_VjIE4/edit?usp=sharing

2. לחצי על **Extensions** > **Apps Script**

3. מחקי את כל הקוד הקיים והדבקי את הקוד הבא:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // אם זה השורה הראשונה, הוסף כותרות
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['מספר הרשמה', 'שם פרטי', 'שם משפחה', 'טלפון', 'תאריך ושעה']);
    }
    
    // קבלת הנתונים - תמיכה גם ב-JSON וגם ב-form data
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (e) {
        // אם זה לא JSON, נסה לפרש כ-form data
        const params = e.parameter;
        data = {
          registrationNumber: params.registrationNumber,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone
        };
      }
    } else {
      // Fallback ל-parameters
      data = {
        registrationNumber: e.parameter.registrationNumber,
        firstName: e.parameter.firstName,
        lastName: e.parameter.lastName,
        phone: e.parameter.phone
      };
    }
    
    const row = [
      data.registrationNumber || '',
      data.firstName || '',
      data.lastName || '',
      data.phone || '',
      new Date().toLocaleString('he-IL')
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'הנתונים נשמרו בהצלחה'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. לחצי על **Save** (שמור) ושני את שם הפרויקט ל-"Lotus Registration Handler"

5. לחצי על **Deploy** > **New deployment**

6. לחצי על האייקון של ⚙️ (Settings) ליד "Select type" ובחרי **Web app**

7. הגדירי:
   - **Description**: Lotus Registration Handler
   - **Execute as**: Me
   - **Who has access**: Anyone

8. לחצי על **Deploy**

9. **חשוב!** העתיקי את ה-Web App URL (הוא ייראה כך: `https://script.google.com/macros/s/...`)

10. הדבקי את ה-URL בקובץ `script.js` במקום `YOUR_GOOGLE_SCRIPT_URL`

## שלב 2: עדכון הקוד

הקוד ב-`script.js` כבר מוכן לקבל את ה-URL. פשוט הדבקי את ה-URL שקיבלת בשלב 1.

## בדיקה

לאחר ההגדרה, כל הרשמה חדשה תתווסף אוטומטית לטבלה ב-Google Sheets עם:
- מספר הרשמה
- שם פרטי
- שם משפחה
- טלפון
- תאריך ושעה

