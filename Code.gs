// ================================================================
// 당진정보고등학교 학과 진로탐색 — 상담 문의 수신 스크립트
// 스프레드시트 시트명: "상담현황"
// 컬럼: A=접수시간 | B=학번/소속 | C=성명 | D=관계 | E=관심분야 | F=문의내용
// ================================================================

function doPost(e) {
  try {
    // 1. JSON 파싱
    var formData = JSON.parse(e.postData.contents);

    // 2. 현재 스프레드시트의 "상담현황" 시트 가져오기
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("상담현황");

    // 3. 시트가 없으면 새로 만들고 헤더 생성 (이미 있으면 그냥 진행)
    if (!sheet) {
      sheet = ss.insertSheet("상담현황");
      sheet.appendRow(["접수시간", "학번/소속", "성명", "관계", "관심분야", "문의내용"]);
      sheet.getRange("1:1").setFontWeight("bold").setBackground("#f3f3f3");
    }

    // 4. 한국 시간으로 접수시간 생성
    var kstTime = Utilities.formatDate(
      new Date(),
      "Asia/Seoul",
      "yyyy-MM-dd HH:mm:ss"
    );

    // 5. 데이터 행 추가 (헤더 순서와 동일하게)
    sheet.appendRow([
      kstTime,              // A: 접수시간
      formData.studentId,   // B: 학번/소속
      formData.name,        // C: 성명
      formData.relation,    // D: 관계
      formData.interest,    // E: 관심분야
      formData.message      // F: 문의내용
    ]);

    // 6. 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // 7. 오류 응답
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
