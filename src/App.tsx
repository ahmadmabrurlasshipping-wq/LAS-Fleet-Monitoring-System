import React, { useState, useEffect } from 'react';
import {
  INITIAL_VESSELS,
  INITIAL_CREW,
  INITIAL_DOCUMENTS,
  INITIAL_CREWDOCS,
  INITIAL_ROTATIONS,
  INITIAL_MLCLOGS,
  INITIAL_INCIDENTS,
  INITIAL_VOYAGES,
  INITIAL_PAYROLL,
  INITIAL_ACTIVITIES,
} from './data';
import { Vessel, CrewMember, VesselDocument, CrewDocument, Rotation, MlcLog, Incident, Voyage, PayrollEntry, Activity } from './types';

// Page Components
import { DashboardPage } from './components/DashboardPage';
import { FleetPage } from './components/FleetPage';
import { OperationsPage } from './components/OperationsPage';
import { CrewPage } from './components/CrewPage';
import { RotationPage } from './components/RotationPage';
import { MlcPage } from './components/MlcPage';
import { PayrollPage } from './components/PayrollPage';
import { DocumentPages } from './components/DocumentPages';
import { IncidentPage } from './components/IncidentPage';
import { initAuth, googleSignIn, logout, getAccessToken } from './firebase';

export default function App() {
  // ── CORE DATA STATE WITH LOCALSTORAGE DEFAULTS ──
  const [vessels, setVessels] = useState<Vessel[]>(() => {
    const saved = localStorage.getItem('fms_vessels');
    return saved ? JSON.parse(saved) : INITIAL_VESSELS;
  });

  const [crew, setCrew] = useState<CrewMember[]>(() => {
    const saved = localStorage.getItem('fms_crew');
    return saved ? JSON.parse(saved) : INITIAL_CREW;
  });

  const [vesselDocs, setVesselDocs] = useState<VesselDocument[]>(() => {
    const saved = localStorage.getItem('fms_vesselDocs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [crewDocs, setCrewDocs] = useState<CrewDocument[]>(() => {
    const saved = localStorage.getItem('fms_crewDocs');
    return saved ? JSON.parse(saved) : INITIAL_CREWDOCS;
  });

  const [rotations, setRotations] = useState<Rotation[]>(() => {
    const saved = localStorage.getItem('fms_rotations');
    return saved ? JSON.parse(saved) : INITIAL_ROTATIONS;
  });

  const [mlcLogs, setMlcLogs] = useState<MlcLog[]>(() => {
    const saved = localStorage.getItem('fms_mlcLogs');
    return saved ? JSON.parse(saved) : INITIAL_MLCLOGS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('fms_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [voyages, setVoyages] = useState<Voyage[]>(() => {
    const saved = localStorage.getItem('fms_voyages');
    return saved ? JSON.parse(saved) : INITIAL_VOYAGES;
  });

  const [payroll, setPayroll] = useState<PayrollEntry[]>(() => {
    const saved = localStorage.getItem('fms_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('fms_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // ── APP SETTINGS / GLOBAL STATS ──
  const [gasUrl, setGasUrl] = useState(() => {
    return localStorage.getItem('fms_gasUrl') || 'https://script.google.com/macros/s/AKfycbz_PT_LAS_DEMO/exec';
  });

  // ── AUTHENTICATION STATE ──
  const [user, setUser] = useState<{ email: string; role: string; uid?: string } | null>(() => {
    const saved = localStorage.getItem('fms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [needsAuth, setNeedsAuth] = useState(!user);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ── UI ROUTING STATE ──
  const [curPage, setCurPage] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // ── TOAST STATE ──
  const [toast, setToast] = useState<{ txt: string; type: 's' | 'd' | 'w' | 'i' } | null>(null);

  // Trigger professional auto-fading warnings or success toast notifications
  const triggerToast = (txt: string, type: 's' | 'd' | 'w' | 'i') => {
    setToast({ txt, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ── PERSISTENCE ENGINE ──
  useEffect(() => {
    localStorage.setItem('fms_vessels', JSON.stringify(vessels));
  }, [vessels]);

  useEffect(() => {
    localStorage.setItem('fms_crew', JSON.stringify(crew));
  }, [crew]);

  useEffect(() => {
    localStorage.setItem('fms_vesselDocs', JSON.stringify(vesselDocs));
  }, [vesselDocs]);

  useEffect(() => {
    localStorage.setItem('fms_crewDocs', JSON.stringify(crewDocs));
  }, [crewDocs]);

  useEffect(() => {
    localStorage.setItem('fms_rotations', JSON.stringify(rotations));
  }, [rotations]);

  useEffect(() => {
    localStorage.setItem('fms_mlcLogs', JSON.stringify(mlcLogs));
  }, [mlcLogs]);

  useEffect(() => {
    localStorage.setItem('fms_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('fms_voyages', JSON.stringify(voyages));
  }, [voyages]);

  useEffect(() => {
    localStorage.setItem('fms_payroll', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('fms_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('fms_gasUrl', gasUrl);
  }, [gasUrl]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fms_user');
    }
  }, [user]);

  // ── FIREBASE AUTH EFFECTS ──
  useEffect(() => {
    const unsubscribe = initAuth(
      (fbUser, token) => {
        const isAdmin = fbUser.email === 'ahmadmabrur.lasshipping@gmail.com';
        setUser({ email: fbUser.email || 'Unknown', role: isAdmin ? 'Admin' : 'Operator', uid: fbUser.uid });
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // ── LOGIN HANDLER ──
  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        const isAdmin = result.user.email === 'ahmadmabrur.lasshipping@gmail.com';
        setUser({ email: result.user.email || 'Unknown', role: isAdmin ? 'Admin' : 'Operator', uid: result.user.uid });
        triggerToast('Selamat Datang! Login Berhasil.', 's');
      }
    } catch (err) {
      console.error('Login failed:', err);
      triggerToast('Gagal terhubung dengan Google', 'd');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    triggerToast('Anda telah keluar dari konsol PT. LAS', 'w');
  };

  // Determine active alerts (e.g. Expired vessel documents or MLC violations)
  const expiringDocCount = vesselDocs.filter((d) => {
    if (d.expiry === '9999-12-31') return false;
    const diff = new Date(d.expiry).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 60;
  }).length;

  const mlcViolationCount = mlcLogs.filter((l) => l.rest < 10).length;
  const totalNotifications = expiringDocCount + mlcViolationCount + incidents.filter(i => i.status === 'investigating').length;

  if (needsAuth) {
    return (
      <div id="login-page">
        <div className="login-box">
          <div className="login-logo">
            <div className="login-logo-icon">
              <i className="fa fa-ship text-white"></i>
            </div>
            <h1>PT. PELAYANAN LESTARI ABADI SERASI</h1>
            <p>Maritime Fleet System</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="gsi-material-button" onClick={() => handleLogin()} disabled={isLoggingIn} style={{width: '100%', cursor: isLoggingIn ? 'wait' : 'pointer'}}>
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: 'block'}}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">{isLoggingIn ? "Logging in..." : "Sign in with Google"}</span>
                <span style={{display: 'none'}}>Sign in with Google</span>
              </div>
            </button>
          </div>

          <div className="login-hint">
            Hak Akses Dienkripsi &bull; BKI &amp; MLC 2006 Compliant
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="app" className={isSidebarCollapsed ? 'collapse' : ''}>
      {/* ── SIDEBAR BRAND NAVIGATION ── */}
      <div id="sidebar">
        <div className="sb-head">
          <div className="brand">
            <div className="brand-icon">
              <i className="fa fa-anchor text-white"></i>
            </div>
            {!isSidebarCollapsed && (
              <div className="brand-text">
                <div className="b1">PT. PELAYANAN LAS</div>
                <div className="b2">MARITIME ERP SYSTEM</div>
              </div>
            )}
          </div>
        </div>

        <div className="sb-nav">
          <div className="nav-sec-lbl">Navigasi Utama</div>
          
          <button className={`ni ${curPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurPage('dashboard')}>
            <span className="icon"><i className="fa fa-table-columns"></i></span>
            {!isSidebarCollapsed && <span>Dashboard Operasi</span>}
          </button>

          <button className={`ni ${curPage === 'vessels' ? 'active' : ''}`} onClick={() => setCurPage('vessels')}>
            <span className="icon"><i className="fa fa-ship"></i></span>
            {!isSidebarCollapsed && <span>Armada Kapal</span>}
          </button>

          <button className={`ni ${curPage === 'voyages' ? 'active' : ''}`} onClick={() => setCurPage('voyages')}>
            <span className="icon"><i className="fa fa-compass"></i></span>
            {!isSidebarCollapsed && <span>Log Pelayaran</span>}
          </button>

          <button className={`ni ${curPage === 'crew' ? 'active' : ''}`} onClick={() => setCurPage('crew')}>
            <span className="icon"><i className="fa fa-users-gear"></i></span>
            {!isSidebarCollapsed && <span>Manajemen Kru</span>}
          </button>

          <button className={`ni ${curPage === 'rotations' ? 'active' : ''}`} onClick={() => setCurPage('rotations')}>
            <span className="icon"><i className="fa fa-calendar-days"></i></span>
            {!isSidebarCollapsed && <span>Rotasi Scheduling</span>}
          </button>

          <div className="nav-sec-lbl" style={{ marginTop: '10px' }}>Kepatuhan &amp; HR</div>

          <button className={`ni ${curPage === 'mlc' ? 'active' : ''}`} onClick={() => setCurPage('mlc')}>
            <span className="icon"><i className="fa fa-clock-rotate-left"></i></span>
            {!isSidebarCollapsed && <span>Jam Kerja MLC 2006</span>}
          </button>

          <button className={`ni ${curPage === 'payroll' ? 'active' : ''}`} onClick={() => setCurPage('payroll')}>
            <span className="icon"><i className="fa fa-receipt"></i></span>
            {!isSidebarCollapsed && <span>Slip Gaji Kru</span>}
          </button>

          <button className={`ni ${curPage === 'documents' ? 'active' : ''}`} onClick={() => setCurPage('documents')}>
            <span className="icon"><i className="fa fa-file-shield"></i></span>
            {!isSidebarCollapsed && <span>Berkas &amp; STCW</span>}
          </button>

          <button className={`ni ${curPage === 'incidents' ? 'active' : ''}`} onClick={() => setCurPage('incidents')}>
            <span className="icon"><i className="fa fa-triangle-exclamation"></i></span>
            {!isSidebarCollapsed && <span>Log HSE &amp; K3</span>}
          </button>
        </div>

        {/* User Info footer */}
        <div className="sb-foot">
          {!isSidebarCollapsed ? (
            <div className="user-pill" onClick={() => triggerToast('Profil: ' + user.email, 'i')}>
              <div className="uav">AM</div>
              <div className="uinfo">
                <div className="u1">Ahmad Mabrur</div>
                <div className="u2">ROLE: {user.role}</div>
              </div>
              <button 
                className="logout-btn" 
                title="Keluar dari Konsol"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                <i className="fa fa-power-off"></i>
              </button>
            </div>
          ) : (
            <button className="ni" style={{ margin: '0 auto', background: 'transparent', border: 'none', width: '100%', justifyContent: 'center' }} onClick={handleLogout} title="Keluar">
              <span className="icon"><i className="fa fa-power-off text-red-500"></i></span>
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT AREA WITH HEADER ── */}
      <div id="content-area">
        {/* Top bar header */}
        <div id="topbar">
          <button className="tb-icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} title="Sembunyikan Sidebar" style={{ marginRight: '8px' }}>
            <i className={`fa ${isSidebarCollapsed ? 'fa-indent' : 'fa-outdent'}`}></i>
          </button>

          <div className="tb-info">
            <h1 className="t1" style={{ fontSize: '14px', letterSpacing: '0.4px', color: 'var(--text-100)' }}>
              {curPage === 'dashboard' ? 'Dashboard Operasional' :
               curPage === 'vessels' ? 'Armada Kapal & Fleet' :
               curPage === 'voyages' ? 'Log Pelayaran & Muatan' :
               curPage === 'crew' ? 'Manajemen & Direktori Kru' :
               curPage === 'rotations' ? 'Penjadwalan Rotasi' :
               curPage === 'mlc' ? 'Kepatuhan Jam Kerja (MLC 2006)' :
               curPage === 'payroll' ? 'Gaji & Payroll Pelaut' :
               curPage === 'documents' ? 'Verifikasi Dokumen & STCW' :
               'Log HSE, Insiden & Keselamatan K3'}
            </h1>
            <p className="t2">PT. Pelayaran Lestari Abadi Serasi</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto', position: 'relative' }}>
            {/* Realtime dynamic clock with brand context */}
            <div className="text-[11px] font-mono text-cyan-300 bg-slate-950/40 border border-slate-800/80 px-2.5 py-1 rounded inline-flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border2)' }}>
              <span className="w-1.5 h-1.5 bg-[#00e5a0] rounded-full animate-pulse"></span>
              UTC SERVER &bull; {new Date().toISOString().replace('T', ' ').substring(0, 19)}
            </div>

            {/* Notification alert system trigger */}
            <div style={{ position: 'relative' }}>
              <button className="tb-icon" onClick={() => setIsNotifOpen(!isNotifOpen)} title="Notifikasi Sistem">
                <i className="fa fa-bell"></i>
                {totalNotifications > 0 && (
                  <span className="dot"></span>
                )}
              </button>

              {isNotifOpen && (
                <div style={{ position: 'absolute', right: '0', top: '100%', marginTop: '10px', width: '300px', background: 'rgba(6, 18, 40, 0.98)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', zIndex: '999', backdropFilter: 'blur(20px)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'between', alignItems: 'center' }} className="text-cyan-300">
                    <span>ALERTS &amp; KEPATUHAN ({totalNotifications})</span>
                    <i className="fa fa-shield-halved ml-auto text-emerald-400"></i>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
                    {expiringDocCount > 0 && (
                      <div className="alert alert-warning" style={{ margin: 0, padding: '6px 10px' }}><i className="fa fa-triangle-exclamation"></i> Ada {expiringDocCount} Dokumen Kapal kadaluarsa dlm &lt; 60 hari!</div>
                    )}
                    {mlcViolationCount > 0 && (
                      <div className="alert alert-danger" style={{ margin: 0, padding: '6px 10px' }}><i className="fa fa-circle-xmark"></i> Terdeteksi {mlcViolationCount} pelanggaran jam istirahat MLC!</div>
                    )}
                    {incidents.filter(i => i.status === 'investigating').length > 0 && (
                      <div className="alert alert-info" style={{ margin: 0, padding: '6px 10px' }}><i className="fa fa-circle-info"></i> Ada {incidents.filter(i => i.status === 'investigating').length} kasus HSE dlm investigasi.</div>
                    )}
                    {totalNotifications === 0 && (
                      <div className="alert alert-success" style={{ margin: 0, padding: '6px 10px' }}><i className="fa fa-circle-check"></i> Sistem 100% compliant &amp; aman.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic active page render router routing wrapper */}
        <div id="page-area">
          {curPage === 'dashboard' && (
            <DashboardPage
              vessels={vessels}
              crew={crew}
              documents={vesselDocs}
              voyages={voyages}
              activities={activities}
              gasUrl={gasUrl}
              setGasUrl={setGasUrl}
              toast={triggerToast}
            />
          )}

          {curPage === 'vessels' && (
            <FleetPage
              vessels={vessels}
              setVessels={setVessels}
              toast={triggerToast}
              userRole={user.role}
            />
          )}

          {curPage === 'voyages' && (
            <OperationsPage
              voyages={voyages}
              setVoyages={setVoyages}
              vessels={vessels}
              toast={triggerToast}
              userRole={user.role}
            />
          )}

          {curPage === 'crew' && (
            <CrewPage
              crew={crew}
              setCrew={setCrew}
              vessels={vessels}
              toast={triggerToast}
              userRole={user.role}
            />
          )}

          {curPage === 'rotations' && (
            <RotationPage
              rotations={rotations}
              setRotations={setRotations}
              crew={crew}
              vessels={vessels}
              toast={triggerToast}
              userRole={user.role}
            />
          )}

          {curPage === 'mlc' && (
            <MlcPage
              mlcLogs={mlcLogs}
              setMlcLogs={setMlcLogs}
              crew={crew}
              vessels={vessels}
              toast={triggerToast}
              userRole={user.role}
            />
          )}

          {curPage === 'payroll' && (
            <PayrollPage
              payroll={payroll}
              setPayroll={setPayroll}
              crew={crew}
              vessels={vessels}
              toast={triggerToast}
              userRole={user.role}
            />
          )}

          {curPage === 'documents' && (
            <DocumentPages
              vesselDocs={vesselDocs}
              setVesselDocs={setVesselDocs}
              crewDocs={crewDocs}
              setCrewDocs={setCrewDocs}
              vessels={vessels}
              crew={crew}
              toast={triggerToast}
              userRole={user.role}
            />
          )}

          {curPage === 'incidents' && (
            <IncidentPage
              incidents={incidents}
              setIncidents={setIncidents}
              vessels={vessels}
              toast={triggerToast}
              userRole={user.role}
            />
          )}
        </div>
      </div>

      {/* ── TOAST MESSAGES FLOATER ELEMENT ── */}
      {toast && (
        <div
          className={`fms-toast ${
            toast.type === 's'
              ? 'toast-success'
              : toast.type === 'd'
              ? 'toast-danger'
              : toast.type === 'w'
              ? 'toast-warning'
              : 'toast-info'
          }`}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <i
              className={`fa ${
                toast.type === 's'
                  ? 'fa-circle-check text-emerald-400'
                  : toast.type === 'd'
                  ? 'fa-circle-xmark text-red-400'
                  : toast.type === 'w'
                  ? 'fa-triangle-exclamation text-amber-400'
                  : 'fa-circle-info text-[#00d4ff]'
              }`}
            ></i>
            <span>{toast.txt}</span>
          </div>
        </div>
      )}
    </div>
  );
}
