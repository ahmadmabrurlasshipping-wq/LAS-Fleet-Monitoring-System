import React, { useState } from 'react';
import { Rotation, CrewMember, Vessel } from '../types';

interface RotationPageProps {
  rotations: Rotation[];
  setRotations: React.Dispatch<React.SetStateAction<Rotation[]>>;
  crew: CrewMember[];
  vessels: Vessel[];
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
  userRole: string;
}

export const RotationPage: React.FC<RotationPageProps> = ({
  rotations,
  setRotations,
  crew,
  vessels,
  toast,
  userRole,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields State
  const [formCrewId, setFormCrewId] = useState('');
  const [formVesselId, setFormVesselId] = useState('');
  const [formRank, setFormRank] = useState('Nakhoda');
  const [formSignOn, setFormSignOn] = useState('');
  const [formSignOff, setFormSignOff] = useState('');
  const [formStatus, setFormStatus] = useState<'planned' | 'enroute' | 'onboard' | 'leave'>('planned');
  const [formPort, setFormPort] = useState('Samarinda');

  // GAP ANALYSIS
  // Check for each vessel if they lack a critical rank (Nakhoda or KKM) among active onboard crew
  const gapAlerts: { vesselName: string; missingRank: string }[] = [];
  vessels.forEach((v) => {
    if (v.status !== 'drydock') {
      const activeCrews = crew.filter((c) => c.vessel === v.id && c.status === 'onboard');
      const hasNakhoda = activeCrews.some((c) => c.rank === 'Nakhoda');
      const hasKkm = activeCrews.some((c) => c.rank === 'KKM');

      if (!hasNakhoda) {
        gapAlerts.push({ vesselName: v.name, missingRank: 'Nakhoda' });
      }
      if (!hasKkm) {
        gapAlerts.push({ vesselName: v.name, missingRank: 'KKM (Kepala Kamar Mesin)' });
      }
    }
  });

  const handleOpenAddModal = () => {
    if (userRole !== 'Admin') {
      toast('Akses ditolak: Hanya Admin yang dapat menjadwalkan rotasi!', 'd');
      return;
    }
    if (crew.length === 0) {
      toast('Tambah data kru di direktori terlebih dahulu!', 'd');
      return;
    }
    setFormCrewId(crew[0].id);
    setFormVesselId(vessels.length > 0 ? vessels[0].id : '');
    setFormRank('Nakhoda');
    setFormSignOn(new Date().toISOString().substring(0, 10));
    setFormSignOff(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
    setFormStatus('planned');
    setFormPort('Samarinda');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCrewId) {
      toast('Pilih crew terlebih dahulu!', 'd');
      return;
    }

    const selectedCrew = crew.find((c) => c.id === formCrewId);

    const newRotation: Rotation = {
      id: `rot_${Date.now()}`,
      crew: formCrewId,
      vessel: formVesselId,
      rank: selectedCrew ? selectedCrew.rank : formRank,
      signOn: formSignOn,
      signOff: formSignOff,
      status: formStatus,
      port: formPort,
    };

    setRotations((prev) => [...prev, newRotation]);
    toast(`Jadwal rotasi untuk ${selectedCrew ? selectedCrew.name : 'Crew'} berhasil ditambahkan`, 's');
    setIsModalOpen(false);
  };

  const handleDeleteRotation = (id: string) => {
    if (confirm('Batalkan jadwal rotasi kru ini?')) {
      setRotations((prev) => prev.filter((r) => r.id !== id));
      toast('Rotasi dibatalkan', 'w');
    }
  };

  const getCrewName = (id: string) => {
    const c = crew.find((x) => x.id === id);
    return c ? c.name : 'Unknown Crew';
  };

  const getVesselName = (id: string) => {
    if (!id) return 'Dalam Pool / Bebas';
    const v = vessels.find((x) => x.id === id);
    return v ? v.name : '—';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'true', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '19px', fontWeight: '800' }}>Rotasi &amp; Penjadwalan Kru (Rotation Planner)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-400)', marginTop: '2px' }}>Manajemen Sign-ON / Sign-OFF, mutasi, dan monitoring kesiapan awak kapal</div>
        </div>
        {userRole === 'Admin' && (
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <i className="fa fa-plus"></i> Rencanakan Rotasi
          </button>
        )}
      </div>

      {/* Gap Analysis Alerts Box */}
      {gapAlerts.length > 0 && (
        <div id="gap-alerts" className="mb14">
          <div className="alert alert-danger">
            <i className="fa fa-triangle-exclamation text-xl" style={{ color: 'var(--danger)' }}></i>
            <div>
              <strong style={{ fontSize: '13px' }} className="block mb-1">ANALISIS GAP CREWING — POSISI CRITICAL KOSONG!</strong>
              <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-red-200">
                {gapAlerts.map((alert, idx) => (
                  <li key={idx}>
                    Kapal <strong>{alert.vesselName}</strong> terdeteksi tidak memiliki <strong>{alert.missingRank}</strong> onboard yang bertugas aktif! Segera lakukan penempatan/Sign-ON crew.
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="card mb14">
        <div className="ct"><i className="fa fa-columns text-neon"></i> Papan Penjadwalan Awak Kapal</div>

        <div className="kanban">
          {/* Column 1: Planned (Rencana Sign-On) */}
          <div className="kc">
            <div className="kc-head">
              <span>Sign-ON Terencana</span>
              <span className="nbadge" style={{ background: 'var(--warning)', color: '#000' }}>
                {rotations.filter((r) => r.status === 'planned').length}
              </span>
            </div>
            {rotations.filter((r) => r.status === 'planned').map((r) => (
              <div className="kcard" key={r.id} onClick={() => userRole === 'Admin' && handleDeleteRotation(r.id)}>
                <div className="kn text-white">{getCrewName(r.crew)}</div>
                <div className="kr">{r.rank}</div>
                <div className="ks text-cyan-300 font-semibold">{getVesselName(r.vessel)}</div>
                <div className="kd"><i className="fa fa-calendar-check mr-1 text-zinc-500"></i> ON: {r.signOn}</div>
                <div className="text-[9px] text-[#ff6b35] mt-1"><i className="fa fa-location-arrow"></i> Pelabuhan: {r.port || 'Surabaya'}</div>
                {userRole === 'Admin' && <div className="text-[8px] text-red-400 mt-2 text-right hover:underline">Hapus jadwal</div>}
              </div>
            ))}
          </div>

          {/* Column 2: En Route (Mobilisasi / Menuju Kapal) */}
          <div className="kc">
            <div className="kc-head">
              <span>Dalam Perjalanan (En Route)</span>
              <span className="nbadge" style={{ background: 'var(--neon)', color: '#000' }}>
                {rotations.filter((r) => r.status === 'enroute').length}
              </span>
            </div>
            {rotations.filter((r) => r.status === 'enroute').map((r) => (
              <div className="kcard" key={r.id} onClick={() => userRole === 'Admin' && handleDeleteRotation(r.id)}>
                <div className="kn text-white">{getCrewName(r.crew)}</div>
                <div className="kr">{r.rank}</div>
                <div className="ks text-cyan-300 font-semibold">{getVesselName(r.vessel)}</div>
                <div className="kd"><i className="fa fa-plane mr-1 text-zinc-500"></i> Tiket Ok / Transit</div>
                {userRole === 'Admin' && <div className="text-[8px] text-red-400 mt-2 text-right hover:underline">Hapus jadwal</div>}
              </div>
            ))}
          </div>

          {/* Column 3: Onboard (Aktif Dinas) */}
          <div className="kc">
            <div className="kc-head">
              <span>Aktif Dinas (Onboard)</span>
              <span className="nbadge" style={{ background: 'var(--success)' }}>
                {crew.filter((c) => c.status === 'onboard').length}
              </span>
            </div>
            {/* Map direct active onboard crew for visual clarity on current crew statuses */}
            {crew.filter((c) => c.status === 'onboard').slice(0, 12).map((c) => (
              <div className="kcard" style={{ borderLeft: '3px solid var(--success)' }} key={c.id}>
                <div className="kn text-white">{c.name}</div>
                <div className="kr">{c.rank}</div>
                <div className="ks text-teal-400 font-semibold">{getVesselName(c.vessel)}</div>
                <div className="kd"><i className="fa fa-anchor mr-1 text-zinc-500"></i> Aktif di Kapal</div>
              </div>
            ))}
          </div>

          {/* Column 4: Leave (Cuti / Sign-Off) */}
          <div className="kc">
            <div className="kc-head">
              <span>Cuti / Peristirahatan</span>
              <span className="nbadge" style={{ background: 'var(--text-600)' }}>
                {crew.filter((c) => c.status === 'leave' || c.status === 'standby').length}
              </span>
            </div>
            {crew.filter((c) => c.status === 'leave' || c.status === 'standby').map((c) => (
              <div className="kcard" style={{ borderLeft: '3px solid var(--text-600)' }} key={c.id}>
                <div className="kn text-white">{c.name}</div>
                <div className="kr">{c.rank}</div>
                <div className="ks text-zinc-500">{c.status === 'leave' ? 'Cuti Pribadi' : 'Standby Pool'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rotation Add Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-calendar-days"></i> Rencanakan Jadwal Rotasi Awak
          </div>

          <form onSubmit={handleSave}>
            <div className="fg">
              <label className="fl">Pilih Awak Pelaut *</label>
              <select className="fs" value={formCrewId} onChange={(e) => setFormCrewId(e.target.value)}>
                {crew.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.rank} — {c.status})</option>
                ))}
              </select>
            </div>

            <div className="fg">
              <label className="fl">Pilih Kapal Penempatan *</label>
              <select className="fs" value={formVesselId} onChange={(e) => setFormVesselId(e.target.value)}>
                <option value="">[Bebas / Standby Pool]</option>
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Tanggal Sign-ON (Dinas)</label>
                <input
                  type="date"
                  className="fi"
                  value={formSignOn}
                  onChange={(e) => setFormSignOn(e.target.value)}
                />
              </div>
              <div>
                <label className="fl">Tanggal Estimasi Sign-OFF</label>
                <input
                  type="date"
                  className="fi"
                  value={formSignOff}
                  onChange={(e) => setFormSignOff(e.target.value)}
                />
              </div>
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Pelabuhan Naik Kapal</label>
                <input
                  type="text"
                  className="fi"
                  value={formPort}
                  onChange={(e) => setFormPort(e.target.value)}
                  placeholder="Contoh: Samarinda"
                />
              </div>
              <div>
                <label className="fl">Status Mobilisasi</label>
                <select className="fs" value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)}>
                  <option value="planned">Rencana Sign-On (Planned)</option>
                  <option value="enroute">Dalam Perjalanan (En Route)</option>
                  <option value="onboard">Dinas Aktif Onboard</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">Simpan Jadwal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
