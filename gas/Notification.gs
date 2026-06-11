/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Notification.gs
 * Description: Automated email notifications, system logs, and Telegram alerts.
 * ============================================================================
 */

function Notification_getRecent() {
  return Database_read("Notifications") || [];
}

/**
 * Creates and logs a system notification entry
 */
function Notification_log(title, body, category) {
  var alerts = Database_read("Notifications") || [];
  var newNotification = {
    id: "notif_" + Date.now(),
    title: title,
    body: body,
    category: category || "INFO", // INFO | WARNING | ALERT | CRITICAL
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  alerts.unshift(newNotification);
  Database_write("Notifications", alerts.slice(0, 100)); // Cap at 100 entries for efficiency
  return newNotification;
}

/**
 * Triggers a severe MLC 2006 fatigue violation alert across channels
 */
function Notification_triggerMlcAlert(crewId, violationDetails, logDate) {
  var crewList = Crew_getList();
  var crewName = "Unknown Sailor";
  var rank = "Seaman";
  
  for (var i = 0; i < crewList.length; i++) {
    if (crewList[i].id === crewId) {
      crewName = crewList[i].name;
      rank = crewList[i].rank;
      break;
    }
  }
  
  var title = "[⚠️ MLC VIOLATION] Fatigue Detected: " + crewName;
  var body = crewName + " (" + rank + ") violated MLC rest hours limits on " + logDate + ". Details: " + violationDetails;
  
  // Log inside database
  Notification_log(title, body, "ALERT");
  
  // Dispatches email to HR / Operations Manager
  var adminEmailStr = PropertiesService.getScriptProperties().getProperty("ADMIN_EMAIL");
  if (adminEmailStr) {
    try {
      MailApp.sendEmail({
        to: adminEmailStr,
        subject: title,
        body: body + "\n\nThis is an automated alert computed by LAS Fleet Monitoring System."
      });
    } catch (e) {
      console.warn("Mail dispatch skipped or blocked: " + e.message);
    }
  }
}

/**
 * Send an outbound message to PT. LAS global telegraph loop
 */
function Notification_telegramBroadcast(message) {
  var botToken = PropertiesService.getScriptProperties().getProperty("TELEGRAM_BOT_TOKEN");
  var chatId = PropertiesService.getScriptProperties().getProperty("TELEGRAM_CHAT_ID");
  
  if (botToken && chatId) {
    var url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
    var payload = {
      method: "post",
      payload: {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML"
      },
      muteHttpExceptions: true
    };
    
    try {
      var response = UrlFetchApp.fetch(url, payload);
      console.log("Telegram output status: " + response.getResponseCode());
    } catch (e) {
      console.error("Telegram broadcast failed: " + e.message);
    }
  }
}
