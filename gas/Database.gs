/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Database.gs
 * Description: Core database adapter. Provides unified accessors for persistence.
 * ============================================================================
 */

var CACHE_TTL_SECONDS = 600; // 10 minutes cache

/**
 * Bootstraps the simulated relational tabular databases if empty
 */
function initDatabaseIfNeeded() {
  var props = PropertiesService.getScriptProperties();
  var isInitiated = props.getProperty("DB_INITIATED");
  
  if (!isInitiated) {
    // Seed initial data models
    props.setProperty("DB_Vessels", JSON.stringify(Database_getMockVessels()));
    props.setProperty("DB_Crew", JSON.stringify(Database_getMockCrew()));
    props.setProperty("DB_Schedules", JSON.stringify([]));
    props.setProperty("DB_Certificates", JSON.stringify([]));
    props.setProperty("DB_MlcLogs", JSON.stringify([]));
    props.setProperty("DB_INITIATED", "TRUE");
  }
}

/**
 * Fetch a generic JSON dataset from the persistent script schema
 */
function Database_read(tableName) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(tableName);
  if (cached) {
    return JSON.parse(cached);
  }
  
  var props = PropertiesService.getScriptProperties();
  var rawData = props.getProperty("DB_" + tableName);
  if (!rawData) {
    rawData = "[]";
  }
  
  cache.put(tableName, rawData, CACHE_TTL_SECONDS);
  return JSON.parse(rawData);
}

/**
 * Write/commit a generic JSON dataset to persistent storage and refresh CacheService
 */
function Database_write(tableName, dataArray) {
  var jsonStr = JSON.stringify(dataArray);
  var props = PropertiesService.getScriptProperties();
  props.setProperty("DB_" + tableName, jsonStr);
  
  var cache = CacheService.getScriptCache();
  cache.put(tableName, jsonStr, CACHE_TTL_SECONDS);
}

/**
 * Standard PT. LAS initial vessels template seed
 */
function Database_getMockVessels() {
  return [
    {
      id: "vessel_01",
      name: "SPOB LESTARI ABADI I",
      type: "SPOB (Self Propelled Oil Barge)",
      gt: 1450,
      dwt: 2200,
      loa: 74.5,
      breadth: 16.0,
      year: 2018,
      cls: "BKI (Biro Klasifikasi Indonesia)",
      port: "Samarinda",
      flag: "Indonesia",
      engine: "Yanmar 2x 1000 HP",
      status: "operational",
      crew: 12,
      location: "Balikpapan Outer Anchorage (01°15.4' S / 116°52.1' E)",
      notes: "Sertifikat keselamatan kelaiklautan penuh hingga mid 2026."
    },
    {
      id: "vessel_02",
      name: "LCT LESTARI JAYA VIII",
      type: "LCT (Landing Craft Tank)",
      gt: 850,
      dwt: 1200,
      loa: 58.0,
      breadth: 12.0,
      year: 2020,
      cls: "BKI",
      port: "Banjarmasin",
      flag: "Indonesia",
      engine: "Mitsubishi 2x 640 HP",
      status: "route",
      crew: 10,
      location: "Alur Barito - Menuju Selat Makassar (03°18.2' S / 115°04.5' E)",
      notes: "Digunakan aktif kargo logistik batubara / nikel."
    }
  ];
}

/**
 * Standard PT. LAS initial sailors registry template seed
 */
function Database_getMockCrew() {
  return [
    {
      id: "crew_01",
      name: "Capt. Bambang Hermawan",
      rank: "Nakhoda (Master / Captain)",
      vessel: "vessel_01",
      nationality: "Indonesia",
      passport: "B883145",
      seamanbook: "A902441",
      dob: "1975-04-12",
      status: "onboard",
      coc: "ANT-I (Sertifikat Ahli Nautika Tingkat I)",
      cocExp: "2027-11-20",
      medExp: "2026-08-15"
    },
    {
      id: "crew_02",
      name: "Suprayitno, M.Mar",
      rank: "Mualim I (Chief Officer / Chief Mate)",
      vessel: "vessel_01",
      nationality: "Indonesia",
      passport: "B129482",
      seamanbook: "A118492",
      dob: "1983-09-02",
      status: "onboard",
      coc: "ANT-II (Sertifikat Ahli Nautika Tingkat II)",
      cocExp: "2028-04-30",
      medExp: "2026-02-11"
    }
  ];
}
