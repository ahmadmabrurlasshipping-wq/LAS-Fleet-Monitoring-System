import React, { useState } from 'react';
import { Incident, Vessel } from '../types';

interface IncidentPageProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  vessels: Vessel[];
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
  userRole: string;
}

export const IncidentPage: React.FC<IncidentPageProps> = ({
  incidents,
  setIncidents,
  vessels,
  toast,
  userRole,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formVesselId, setFormVesselId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formType, setFormType] = useState('Near-Miss');
  const [formSeverity, setFormSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formAction, setFormAction] = useState('');
  const [formStatus, setFormStatus] = useState('investigating');

  const openAddModal = () => {
    setFormVesselId(vessels.length > 0 ? vessels[0].id : '');
    setFormDate(new Date().toISOString().substring(0, 10));
    setFormType('Near-Miss');
    setFormSeverity('low');
    setFormDescription('');
    setFormLocation('Area Rampdoor / Dek Kapal');
    setFormAction('');
    setFormStatus('investigating');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) {
      toast('Deskripsi insiden wajib diisi!', 'd');
      return;
    }

    const newIncident: Incident = {
      id: `inc_${Date.now()}`,
      vessel: formVesselId,
      date: formDate,
      type: formType,
      severity: formSeverity,
      description: formDescription,
      location: formLocation,
      action: formAction,
      status: formStatus,
      investigator: 'Ahmad Mabrur',
    };

    setIncidents((prev) => [newIncident, ...prev]);
    toast('Laporan K3 / Insiden berhasil disimpan dalam registri', 's');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan insiden ini?')) {
      setIncidents((prev) => prev.filter((i) => i.id !== id));
      toast('Laporan dihapus', 'w');
    }
  };

  const getVesselName = (id: string) => {
    const v = vessels.find((x) => x.id === id);
    return v ? v.name : '—';
  };

  const severityMap = {
    critical: { label: 'CRITICAL (BAHAYA)', color: 'badge-danger' },
    high: { label: 'HIGH (TINGGI)', color: 'badge-danger' },
    medium: { label: 'MEDIUM (SEDANG)', color: 'badge-warning' },
    low: { label: 'LOW (NEAR-MISS)', color: 'badge-info' },
  };

  const statusMap = {
    investigating: { label: 'Investigasi', color: 'badge-danger' },
    review: { label: 'Dalam Review DPA', color: 'badge-warning' },
    resolved: { label: 'Resolved / Selesai', color: 'badge-success' },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '19px', fontWeight: '800' }}>Registri Insiden &amp; K3 Pelayaran (HSE Logs)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-400)', marginTop: '2px' }}>Perekaman near-miss, tindakan pencegahan kecelakaan kerja kapal (ISPS/MLC)</div>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="fa fa-triangle-exclamation"></i> Buat Laporan HSE
        </button>
      </div>

      {/* Incident List */}
      <div className="card">
        <div className="ct"><i className="fa fa-clipboard-list text-neon"></i> Laporan Aktivitas K3 &amp; Keselamatan</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Tanggal Kejadian</th>
                <th>Nama Kapal</th>
                <th>Kategori Insiden</th>
                <th>Tingkat Keparahan</th>
                <th>Lokasi Kejadian</th>
                <th>Kronologi Singkat / Deskripsi</th>
                <th>Tindakan Korektif</th>
                <th>Status Audit</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-600)', padding: '20px' }}>
                    Sempurna! Tidak ada laporan insiden terlacak dalam navigasi.
                  </td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td className="mono text-white font-semibold">{inc.date}</td>
                    <td className="text-cyan-400 font-semibold">{getVesselName(inc.vessel)}</td>
                    <td className="font-semibold">{inc.type}</td>
                    <td>
                      <span className={`badge ${severityMap[inc.severity]?.color || 'badge-muted'}`}>
                        {severityMap[inc.severity]?.label || inc.severity}
                      </span>
                    </td>
                    <td>{inc.location || '—'}</td>
                    <td className="text-xs max-w-[200px] break-words text-zinc-300 leading-relaxed font-sans">{inc.description}</td>
                    <td className="text-xs max-w-[180px] break-words italic text-emerald-300">{inc.action || 'Dalam Investigasi'}</td>
                    <td>
                      <span className={`badge ${statusMap[inc.status as keyof typeof statusMap]?.color || 'badge-muted'}`}>
                        {statusMap[inc.status as keyof typeof statusMap]?.label || inc.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDelete(inc.id)}>
                        <i className="fa fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HSE Form Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-fire-extinguisher"></i> Catat Laporan Insiden K3 Kapal
          </div>

          <form onSubmit={handleSave}>
            <div className="fg">
              <label className="fl">Kapal Armada Terkait *</label>
              <select className="fs" value={formVesselId} onChange={(e) => setFormVesselId(e.target.value)}>
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Kategori Insiden</label>
                <select className="fs" value={formType} onChange={(e) => setFormType(e.target.value)}>
                  <option value="Near-Miss">Near-Miss (Hampir Celaka)</option>
                  <option value="Accident">Accident (Kecelakaan Kerja)</option>
                  <option value="Damage">Damage (Kerusakan Struktur Kapal)</option>
                  <option value="Pollution">Pencemaran Lingkungan Laut</option>
                </select>
              </div>
              <div>
                <label className="fl">Tingkat Keparahan *</label>
                <select className="fs" value={formSeverity} onChange={(e) => setFormSeverity(e.target.value as any)}>
                  <option value="low">Low Severity (Hampir Celaka)</option>
                  <option value="medium">Medium Severity (Luka Ringan/Kerusakan Kecil)</option>
                  <option value="high">High Severity (Luka Berat/Lumpuh)</option>
                  <option value="critical">Critical / Major (Kematian/Kapal Tenggelam)</option>
                </select>
              </div>
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Tanggal Kejadian *</label>
                <input
                  type="date"
                  className="fi"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="fl">Lokasi Spesifik Kejadian</label>
                <input
                  type="text"
                  className="fi"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Contoh: Rampdoor LCT / Kamar Mesin"
                />
              </div>
            </div>

            <div className="fg">
              <label className="fl">Kronologi Singkat / Deskripsi Kejadian *</label>
              <textarea
                className="fta"
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Jelaskan secara runtut kejadian/aktivitas saat insiden terjadi..."
                required
              ></textarea>
            </div>

            <div className="fg">
              <label className="fl">Tindakan Korektif (Corrective Action Taken)</label>
              <input
                type="text"
                className="fi"
                value={formAction}
                onChange={(e) => setFormAction(e.target.value)}
                placeholder="Contoh: Menghentikan seketika rampdoor lift, melumasi seling rampdoor..."
              />
            </div>

            <div className="fg">
              <label className="fl">Status Pelaporan</label>
              <select className="fs" value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                <option value="investigating">Mengumpulkan bukti (Investigasi)</option>
                <option value="review">Menunggu Review DPA / Kantor Cabang</option>
                <option value="resolved">Resolved (Tindakan Pencegahan Selesai)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">Simpan Laporan HSE</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
