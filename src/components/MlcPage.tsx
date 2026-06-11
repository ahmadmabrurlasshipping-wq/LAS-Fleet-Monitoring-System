import React, { useState } from 'react';
import { MlcLog, CrewMember, Vessel } from '../types';

interface MlcPageProps {
  mlcLogs: MlcLog[];
  setMlcLogs: React.Dispatch<React.SetStateAction<MlcLog[]>>;
  crew: CrewMember[];
  vessels: Vessel[];
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
  userRole: string;
}

export const MlcPage: React.FC<MlcPageProps> = ({
  mlcLogs,
  setMlcLogs,
  crew,
  vessels,
  toast,
  userRole,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields State
  const [formCrewId, setFormCrewId] = useState('');
  const [formVesselId, setFormVesselId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formHours, setFormHours] = useState(8);
  const [formRest, setFormRest] = useState(16);
  const [formNotes, setFormNotes] = useState('');

  const onboardCrew = crew.filter((c) => c.status === 'onboard');

  const handleOpenAddModal = () => {
    if (onboardCrew.length === 0) {
      toast('Belum ada crew yang bertugas onboard (status Di Kapal)!', 'd');
      return;
    }
    setFormCrewId(onboardCrew[0].id);
    setFormVesselId(onboardCrew[0].vessel);
    setFormDate(new Date().toISOString().substring(0, 10));
    setFormHours(8);
    setFormRest(16);
    setFormNotes('Dinas jaga rutin tanpa kendala');
    setIsModalOpen(true);
  };

  const handleCrewChange = (id: string) => {
    setFormCrewId(id);
    const selected = crew.find((c) => c.id === id);
    if (selected && selected.vessel) {
      setFormVesselId(selected.vessel);
    }
  };

  const handleWorkHoursChange = (h: number) => {
    setFormHours(h);
    // Auto calculate rest hours in a 24-hour cycle
    const rest = Math.max(0, 24 - h);
    setFormRest(rest);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCrewId || !formDate) {
      toast('Isian nama pelaut dan tanggal wajib diisi!', 'd');
      return;
    }

    const selectedCrew = crew.find((c) => c.id === formCrewId);

    const newLog: MlcLog = {
      id: `mlc_${Date.now()}`,
      crew: formCrewId,
      vessel: formVesselId,
      date: formDate,
      hours: Number(formHours),
      rest: Number(formRest),
      notes: formNotes,
    };

    setMlcLogs((prev) => [newLog, ...prev]);

    // Check for MLC violation immediately for user feedback
    if (formRest < 10) {
      toast(`LOG TERSIMPAN: Terdeteksi Pelanggaran MLC! Pelaut ${selectedCrew?.name} istirahat kurang dari 10 Jam.`, 'd');
    } else {
      toast(`Log jam kerja ${selectedCrew?.name} disimpan`, 's');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus entri jam kerja/istirahat ini?')) {
      setMlcLogs((prev) => prev.filter((l) => l.id !== id));
      toast('Log dihapus', 'w');
    }
  };

  const getCrewName = (id: string) => {
    const c = crew.find((x) => x.id === id);
    return c ? c.name : 'PELAUT UMUM';
  };

  const getVesselName = (id: string) => {
    const v = vessels.find((x) => x.id === id);
    return v ? v.name : '—';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '19px', fontWeight: '800' }}>Kepatuhan Jam Kerja &amp; Istirahat (MLC 2006 Rules)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-400)', marginTop: '2px' }}>Monitoring kesehatan fisik pelaut regulasi minimum istirahat 10 jam / 24 jam</div>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <i className="fa fa-pencil-square"></i> Log Jam Kerja Awak
        </button>
      </div>

      {/* MLC Rule Quick Info Card */}
      <div className="card mb14 bg-[rgba(0,40,100,0.2)]" style={{ border: '1px solid rgba(0,212,255,0.25)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <i className="fa fa-circle-info text-2xl text-cyan-400" style={{ marginTop: '2px' }}></i>
          <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <strong className="text-white">STANDAR FATIGUE PROTECTION (MLC 2006 Standard)</strong><br />
            1. Jumlah jam istirahat tidak boleh kurang dari <strong>10 Jam</strong> dalam periode 24 Jam.<br />
            2. Jam istirahat dapat dibagi maksimal menjadi 2 bar, di mana salah satu bar minimal <strong>6 Jam</strong>, jarak istirahat tidak melebihi 14 Jam.<br />
            <span className="text-red-400 font-semibold mt-1 block"><i className="fa fa-triangle-exclamation"></i> Sistem akan secara otomatis mendeteksi dan memberi bendera merah untuk log yang melanggar aturan ini!</span>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="ct"><i className="fa fa-clock-rotate-left text-neon"></i> Jam Kerja/Istirahat Terdaftar</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Tanggal Log</th>
                <th>Nama Pelaut (Crew)</th>
                <th>Kapal Penempatan</th>
                <th>Jam Kerja</th>
                <th>Jam Istirahat</th>
                <th>Kondisi MLC</th>
                <th>Catatan Kerja</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mlcLogs.map((log) => {
                const isViolation = log.rest < 10;
                return (
                  <tr key={log.id}>
                    <td className="mono text-white font-semibold">{log.date}</td>
                    <td className="font-semibold text-cyan-300">{getCrewName(log.crew)}</td>
                    <td>{getVesselName(log.vessel)}</td>
                    <td className="mono font-semibold">{log.hours} Jam</td>
                    <td className="mono font-semibold" style={{ color: isViolation ? 'var(--danger)' : 'var(--success)' }}>
                      {log.rest} Jam
                    </td>
                    <td>
                      <span className={`badge ${isViolation ? 'badge-danger' : 'badge-success'}`}>
                        {isViolation ? 'PELANGGARAN' : 'COMPLIANT'}
                      </span>
                    </td>
                    <td className="text-zinc-400 text-xs italic">{log.notes || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDelete(log.id)}>
                        <i className="fa fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MLC Log Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-business-time"></i> Catat Log Jam Istirahat Pelaut
          </div>

          <form onSubmit={handleSave}>
            <div className="fg">
              <label className="fl">Pilih Crew (Hanya Onboard) *</label>
              <select className="fs" value={formCrewId} onChange={(e) => handleCrewChange(e.target.value)}>
                {onboardCrew.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.rank} — {getVesselName(c.vessel)})</option>
                ))}
              </select>
            </div>

            <div className="fg">
              <label className="fl">Tanggal Log Jam Kerja *</label>
              <input
                type="date"
                className="fi"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
              />
            </div>

            <div className="frow fg">
              <div>
                <label className="fl">Jam Kerja (Dalam 24 Jam)</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  className="fi"
                  value={formHours}
                  onChange={(e) => handleWorkHoursChange(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="fl">Jam Istirahat (Auto-Calc)</label>
                <input
                  type="number"
                  className="fi text-zinc-500 font-bold bg-black/50 cursor-not-allowed"
                  value={formRest}
                  disabled
                />
              </div>
            </div>

            <div className="fg">
              <label className="fl">Keterangan Aktivitas Jaga/Kerja</label>
              <input
                type="text"
                className="fi"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Contoh: Bongkar muatan semen, jaga laut..."
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">Simpan Log Jam</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
