import React, { useState } from 'react';
import { Vessel, Voyage } from '../types';

interface OperationsPageProps {
  voyages: Voyage[];
  setVoyages: React.Dispatch<React.SetStateAction<Voyage[]>>;
  vessels: Vessel[];
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
  userRole: string;
}

export const OperationsPage: React.FC<OperationsPageProps> = ({
  voyages,
  setVoyages,
  vessels,
  toast,
  userRole,
}) => {
  const [filterVessel, setFilterVessel] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null);

  // Form Fields State
  const [formVesselId, setFormVesselId] = useState('');
  const [formNo, setFormNo] = useState('');
  const [formFrom, setFormFrom] = useState('');
  const [formTo, setFormTo] = useState('');
  const [formCargo, setFormCargo] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEta, setFormEta] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'port' | 'planned' | 'completed'>('active');

  const openAddModal = () => {
    if (vessels.length === 0) {
      toast('Tambah kapal ke armada terlebih dahulu!', 'd');
      return;
    }
    setEditingVoyage(null);
    setFormVesselId(vessels[0].id);
    setFormNo(`V${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`);
    setFormFrom('Samarinda');
    setFormTo('Surabaya');
    setFormCargo('Sirtu / Alat Berat');
    setFormQty('1.500 MT');
    setFormStart(new Date().toISOString().substring(0, 16));
    setFormEta(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16));
    setFormStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (vy: Voyage) => {
    setEditingVoyage(vy);
    setFormVesselId(vy.vessel);
    setFormNo(vy.no);
    setFormFrom(vy.from);
    setFormTo(vy.to);
    setFormCargo(vy.cargo);
    setFormQty(vy.qty);
    setFormStart(vy.start);
    setFormEta(vy.eta);
    setFormStatus(vy.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNo.trim() || !formFrom.trim() || !formTo.trim()) {
      toast('Mohon lengkapi semua file isian wajib!', 'd');
      return;
    }

    if (editingVoyage) {
      setVoyages((prev) =>
        prev.map((v) =>
          v.id === editingVoyage.id
            ? {
                ...v,
                vessel: formVesselId,
                no: formNo,
                from: formFrom,
                to: formTo,
                cargo: formCargo,
                qty: formQty,
                start: formStart,
                eta: formEta,
                status: formStatus,
              }
            : v
        )
      );
      toast(`Pelayaran ${formNo} berhasil diubah`, 's');
    } else {
      const newVoyage: Voyage = {
        id: `vy_${Date.now()}`,
        vessel: formVesselId,
        no: formNo,
        from: formFrom,
        to: formTo,
        cargo: formCargo,
        qty: formQty,
        start: formStart,
        eta: formEta,
        status: formStatus,
      };
      setVoyages((prev) => [...prev, newVoyage]);
      toast(`Voyage ${formNo} untuk kapal tujuan ${formTo} berhasil dijadwalkan`, 's');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, no: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal voyage ${no}?`)) {
      setVoyages((prev) => prev.filter((v) => v.id !== id));
      toast(`Jadwal pelayaran ${no} berhasil dihapus`, 's');
    }
  };

  const filteredVoyages = voyages.filter((v) => {
    return filterVessel === 'all' || v.vessel === filterVessel;
  });

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '19px', fontWeight: '800' }}>Sistem Operasi Kapal &amp; Pelayaran (Voyages)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-400)', marginTop: '2px' }}>Monitoring rute, muatan, waktu keberangkatan, dan ETA LCT</div>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="fa fa-plus"></i> Jadwalkan Pelayaran
        </button>
      </div>

      {/* Grid of Map and Vessel Filter */}
      <div className="g g31 mb14">
        {/* Indonesian waterway simulated tracker */}
        <div className="card map-box" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--glass-border2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono text-neon font-semibold text-xs"><i className="fa fa-radar text-neon"></i> RADAR POSISI REAL-TIME (AIS EMBEDDED)</span>
            <span className="badge badge-success text-[10px]">CORS LIVE BYPASS OK</span>
          </div>
          {/* Glassmorphic simulation of Indonesia sea mapping */}
          <div style={{ height: '240px', background: '#010813', position: 'relative', overflow: 'hidden' }}>
            {/* Visual background lines to represent longitude - latitude */}
            <div className="absolute inset-0 opacity-10 flex flex-col justify-between p-4 font-mono text-[9px] text-[#00d4ff] pointer-events-none">
              <div>LAT 0°48' S // LON 117°09' E</div>
              <div>LAT 5°30' S // LON 112°12' E</div>
            </div>
            {/* Dots */}
            {vessels.map((v, i) => {
              // Simulated random coordinates
              const positions = [
                { top: '35%', left: '55%' }, // Makassar Strait
                { top: '75%', left: '40%' }, // Java sea
                { top: '25%', left: '48%' }, // East Kalimantan
                { top: '65%', left: '30%' }, // Surabaya out
              ];
              const pos = positions[i % positions.length];
              return (
                <div
                  key={v.id}
                  className="absolute cursor-pointer group"
                  style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                  onClick={() => toast(`Koordinat Satelit ${v.name}: Terlacak di perairan! Status: ${v.status}`, 'i')}
                >
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-cyan-500 rounded-full border border-white relative z-10"></div>
                  <div className="absolute left-4 -top-2 bg-slate-900/90 border border-slate-700 p-1 rounded text-[9px] whitespace-nowrap hidden group-hover:block z-20">
                    <span className="font-bold text-white">{v.name}</span><br />
                    <span>LOKASI: {v.location}</span>
                  </div>
                </div>
              );
            })}
            <div className="absolute bottom-3 left-3 bg-[#071630]/80 border border-[rgba(0,180,255,0.2)] px-2 py-1 rounded text-[10px] backdrop-blur text-cyan-300">
              <i className="fa fa-circle-info text-neon mr-1"></i> Klik dot kapal untuk data radar koordinat langsung
            </div>
          </div>
        </div>

        {/* Vessel filters card */}
        <div className="card">
          <div className="ct"><i className="fa fa-filter text-orange"></i> Filter Kapal</div>
          <div className="fg">
            <select className="fs" value={filterVessel} onChange={(e) => setFilterVessel(e.target.value)}>
              <option value="all">Semua Kapal armada</option>
              {vessels.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="text-muted text-[11px] leading-relaxed mt12" style={{ borderTop: '1px solid var(--glass-border2)', paddingTop: '10px' }}>
            <p className="font-semibold text-white mb-1">Standard Operating Procedure:</p>
            Semua rencana rute pelayaran wajib disetujui DPA, diuji STCW crew kelahirannya, serta dikoordinasikan dengan Syahbandar pelabuhan pangkal.
          </div>
        </div>
      </div>

      {/* Voyages Table */}
      <div className="card">
        <div className="ct"><i className="fa fa-list text-neon"></i> Registrasi Voyage Pelayaran</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Vessel</th>
                <th>No Voyage</th>
                <th>Keberangkatan (From)</th>
                <th>Tujuan (To)</th>
                <th>Muatan (Cargo)</th>
                <th>Waktu Berangkat</th>
                <th>Waktu ETA</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredVoyages.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-600)', padding: '20px' }}>
                    Belum ada pelayaran terjadwal untuk filter ini
                  </td>
                </tr>
              ) : (
                filteredVoyages.map((vy) => {
                  const ves = vessels.find((v) => v.id === vy.vessel);
                  return (
                    <tr key={vy.id}>
                      <td className="font-semibold text-white">{ves ? ves.name : '—'}</td>
                      <td className="mono font-semibold" style={{ color: 'var(--neon)' }}>{vy.no}</td>
                      <td>{vy.from}</td>
                      <td>{vy.to}</td>
                      <td>{vy.cargo} <span className="text-muted">({vy.qty})</span></td>
                      <td className="mono text-xs">{vy.start.replace('T', ' ')}</td>
                      <td className="mono text-xs text-orange font-semibold">{vy.eta.replace('T', ' ')}</td>
                      <td>
                        <span
                          className={`badge ${
                            vy.status === 'active'
                              ? 'badge-success'
                              : vy.status === 'port'
                              ? 'badge-info'
                              : vy.status === 'planned'
                              ? 'badge-warning'
                              : 'badge-muted'
                          }`}
                        >
                          {vy.status === 'active'
                            ? 'Pelayaran'
                            : vy.status === 'port'
                            ? 'Di Pelabuhan'
                            : vy.status === 'planned'
                            ? 'Rencana'
                            : 'Selesai'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <button className="btn btn-ghost btn-xs" onClick={() => openEditModal(vy)}>
                            <i className="fa fa-pen"></i> Update
                          </button>
                          <button className="btn btn-danger btn-xs" onClick={() => handleDelete(vy.id, vy.no)}>
                            <i className="fa fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voyage Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-map-location-dot"></i>
            {editingVoyage ? `Form Update Voyage: ${editingVoyage.no}` : 'Jadwalkan Voyage Pelayaran'}
          </div>

          <form onSubmit={handleSave}>
            <div className="fg">
              <label className="fl">Kapal Armada *</label>
              <select className="fs" value={formVesselId} onChange={(e) => setFormVesselId(e.target.value)}>
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="fg">
              <label className="fl">Nomor Voyage *</label>
              <input
                type="text"
                className="fi"
                value={formNo}
                onChange={(e) => setFormNo(e.target.value.toUpperCase())}
                placeholder="Contoh: V2025-042"
                required
              />
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Pelabuhan Muat (From) *</label>
                <input
                  type="text"
                  className="fi"
                  value={formFrom}
                  onChange={(e) => setFormFrom(e.target.value)}
                  placeholder="Contoh: Samarinda"
                  required
                />
              </div>
              <div>
                <label className="fl">Pelabuhan Bongkar (To) *</label>
                <input
                  type="text"
                  className="fi"
                  value={formTo}
                  onChange={(e) => setFormTo(e.target.value)}
                  placeholder="Contoh: Makassar"
                  required
                />
              </div>
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Jenis Cargo (Muatan)</label>
                <input
                  type="text"
                  className="fi"
                  value={formCargo}
                  onChange={(e) => setFormCargo(e.target.value)}
                  placeholder="Contoh: Batu split / Alat berat"
                />
              </div>
              <div>
                <label className="fl">Kapasitas (Volume/Jumlah)</label>
                <input
                  type="text"
                  className="fi"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  placeholder="Contoh: 1.200 MT"
                />
              </div>
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Waktu Keberangkatan (ETD)</label>
                <input
                  type="datetime-local"
                  className="fi"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                />
              </div>
              <div>
                <label className="fl">Prediksi Tiba (ETA)</label>
                <input
                  type="datetime-local"
                  className="fi"
                  value={formEta}
                  onChange={(e) => setFormEta(e.target.value)}
                />
              </div>
            </div>

            <div className="fg">
              <label className="fl">Status Pelayaran</label>
              <select className="fs" value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)}>
                <option value="planned">Planned (Terencana)</option>
                <option value="active">Active On Route (Pelayaran)</option>
                <option value="port">In Port (Berlabuh/Bongkar Muat)</option>
                <option value="completed">Completed (Selesai Pelayaran)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">{editingVoyage ? 'Update Pelayaran' : 'Jadwalkan Voyage'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
