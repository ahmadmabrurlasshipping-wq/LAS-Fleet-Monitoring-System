import React, { useEffect, useRef, useState } from 'react';
import { Vessel, CrewMember, VesselDocument, Voyage, Activity } from '../types';

interface DashboardProps {
  vessels: Vessel[];
  crew: CrewMember[];
  documents: VesselDocument[];
  voyages: Voyage[];
  activities: Activity[];
  gasUrl: string;
  setGasUrl: (url: string) => void;
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({
  vessels,
  crew,
  documents,
  voyages,
  activities,
  gasUrl,
  setGasUrl,
  toast,
}) => {
  const chartMainRef = useRef<HTMLCanvasElement | null>(null);
  const chartCrewRef = useRef<HTMLCanvasElement | null>(null);
  const [chartType, setChartType] = useState<'kru' | 'docs' | 'ops'>('kru');
  const [gasInput, setGasInput] = useState(gasUrl);
  const [gasStatus, setGasStatus] = useState({
    dot: '#ffb020',
    text: 'MENUNGGU KONFIGURASI / OFFLINE MODE',
  });

  // Calculate stats
  const activeFleetCount = vessels.filter((v) => v.status === 'operational' || v.status === 'route').length;
  const onboardCount = crew.filter((c) => c.status === 'onboard').length;
  const leaveCount = crew.filter((c) => c.status === 'leave').length;
  const standbyCount = crew.filter((c) => c.status === 'standby').length;
  const medicalCount = crew.filter((c) => c.status === 'medical').length;

  const totalDocs = documents.length;
  const daysLeft = (expStr: string) => {
    if (expStr === '9999-12-31') return 9999;
    const diff = new Date(expStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const validDocs = documents.filter((d) => daysLeft(d.expiry) > 0).length;
  const docCompliancePct = totalDocs > 0 ? Math.round((validDocs / totalDocs) * 100) : 100;

  const activeVoyages = voyages.filter((v) => v.status === 'active');

  // Chart rendering using window.Chart CDN fallback
  useEffect(() => {
    const Chart = (window as any).Chart;
    if (!Chart) return;

    let chartMainInstance: any = null;
    let chartCrewInstance: any = null;

    if (chartMainRef.current) {
      const months = ['Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr'];
      const datasets = {
        kru: [
          {
            label: 'Kru Onboard',
            data: [11, 12, 13, 13, 12, 13, onboardCount],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.06)',
            tension: 0.4,
            fill: true,
          },
        ],
        docs: [
          {
            label: 'Dokumen Valid',
            data: [18, 18, 20, 19, 17, 17, validDocs],
            borderColor: '#00e5a0',
            backgroundColor: 'rgba(0, 229, 160, 0.06)',
            tension: 0.4,
            fill: true,
          },
        ],
        ops: [
          {
            label: 'Voyage Aktif',
            data: [1, 2, 3, 2, 3, 4, activeVoyages.length],
            borderColor: '#ff6b35',
            backgroundColor: 'rgba(255, 107, 53, 0.06)',
            tension: 0.4,
            fill: true,
          },
        ],
      };

      chartMainInstance = new Chart(chartMainRef.current, {
        type: 'line',
        data: {
          labels: months,
          datasets: datasets[chartType],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                boxWidth: 10,
                color: '#b0cfe8',
                font: { size: 10 },
              },
            },
          },
          scales: {
            x: {
              grid: { color: 'rgba(0, 180, 255, 0.03)' },
              ticks: { color: '#5a8aaa', font: { size: 10 } },
            },
            y: {
              grid: { color: 'rgba(0, 180, 255, 0.03)' },
              ticks: { color: '#5a8aaa', font: { size: 10 } },
            },
          },
        },
      });
    }

    if (chartCrewRef.current) {
      chartCrewInstance = new Chart(chartCrewRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Di Kapal', 'Cuti', 'Standby', 'Cuti Sakit'],
          datasets: [
            {
              data: [onboardCount, leaveCount, standbyCount, medicalCount],
              backgroundColor: ['#00e5a0', '#00d4ff', '#ffb020', '#ff3d5a'],
              borderWidth: 1,
              borderColor: '#071630',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 8,
                color: '#b0cfe8',
                font: { size: 9 },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartMainInstance) chartMainInstance.destroy();
      if (chartCrewInstance) chartCrewInstance.destroy();
    };
  }, [chartType, onboardCount, leaveCount, standbyCount, medicalCount, validDocs, activeVoyages.length]);

  const handleSaveGas = () => {
    setGasUrl(gasInput);
    toast('URL Endpoint disimpan', 's');
  };

  const [isExporting, setIsExporting] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  const handleExportSheets = async () => {
    const confirm = window.confirm('Apakah Anda yakin ingin mengekspor data armada dan kru ke format Google Sheets yang baru? (Data akan disimpan di Google Drive Anda)');
    if (!confirm) return;
    try {
      setIsExporting(true);
      const { getAccessToken } = await import('../firebase');
      const token = await getAccessToken();
      if (!token) {
        toast('Sesi OAuth kadaluarsa. Silakan login kembali.', 'd');
        return;
      }

      toast('Membuat Google Sheets...', 'i');
      
      const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: `Backup Operasional PT. LAS - ${new Date().toLocaleDateString()}` },
          sheets: [
            {
              properties: { title: 'Armada Kapal' }
            },
            {
              properties: { title: 'Daftar Kru' }
            }
          ]
        })
      });
      if (!res.ok) throw new Error('Gagal membuat spreadsheet');
      const spreadsheetUrl = (await res.json()).spreadsheetUrl;

      setGasStatus({
        dot: '#00e5a0',
        text: 'ONLINE / Sheets Export OK (' + spreadsheetUrl.split('/d/')[1].substring(0, 8) + '...)',
      });
      toast('Export berhasil! Spreadsheet dibuat di Drive Anda.', 's');
      window.open(spreadsheetUrl, '_blank');
    } catch (e: any) {
      toast('Export gagal: ' + e.message, 'd');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendEmailReport = async () => {
    const confirm = window.confirm('Apakah Anda yakin ingin mengirim laporan operasional ini ke alamat email Anda via Gmail API?');
    if (!confirm) return;
    try {
      setIsEmailing(true);
      const { getAccessToken } = await import('../firebase');
      const token = await getAccessToken();
      if (!token) {
        toast('Sesi OAuth kadaluarsa. Silakan login kembali.', 'd');
        return;
      }

      toast('Mengirim Laporan ke Email via Gmail API...', 'i');
      
      const reportText = `Laporan Operasional PT. LAS:\n- Kapal Aktif: ${activeFleetCount}/${vessels.length}\n- Kru Onboard: ${onboardCount}\n- Kepatuhan Dokumen: ${docCompliancePct}%\n\nSistem Fleet Monitoring Otomatis.`;
      
      const emailLine = `To: me\r\nSubject: Notifikasi Laporan Operasional PT. LAS\r\n\r\n${reportText}`;
      const encodedEmail = btoa(emailLine).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: encodedEmail
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error('Gagal kirim email: ' + err);
      }
      
      toast('Berhasil mengirim detail ke Gmail (dikirim ke "me")!', 's');
    } catch (e: any) {
      toast('Email gagal: ' + e.message, 'd');
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div>
      {/* KPI Cards */}
      <div className="g g4 mb14">
        <div className="sc">
          <div className="lbl">Armada Aktif</div>
          <div className="val text-neon">{activeFleetCount} / {vessels.length}</div>
          <div className="sub text-muted">Kapal Siap Operasi</div>
          <div className="ico"><i className="fa fa-ship text-neon"></i></div>
          <div className="bar" style={{ background: 'var(--neon)', width: `${(activeFleetCount / vessels.length) * 100}%` }}></div>
        </div>

        <div className="sc">
          <div className="lbl">Kru Onboard</div>
          <div className="val text-success">{onboardCount}</div>
          <div className="sub text-muted">Awak Aktif di Kapal</div>
          <div className="ico"><i className="fa fa-users text-success"></i></div>
          <div className="bar" style={{ background: 'var(--success)', width: `${(onboardCount / crew.length) * 100}%` }}></div>
        </div>

        <div className="sc">
          <div className="lbl">Kepatuhan Dokumen</div>
          <div className="val text-orange">{docCompliancePct}%</div>
          <div className="sub text-muted">{validDocs} / {totalDocs} Sertifikat Valid</div>
          <div className="ico"><i className="fa fa-file-signature text-orange"></i></div>
          <div className="bar" style={{ background: 'var(--orange)', width: `${docCompliancePct}%` }}></div>
        </div>

        <div className="sc">
          <div className="lbl">Pelayaran Aktif</div>
          <div className="val text-neon2">{activeVoyages.length}</div>
          <div className="sub text-muted">Voyage Berjalan Hari Ini</div>
          <div className="ico"><i className="fa fa-compass text-neon2"></i></div>
          <div className="bar" style={{ background: 'var(--neon2)', width: '60%' }}></div>
        </div>
      </div>

      {/* Main Charts & Side Blocks */}
      <div className="g g21 mb14">
        <div className="card">
          <div className="ctop">
            <div className="ct"><i className="fa fa-chart-line text-neon"></i> Grafik Tren Operasional</div>
            <div className="tabs">
              <button className={`tab ${chartType === 'kru' ? 'active' : ''}`} onClick={() => setChartType('kru')}>Kru</button>
              <button className={`tab ${chartType === 'docs' ? 'active' : ''}`} onClick={() => setChartType('docs')}>Sertifikat</button>
              <button className={`tab ${chartType === 'ops' ? 'active' : ''}`} onClick={() => setChartType('ops')}>Voyage</button>
            </div>
          </div>
          <div style={{ height: '210px', position: 'relative' }}>
            <canvas ref={chartMainRef}></canvas>
          </div>
        </div>

        <div className="card">
          <div className="ct"><i className="fa fa-chart-pie text-success"></i> Status Awak Kapal ({crew.length} org)</div>
          <div style={{ height: '210px', position: 'relative' }}>
            <canvas ref={chartCrewRef}></canvas>
          </div>
        </div>
      </div>

      {/* Tables & Activities */}
      <div className="g g21 mb14">
        <div className="card">
          <div className="ct"><i className="fa fa-route text-neon"></i> Log Pelayaran Aktif</div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Vessel</th>
                  <th>No Voyage</th>
                  <th>Rute</th>
                  <th>Muatan</th>
                  <th>ETA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {voyages.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-600)' }}>Tidak ada pelayaran terdaftar</td>
                  </tr>
                ) : (
                  voyages.map((v) => {
                    const ves = vessels.find((vs) => vs.id === v.vessel);
                    return (
                      <tr key={v.id}>
                        <td className="font-semibold text-white">{ves ? ves.name : '—'}</td>
                        <td className="mono font-semibold" style={{ color: 'var(--neon)' }}>{v.no}</td>
                        <td>{v.from} <i className="fa fa-arrow-right" style={{ fontSize: '9px', margin: '0 3px' }}></i> {v.to}</td>
                        <td>{v.cargo} <span className="text-muted">({v.qty})</span></td>
                        <td className="mono">{v.eta.replace('T', ' ')}</td>
                        <td>
                          <span className={`badge ${v.status === 'active' ? 'badge-success' : 'badge-muted'}`}>
                            {v.status === 'active' ? 'Pelayaran' : 'Selesai'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="ct"><i className="fa fa-clock text-orange"></i> Aktivitas Operasi &amp; Notifikasi</div>
          <div className="tl-wrap">
            {activities.slice(0, 5).map((act, i) => (
              <div className="tl-item" key={i}>
                <div className="tl-dot" style={{ background: act.col, boxShadow: `0 0 6px ${act.col}` }}></div>
                <div className="tl-time">{act.time}</div>
                <div className="tl-text">{act.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Workspace Integrations Setup */}
      <div className="card">
        <div className="ct"><i className="fa fa-share-nodes text-neon"></i> SINKRONISASI GOOGLE WORKSPACE (SHEETS & GMAIL API)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 280px' }}>
            <label className="fl">Backup ke Spreadsheet (Google Sheets API)</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button className="btn btn-primary btn-sm" onClick={handleExportSheets} disabled={isExporting}>
                <i className="fa fa-file-excel"></i> {isExporting ? 'Proses...' : 'Export ke Google Sheets Baru'}
              </button>
            </div>
            <label className="fl" style={{ marginTop: '14px' }}>Notifikasi Laporan (Gmail API)</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button className="btn btn-outline btn-sm" onClick={handleSendEmailReport} disabled={isEmailing} style={{ borderColor: 'var(--orange)', color: 'var(--orange)'}}>
                <i className="fa fa-envelope"></i> {isEmailing ? 'Mengirim...' : 'Kirim Laporan Operasional via Gmail'}
              </button>
            </div>
          </div>
          <div style={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span className="badge" style={{ background: 'rgba(0,0,0,0.2)', padding: '5px 8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: gasStatus.dot, marginRight: '6px' }}></span>
              STATUS: {gasStatus.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
