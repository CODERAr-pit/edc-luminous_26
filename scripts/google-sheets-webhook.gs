/**
 * Google Apps Script webhook for the LUMINOUS registration mirror.
 * Deploy as: Web app → Execute as Me → Who has access: Anyone.
 */
const SHEET_NAME = "Registrations";
const WEBHOOK_SECRET = "REPLACE_WITH_A_LONG_RANDOM_SECRET";

function doPost(request) {
  try {
    const body = JSON.parse(request.postData.contents);
    if (body.secret !== WEBHOOK_SECRET) return json({ ok: false, error: "Unauthorized" });

    const registration = body.registration;
    if (!registration || !registration.team_name || !registration.payment_screenshot_path) {
      return json({ ok: false, error: "Invalid registration" });
    }

    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      registration.team_name,
      registration.team_leader,
      registration.team_leader_reg_no || "",
      registration.team_leader_email,
      registration.team_leader_whatsapp,
      registration.member1_name,
      registration.member1_number,
      registration.member2_name,
      registration.member2_number,
      registration.member3_name,
      registration.member3_number,
      registration.payment_screenshot_path,
      registration.submitted_at,
      "Pending",
      "",
    ]);

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "Server error" });
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Received At",
      "Team Name",
      "Leader",
      "Leader Reg No",
      "Email",
      "WhatsApp",
      "Member 1",
      "Member 1 Number",
      "Member 2",
      "Member 2 Number",
      "Member 3",
      "Member 3 Number",
      "Screenshot Path",
      "Submitted At",
      "Status",
      "Notes",
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
