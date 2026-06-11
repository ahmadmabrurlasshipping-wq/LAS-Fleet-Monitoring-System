import React, { useState } from 'react';
import { VesselDocument, CrewDocument, Vessel, CrewMember } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

interface DocumentPagesProps {
  vesselDocs: VesselDocument[];
  setVesselDocs: React.Dispatch<React.SetStateAction<VesselDocument[]>>;
  crewDocs: CrewDocument[];
  setCrewDocs: React.Dispatch<React.SetStateAction<CrewDocument[]>>;
  vessels: Vessel[];
  crew: CrewMember[];
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
  userRole: string;
}

export const DocumentPages: React.FC<DocumentPagesProps> = ({
  vesselDocs,
  setVesselDocs,
  crewDocs,
  setCrewDocs,
  vessels,
  crew,
  toast,
  userRole,
}) => {
  // Tabs: 'vessel' | 'crew' | 'audit'
  const [activeTab, setActiveTab] = useState<'vessel' | 'crew' | 'audit'>('vessel');
  const [search, setSearch] = useState('');

  // Modals
  const [isVdocModalOpen, setIsVdocModalOpen] = useState(false);
  const [isCdocModalOpen, setIsCdocModalOpen] = useState(false);

  // Vdoc Form State
  const [vdocVessel, setVdocVessel] = useState('');
  const [vdocType, setVdocType] = useState('Safety');
  const [vdocName, setVdocName] = useState('');
  const [vdocIssuer, setVdocIssuer] = useState('DJPL Jakarta');
  const [vdocIssue, setVdocIssue] = useState('');
  const [vdocExpiry, setVdocExpiry] = useState('');
  const [vdocNotes, setVdocNotes] = useState('');
  const [vdocDriveUrl, setVdocDriveUrl] = useState('');
  const [vdocDriveName, setVdocDriveName] = useState('');

  // Cdoc Form State
  const [cdocCrewId, setCdocCrewId] = useState('');
  const [cdocType, setCdocType] = useState('COC');
  const [cdocNumber, setCdocNumber] = useState('');
  const [cdocIssuer, setCdocIssuer] = useState('DJPL Jakarta');
  const [cdocIssue, setCdocIssue] = useState('');
  const [cdocExpiry, setCdocExpiry] = useState('');
  const [cdocStatus, setCdocStatus] = useState<'valid' | 'expired' | 'proses'>('valid');
  const [cdocDriveUrl, setCdocDriveUrl] = useState('');
  const [cdocDriveName, setCdocDriveName] = useState('');

  // Google Picker Launcher Helper
  const handleLaunchPicker = (target: 'vdoc' | 'cdoc') => {
    const gapi = (window as any).gapi;
    const google = (window as any).google;

    if (!gapi || !google) {
      toast('Menunggu Google API memuat... Silakan tunggu beberapa saat.', 'w');
      return;
    }

    const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '965636963999-las-fleet-demo.apps.googleusercontent.com';

    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly',
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            toast(`Gagal autentikasi Google: ${tokenResponse.error}`, 'd');
            return;
          }
          if (tokenResponse.access_token) {
            openPicker(tokenResponse.access_token, target);
          }
        },
      });
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      console.error('Error launching Google Identity Client:', err);
      const url = prompt('Google Picker diblokir atau ada kendala browser. Salin dan tempel Link Google Drive Anda secara langsung di sini:');
      if (url) {
        if (target === 'vdoc') {
          setVdocDriveUrl(url);
          setVdocDriveName('Tautan Manual Google Drive');
        } else {
          setCdocDriveUrl(url);
          setCdocDriveName('Tautan Manual Google Drive');
        }
        toast('Tautan manual disimpan.', 's');
      }
    }
  };

  const openPicker = (token: string, target: 'vdoc' | 'cdoc') => {
    const gapi = (window as any).gapi;
    const google = (window as any).google;

    gapi.load('picker', () => {
      try {
        const pickerBuilder = new google.picker.PickerBuilder();
        const origin = window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
          ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
          : window.location.origin;

        const apiKey = (import.meta as any).env.VITE_GOOGLE_API_KEY || firebaseConfig.apiKey || '';

        const picker = pickerBuilder
          .addView(google.picker.ViewId.DOCS)
          .setOAuthToken(token)
          .setDeveloperKey(apiKey)
          .setOrigin(origin)
          .setCallback((data: any) => {
            if (data.action === google.picker.Action.PICKED) {
              const file = data.docs[0];
              if (target === 'vdoc') {
                setVdocDriveUrl(file.url);
                setVdocDriveName(file.name);
              } else {
                setCdocDriveUrl(file.url);
                setCdocDriveName(file.name);
              }
              toast(`Sertifikat "${file.name}" berhasil dihubungkan dari Google Drive!`, 's');
            }
          })
          .build();
        picker.setVisible(true);
      } catch (err: any) {
        console.error('Error building Google Picker:', err);
        const url = prompt('Gagal memuat Google Picker. Masukkan URL Berkas Google Drive Anda secara manual:');
        if (url) {
          if (target === 'vdoc') {
            setVdocDriveUrl(url);
            setVdocDriveName('Tautan Google Drive');
          } else {
            setCdocDriveUrl(url);
            setCdocDriveName('Tautan Google Drive');
          }
          toast('Tautan manual disimpan.', 's');
        }
      }
    });
  };

  const daysLeft = (expiry: string) => {
    if (expiry === '9999-12-31') return 9999;
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getExpiryBadge = (expiry: string) => {
    const days = daysLeft(expiry);
    if (days <= 0) return <span className="badge badge-danger">EXPIRED</span>;
    if (days <= 60) return <span className="badge badge-warning">EXPIRES SOON ({days}d)</span>;
    return <span className="badge badge-success">VALID ({days === 9999 ? 'PERMANENT' : `${days}d left`})</span>;
  };

  // Vessel Doc Actions
  const handleOpenVdocModal = () => {
    if (vessels.length === 0) {
      toast('Tambah kapal ke armada Terlebih dahulu!', 'd');
      return;
    }
    setVdocVessel(vessels[0].id);
    setVdocType('Safety');
    setVdocName('');
    setVdocIssuer('DJPL Jakarta');
    setVdocIssue(new Date().toISOString().substring(0, 10));
    setVdocExpiry(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
    setVdocNotes('');
    setVdocDriveUrl('');
    setVdocDriveName('');
    setIsVdocModalOpen(true);
  };

  const handleSaveVdoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vdocName.trim()) return;

    const newDoc: VesselDocument = {
      id: `vd_${Date.now()}`,
      vessel: vdocVessel,
      type: vdocType,
      name: vdocName.toUpperCase(),
      issuer: vdocIssuer,
      issue: vdocIssue,
      expiry: vdocExpiry,
      notes: vdocNotes,
      driveUrl: vdocDriveUrl || undefined,
      driveName: vdocDriveName || undefined,
    };

    setVesselDocs((prev) => [newDoc, ...prev]);
    toast(`Dokumen kapal ${vdocName} berhasil didaftarkan`, 's');
    setIsVdocModalOpen(false);
  };

  const handleDeleteVdoc = (id: string, name: string) => {
    if (confirm(`Hapus dokumen kapal ${name}?`)) {
      setVesselDocs((prev) => prev.filter((d) => d.id !== id));
      toast('Dokumen terhapus', 'w');
    }
  };

  // Crew Doc Actions
  const handleOpenCdocModal = () => {
    if (crew.length === 0) {
      toast('Tambah data kru terlebih dahulu!', 'd');
      return;
    }
    setCdocCrewId(crew[0].id);
    setCdocType('COC');
    setCdocNumber('');
    setCdocIssuer('DJPL Jakarta');
    setCdocIssue(new Date().toISOString().substring(0, 10));
    setCdocExpiry(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
    setCdocStatus('valid');
    setCdocDriveUrl('');
    setCdocDriveName('');
    setIsCdocModalOpen(true);
  };

  const handleSaveCdoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cdocNumber.trim()) return;

    const newDoc: CrewDocument = {
      id: `cd_${Date.now()}`,
      crewId: cdocCrewId,
      type: cdocType,
      docNumber: cdocNumber.toUpperCase(),
      issuer: cdocIssuer,
      issue: cdocIssue,
      expiry: cdocExpiry,
      status: cdocStatus,
      driveUrl: cdocDriveUrl || undefined,
      driveName: cdocDriveName || undefined,
    };

    setCrewDocs((prev) => [newDoc, ...prev]);
    toast(`Sertifikat pelaut nomor ${cdocNumber} berhasil ditambahkan`, 's');
    setIsCdocModalOpen(false);
  };

  const handleDeleteCdoc = (id: string) => {
    if (confirm('Hapus dokumen pelaut ini dari arsip?')) {
      setCrewDocs((prev) => prev.filter((d) => d.id !== id));
      toast('Sertifikat dihapus', 'w');
    }
  };

  // Get mappings
  const getVesselName = (id: string) => {
    const v = vessels.find((x) => x.id === id);
    return v ? v.name : '—';
  };

  const getCrewName = (id: string) => {
    const c = crew.find((x) => x.id === id);
    return c ? c.name : 'Unknown';
  };

  const getCrewRank = (id: string) => {
    const c = crew.find((x) => x.id === id);
    return c ? c.rank : '—';
  };

  // STCW compliance audit calculation
  // Audits onboard crew for having (1) valid COC (2) fit Medical certificate
  const stcwAudit = crew
    .filter((c) => c.status === 'onboard' && c.vessel)
    .map((c) => {
      const vName = getVesselName(c.vessel);
      const isCocValid = daysLeft(c.cocExp) > 0;
      const isMedValid = daysLeft(c.medExp) > 0;

      const issues: string[] = [];
      if (!isCocValid) issues.push(`CoC (${c.coc}) Expired pada ${c.cocExp}`);
      if (!isMedValid) issues.push(`Sertifikat Medis Expired pada ${c.medExp}`);

      const rankRequirements: Record<string, string[]> = {
        Nakhoda: ['ANT II', 'ANT I', 'ANT III M'],
        KKM: ['ATT II', 'ATT I', 'ATT III M'],
        'Mualim I': ['ANT III', 'ANT II'],
        'Masinis II': ['ATT III', 'ATT II'],
      };

      const expectedCOCs = rankRequirements[c.rank];
      if (expectedCOCs) {
        const matchesClass = expectedCOCs.some((exp) => c.coc.toUpperCase().includes(exp));
        if (!matchesClass) {
          issues.push(`Kelas CoC (${c.coc}) tidak sesuai standard jabatan (Harus ${expectedCOCs.join('/')})`);
        }
      }

      return {
        crew: c.name,
        rank: c.rank,
        vessel: vName,
        isCompliant: issues.length === 0,
        issues,
      };
    });

  const filteredVesselDocs = vesselDocs.filter((d) => {
    return d.name.toLowerCase().includes(search.toLowerCase()) ||
           getVesselName(d.vessel).toLowerCase().includes(search.toLowerCase());
  });

  const filteredCrewDocs = crewDocs.filter((d) => {
    return d.docNumber.toLowerCase().includes(search.toLowerCase()) ||
           getCrewName(d.crewId).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      {/* Tab select bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="tabs">
          <button className={`tab ${activeTab === 'vessel' ? 'active' : ''}`} onClick={() => { setActiveTab('vessel'); setSearch(''); }}>
            <i className="fa fa-anchor-circle-check"></i> Sertifikat Kapal ({vesselDocs.length})
          </button>
          <button className={`tab ${activeTab === 'crew' ? 'active' : ''}`} onClick={() => { setActiveTab('crew'); setSearch(''); }}>
            <i className="fa fa-id-card-clip"></i> Dokumen Pelaut ({crewDocs.length})
          </button>
          <button className={`tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
            <i className="fa fa-shield-halved"></i> Audit Kepatuhan STCW
          </button>
        </div>

        {activeTab !== 'audit' && (
          <div className="tb-search" style={{ border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
            <i className="fa fa-magnifying-glass" style={{ color: 'var(--text-400)', fontSize: '11px' }}></i>
            <input
              type="text"
              placeholder="Cari nomor dokumen atau kapal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '180px' }}
            />
          </div>
        )}
      </div>

      {/* ── SUB-PAGE 1: VESSEL DOCUMENTS ── */}
      {activeTab === 'vessel' && (
        <div className="card">
          <div className="ctop">
            <div className="ct"><i className="fa fa-file text-neon"></i> Sertifikat Kelaiklautan Kapal (Vessel Marine Docs)</div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenVdocModal}>
              <i className="fa fa-plus"></i> Unggah Sertifikat Kapal
            </button>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Nama Kapal</th>
                  <th>Kategori</th>
                  <th>Nama Sertifikat</th>
                  <th>Diterbitkan Oleh</th>
                  <th>Tanggal Terbit</th>
                  <th>Tanggal Kadaluarsa</th>
                  <th>Status Keabsahan</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredVesselDocs.map((d) => (
                  <tr key={d.id}>
                    <td className="font-semibold text-white">{getVesselName(d.vessel)}</td>
                    <td><span className="badge badge-muted">{d.type}</span></td>
                    <td className="font-semibold text-cyan-300">
                      <div>{d.name}</div>
                      {d.driveUrl && (
                        <a href={d.driveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline mt-1 font-sans">
                          <i className="fab fa-google-drive"></i> {d.driveName || 'Lihat Berkas'}
                        </a>
                      )}
                    </td>
                    <td>{d.issuer}</td>
                    <td className="mono">{d.issue}</td>
                    <td className="mono font-semibold" style={{ color: daysLeft(d.expiry) <= 60 ? 'var(--orange)' : 'inherit' }}>
                      {d.expiry === '9999-12-31' ? 'PERMANEN' : d.expiry}
                    </td>
                    <td>{getExpiryBadge(d.expiry)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDeleteVdoc(d.id, d.name)}>
                        <i className="fa fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUB-PAGE 2: CREW DOCUMENTS ── */}
      {activeTab === 'crew' && (
        <div className="card">
          <div className="ctop">
            <div className="ct"><i className="fa fa-id-card text-success"></i> Sertifikat Kompetensi &amp; Buku Pelaut (STCW)</div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenCdocModal}>
              <i className="fa fa-plus"></i> Unggah Dokumen Pelaut
            </button>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Nama Pelaut</th>
                  <th>Jabatan</th>
                  <th>Jenis Dokumen</th>
                  <th>Nomor Dokumen</th>
                  <th>Diterbitkan Oleh</th>
                  <th>Tanggal Berakhir</th>
                  <th>Keabsahan</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrewDocs.map((d) => (
                  <tr key={d.id}>
                    <td className="font-semibold text-white">{getCrewName(d.crewId)}</td>
                    <td>{getCrewRank(d.crewId)}</td>
                    <td><span className="badge badge-muted">{d.type}</span></td>
                    <td className="mono text-cyan-400 font-semibold">
                      <div>{d.docNumber}</div>
                      {d.driveUrl && (
                        <a href={d.driveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline mt-1 font-sans">
                          <i className="fab fa-google-drive"></i> {d.driveName || 'Lihat Berkas'}
                        </a>
                      )}
                    </td>
                    <td>{d.issuer}</td>
                    <td className="mono font-semibold">{d.expiry}</td>
                    <td>{getExpiryBadge(d.expiry)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDeleteCdoc(d.id)}>
                        <i className="fa fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUB-PAGE 3: STCW MANUAL AUDIT ── */}
      {activeTab === 'audit' && (
        <div className="card">
          <div className="ct"><i className="fa fa-shield-halved text-neon"></i> SINKRONISASI &amp; AUDIT KEPATUHAN AWAL KAPAL (STCW COMPLIANCE CHECKS)</div>
          <p className="text-zinc-400 text-xs leading-relaxed mb12">
            Audit dilakukan secara otomatis dengan membandingkan sertifkasi pelaut yang onboard di kapal terhadap kriteria klasifikasi standard jabatan, serta tanggal kadaluarsa Medical Fit sertifikat secara real-time.
          </p>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Nama Pelaut</th>
                  <th>Jabatan Onboard</th>
                  <th>Nama Kapal</th>
                  <th>Status STCW</th>
                  <th>Temuan Audit / Catatan Kepatuhan</th>
                </tr>
              </thead>
              <tbody>
                {stcwAudit.map((audit, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-white">{audit.crew}</td>
                    <td className="font-semibold">{audit.rank}</td>
                    <td className="text-cyan-400 font-semibold">{audit.vessel}</td>
                    <td>
                      <span className={`badge ${audit.isCompliant ? 'badge-success' : 'badge-danger'}`}>
                        {audit.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                      </span>
                    </td>
                    <td>
                      {audit.isCompliant ? (
                        <span className="text-emerald-400 text-xs"><i className="fa fa-circle-check"></i> Seluruh Kualifikasi &amp; MCU Valid</span>
                      ) : (
                        <div className="text-red-400 text-xsspace-y-1">
                          {audit.issues.map((iss, j) => (
                            <div key={j} className="flex items-center gap-1"><i className="fa fa-circle-xmark"></i> {iss}</div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vessel Doc Modal */}
      <div className={`modal-overlay ${isVdocModalOpen ? 'show' : ''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setIsVdocModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-file-signature"></i> Pendaftaran Sertifikat Kapal Baru
          </div>

          <form onSubmit={handleSaveVdoc}>
            <div className="fg">
              <label className="fl">Pilih Kapal Penerima Sertifikat *</label>
              <select className="fs" value={vdocVessel} onChange={(e) => setVdocVessel(e.target.value)}>
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="fg">
              <label className="fl">Nama Sertifikat Dokumen *</label>
              <input
                type="text"
                className="fi"
                value={vdocName}
                onChange={(e) => setVdocName(e.target.value)}
                placeholder="Contoh: Hull Certificate (BKI) / SMC"
                required
              />
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Kelompok / Kategori Dokumen</label>
                <select className="fs" value={vdocType} onChange={(e) => setVdocType(e.target.value)}>
                  <option value="Registrasi">Pendaftaran / Registrasi</option>
                  <option value="Safety">Keselamatan (Safety)</option>
                  <option value="Kelas BKI">Kelas Kapal BKI</option>
                  <option value="MARPOL">Pencegahan Polusi (MARPOL)</option>
                  <option value="Radio">Izin Radio Kapal</option>
                </select>
              </div>
              <div>
                <label className="fl">Badan Penerbit Sertifikat</label>
                <input
                  type="text"
                  className="fi"
                  value={vdocIssuer}
                  onChange={(e) => setVdocIssuer(e.target.value)}
                  placeholder="Contoh: DJPL / BKI"
                />
              </div>
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Tanggal Penerbitan</label>
                <input
                  type="date"
                  className="fi"
                  value={vdocIssue}
                  onChange={(e) => setVdocIssue(e.target.value)}
                />
              </div>
              <div>
                <label className="fl">Tanggal Kadaluarsa Certificate</label>
                <input
                  type="date"
                  className="fi"
                  value={vdocExpiry}
                  onChange={(e) => setVdocExpiry(e.target.value)}
                />
              </div>
            </div>

            <div className="fg">
              <label className="fl">Catatan Sertifikat / Keterangan</label>
              <input
                type="text"
                className="fi"
                value={vdocNotes}
                onChange={(e) => setVdocNotes(e.target.value)}
                placeholder="Opsional"
              />
            </div>

            {/* Google Drive Integration */}
            <div className="fg" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <label className="fl flex items-center gap-1.5">
                <i className="fab fa-google-drive text-[#0F9D58]"></i> Lampiran Google Drive (Picker)
              </label>
              
              {vdocDriveUrl ? (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fab fa-google-drive text-[#0F9D58]" style={{ fontSize: '14px' }}></i>
                    <div>
                      <div className="font-semibold text-white">{vdocDriveName}</div>
                      <a href={vdocDriveUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:underline">
                        Lihat Berkas Terpilih <i className="fa fa-external-link" style={{ fontSize: '8px' }}></i>
                      </a>
                    </div>
                  </div>
                  <button type="button" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px', fontSize: '14px' }} onClick={() => { setVdocDriveUrl(''); setVdocDriveName(''); }}>
                    <i className="fa fa-trash-can"></i>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-xs flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px' }}
                    onClick={() => handleLaunchPicker('vdoc')}
                  >
                    <i className="fab fa-google-drive text-[#0F9D58]"></i> Pilih Sertifikat dari Drive
                  </button>
                  <input
                    type="text"
                    className="fi text-xs"
                    style={{ margin: 0, padding: '4px 8px', fontSize: '11px', flex: 1 }}
                    placeholder="Atau tempel link manual di sini..."
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        setVdocDriveUrl(val);
                        setVdocDriveName('Dokumen Tautan Google Drive');
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsVdocModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">Simpan Sertifikat</button>
            </div>
          </form>
        </div>
      </div>

      {/* Crew Doc Modal */}
      <div className={`modal-overlay ${isCdocModalOpen ? 'show' : ''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setIsCdocModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-id-card-clip"></i> Daftarkan Sertifikat / Buku Pelaut Crew
          </div>

          <form onSubmit={handleSaveCdoc}>
            <div className="fg">
              <label className="fl">Nama Awak Pelaut *</label>
              <select className="fs" value={cdocCrewId} onChange={(e) => setCdocCrewId(e.target.value)}>
                {crew.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.rank})</option>
                ))}
              </select>
            </div>

            <div className="fg">
              <label className="fl">Nomor Sertifikat / Dokumen *</label>
              <input
                type="text"
                className="fi"
                value={cdocNumber}
                onChange={(e) => setCdocNumber(e.target.value)}
                placeholder="Contoh: G-132440 / F 318245"
                required
              />
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Jenis Dokumen STCW</label>
                <select className="fs" value={cdocType} onChange={(e) => setCdocType(e.target.value)}>
                  <option value="COC">Kompetensi (COC Class)</option>
                  <option value="COP">Keahlian Khusus (COP Training)</option>
                  <option value="Buku Pelaut">Buku Pelaut (Seaman Book)</option>
                  <option value="Medis">Sertifikat Medis (MCU Fit Certificate)</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
              <div>
                <label className="fl">Badan Penerbit</label>
                <input
                  type="text"
                  className="fi"
                  value={cdocIssuer}
                  onChange={(e) => setCdocIssuer(e.target.value)}
                />
              </div>
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Tanggal Penerbitan</label>
                <input
                  type="date"
                  className="fi"
                  value={cdocIssue}
                  onChange={(e) => setCdocIssue(e.target.value)}
                />
              </div>
              <div>
                <label className="fl">Tanggal Berakhir Berlaku</label>
                <input
                  type="date"
                  className="fi"
                  value={cdocExpiry}
                  onChange={(e) => setCdocExpiry(e.target.value)}
                />
              </div>
            </div>

            <div className="fg">
              <label className="fl">Status Proses</label>
              <select className="fs" value={cdocStatus} onChange={(e) => setCdocStatus(e.target.value as any)}>
                <option value="valid">Valid / Aktif Terbit</option>
                <option value="proses">Proses Perpanjangan (On Extension)</option>
              </select>
            </div>

            {/* Google Drive Integration */}
            <div className="fg" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <label className="fl flex items-center gap-1.5">
                <i className="fab fa-google-drive text-[#0F9D58]"></i> Lampiran Google Drive (Picker)
              </label>
              
              {cdocDriveUrl ? (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fab fa-google-drive text-[#0F9D58]" style={{ fontSize: '14px' }}></i>
                    <div>
                      <div className="font-semibold text-white">{cdocDriveName}</div>
                      <a href={cdocDriveUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:underline">
                        Lihat Berkas Terpilih <i className="fa fa-external-link" style={{ fontSize: '8px' }}></i>
                      </a>
                    </div>
                  </div>
                  <button type="button" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px', fontSize: '14px' }} onClick={() => { setCdocDriveUrl(''); setCdocDriveName(''); }}>
                    <i className="fa fa-trash-can"></i>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-xs flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px' }}
                    onClick={() => handleLaunchPicker('cdoc')}
                  >
                    <i className="fab fa-google-drive text-[#0F9D58]"></i> Pilih Dokumen dari Drive
                  </button>
                  <input
                    type="text"
                    className="fi text-xs"
                    style={{ margin: 0, padding: '4px 8px', fontSize: '11px', flex: 1 }}
                    placeholder="Atau tempel link manual di sini..."
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        setCdocDriveUrl(val);
                        setCdocDriveName('Dokumen Tautan Google Drive');
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsCdocModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">Simpan Dokumen</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
