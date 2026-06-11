import React, { useState } from 'react';
import { PayrollEntry, CrewMember, Vessel } from '../types';

interface PayrollPageProps {
  payroll: PayrollEntry[];
  setPayroll: React.Dispatch<React.SetStateAction<PayrollEntry[]>>;
  crew: CrewMember[];
  vessels: Vessel[];
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
  userRole: string;
}

export const PayrollPage: React.FC<PayrollPageProps> = ({
  payroll,
  setPayroll,
  crew,
  vessels,
  toast,
  userRole,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlip, setActiveSlip] = useState<PayrollEntry | null>(null);

  // Form (Add New Slip) State
  const [formCrewId, setFormCrewId] = useState('');
  const [formVesselId, setFormVesselId] = useState('');
  const [formMonth, setFormMonth] = useState('2026-04');
  const [formGajiPokok, setFormGajiPokok] = useState(8000000);
  const [formGajiAktual, setFormGajiAktual] = useState(8000000);
  const [formTambahanKenaikan, setFormTambahanKenaikan] = useState(0);
  const [formTunjanganOps, setFormTunjanganOps] = useState(2000000);
  const [formTambahanLain, setFormTambahanLain] = useState(0);
  const [formHariAktif, setFormHariAktif] = useState(30);
  const [formPenguranganOff, setFormPenguranganOff] = useState(0);
  const [formPotonganPPh21, setFormPotonganPPh21] = useState(0);
  const [formPotonganMcu, setFormPotonganMcu] = useState(0);
  const [formKeterangan, setFormKeterangan] = useState('');

  // Currency Formatter
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const handleOpenAddModal = () => {
    if (crew.length === 0) {
      toast('Tambah data kru di direktori terlebih dahulu!', 'd');
      return;
    }
    setFormCrewId(crew[0].id);
    setFormVesselId(crew[0].vessel || (vessels.length > 0 ? vessels[0].id : ''));
    setFormMonth('2026-04');
    setFormGajiPokok(8000000);
    setFormGajiAktual(8000000);
    setFormTambahanKenaikan(0);
    setFormTunjanganOps(2000000);
    setFormTambahanLain(0);
    setFormHariAktif(30);
    setFormPenguranganOff(0);
    setFormPotonganPPh21(150000);
    setFormPotonganMcu(0);
    setFormKeterangan('');
    setIsModalOpen(true);
  };

  const handleCrewSelection = (id: string) => {
    setFormCrewId(id);
    const selected = crew.find((c) => c.id === id);
    if (selected) {
      setFormVesselId(selected.vessel);
      // Mock pre-fills basic salary based on Rank
      let salary = 8000000;
      let ops = 2000000;
      if (selected.rank === 'Nakhoda') {
        salary = 16500000;
        ops = 7000000;
      } else if (selected.rank === 'KKM') {
        salary = 12500000;
        ops = 4000000;
      } else if (selected.rank === 'Mualim I' || selected.rank === 'Masinis II') {
        salary = 9500000;
        ops = 2000000;
      }
      setFormGajiPokok(salary);
      setFormGajiAktual(salary);
      setFormTunjanganOps(ops);
    }
  };

  const handleCreateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCrewId) {
      toast('Pilih crew penerima gaji!', 'd');
      return;
    }

    // Formulas
    const totalGaji = Number(formGajiAktual) + Number(formTunjanganOps) + Number(formTambahanLain) - Number(formPenguranganOff);

    // BPJS formulas (PT. LAS parameters)
    const bpjsKes = Math.round(Math.min(formGajiPokok * 0.01, 85000));
    const bpjsTK = Math.round(formGajiPokok * 0.02);

    const netPay = totalGaji - bpjsKes - bpjsTK - Number(formPotonganPPh21) - Number(formPotonganMcu);

    const newPay: PayrollEntry = {
      id: `pay_${Date.now()}`,
      crewId: formCrewId,
      vesselId: formVesselId,
      month: formMonth,
      gajiPokok: Number(formGajiPokok),
      gajiAktual: Number(formGajiAktual),
      tambahanKenaikan: Number(formTambahanKenaikan),
      tunjanganOps: Number(formTunjanganOps),
      tambahanLain: Number(formTambahanLain),
      hariAktif: Number(formHariAktif),
      penguranganOff: Number(formPenguranganOff),
      totalGaji: totalGaji,
      bpjsKes: bpjsKes,
      bpjsTK: bpjsTK,
      potonganPPh21: Number(formPotonganPPh21),
      potonganMCU: Number(formPotonganMcu),
      gajiBersih: netPay,
      rekening: '0255' + Math.floor(100000 + Math.random() * 900000),
      bank: 'BNI',
      keterangan: formKeterangan,
    };

    setPayroll((prev) => [newPay, ...prev]);
    toast(`Slip gaji berhasil di-generate untuk bulan ${formMonth}`, 's');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin membatalkan & menghapus slip gaji ${name}?`)) {
      setPayroll((prev) => prev.filter((p) => p.id !== id));
      toast('Slip gaji dihapus', 'w');
    }
  };

  const getCrewDetails = (id: string) => {
    const c = crew.find((x) => x.id === id);
    return c ? { name: c.name, rank: c.rank } : { name: 'Unknown', rank: '—' };
  };

  const getVesselName = (id: string) => {
    const v = vessels.find((x) => x.id === id);
    return v ? v.name : '—';
  };

  const filteredPayroll = payroll.filter((p) => {
    const details = getCrewDetails(p.crewId);
    return details.name.toLowerCase().includes(search.toLowerCase()) || p.month.includes(search);
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '19px', fontWeight: '800' }}>Administrasi Penggajian Crew (Payroll)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-400)', marginTop: '2px' }}>Kalkulasi BPJS, pengeluaran PPh 21, potongan MCU, dan pembuatan slip gaji digital</div>
        </div>
        {userRole === 'Admin' && (
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <i className="fa fa-calculator"></i> Hitung Gaji Baru
          </button>
        )}
      </div>

      {/* Filter and Overview */}
      <div className="card mb14" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="tb-search" style={{ border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', width: '280px' }}>
            <i className="fa fa-magnifying-glass" style={{ color: 'var(--text-400)', fontSize: '12px' }}></i>
            <input
              type="text"
              placeholder="Cari nama kru atau bulan (YYYY-MM)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="text-[12px] text-zinc-400">
            Total Pengeluaran Bulan Ini: <strong className="text-emerald-400 font-mono text-[14px]">
              {formatIDR(filteredPayroll.reduce((acc, curr) => acc + curr.gajiBersih, 0))}
            </strong>
          </div>
        </div>
      </div>

      {/* Slips Directory Table */}
      <div className="card mb14">
        <div className="ct"><i className="fa fa-receipt text-neon"></i> Slip Penerimaan Gaji Awak</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Nama Pelaut (Crew)</th>
                <th>Jabatan / Kapal</th>
                <th>Gaji Pokok</th>
                <th>Total Tunjangan / Tambahan</th>
                <th>Iuran BPJS (Kes + TK)</th>
                <th>Dipersihkan (Take Home Pay)</th>
                <th>Bank Rekening</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayroll.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-600)', padding: '20px' }}>
                    Belum ada slips penggajian di periode terpilih
                  </td>
                </tr>
              ) : (
                filteredPayroll.map((p) => {
                  const details = getCrewDetails(p.crewId);
                  const totalBPJS = (p.bpjsKes || 0) + (p.bpjsTK || 0);
                  const totalAdg = (p.tambahanKenaikan || 0) + (p.tunjanganOps || 0) + (p.tambahanLain || 0);

                  return (
                    <tr key={p.id}>
                      <td className="mono text-white font-semibold">{p.month}</td>
                      <td>
                        <div className="font-semibold text-white">{details.name}</div>
                        <span className="text-[10px] text-zinc-400">IDR Rekening BNI</span>
                      </td>
                      <td>
                        <div className="text-zinc-200 text-xs">{details.rank}</div>
                        <span className="text-[10px] text-cyan-400 font-semibold">{getVesselName(p.vesselId)}</span>
                      </td>
                      <td className="mono font-semibold">{formatIDR(p.gajiPokok)}</td>
                      <td className="mono text-emerald-400">+{formatIDR(totalAdg)}</td>
                      <td className="mono text-red-400">-{formatIDR(totalBPJS)}</td>
                      <td className="mono font-bold text-white text-xs bg-slate-900/40 px-2 py-1 rounded inline-block mt-1">
                        {formatIDR(p.gajiBersih)}
                      </td>
                      <td className="mono text-xs text-zinc-300">{p.bank} — {p.rekening}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <button className="btn btn-ghost btn-xs" onClick={() => setActiveSlip(p)}>
                            <i className="fa fa-print"></i> Slip
                          </button>
                          <button className="btn btn-danger btn-xs" onClick={() => handleDelete(p.id, details.name)}>
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

      {/* PDF / Digital Print Slip View Modal overlay */}
      {activeSlip && (
        <div className="modal-overlay show">
          <div className="modal modal-lg" style={{ background: '#030c1b', border: '2px solid var(--neon)' }}>
            <button className="modal-close" onClick={() => setActiveSlip(null)}>×</button>

            {/* PaySlip Header layout */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px dashed rgba(0,180,255,0.2)', paddingBottom: '14px', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }} className="text-black font-extrabold font-mono">
                LAS
              </div>
              <div>
                <strong className="text-white text-md">PT. Pelayaran Lestari Abadi Serasi</strong>
                <div style={{ fontSize: '10px', color: 'var(--text-400)', textTransform: 'uppercase' }}>OFFICIAL CREW PAYROLL SLIP — BULAN {activeSlip.month}</div>
              </div>
            </div>

            {/* Slip Details Grid */}
            <div className="g g2 mb14 text-[12px]">
              <div>
                <span className="text-zinc-500 block">Nama Penerima Gaji:</span>
                <strong className="text-white font-md">{getCrewDetails(activeSlip.crewId).name}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Jabatan / Kapal:</span>
                <strong className="text-cyan-400">{getCrewDetails(activeSlip.crewId).rank} — {getVesselName(activeSlip.vesselId)}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Bank Rekening Transfer:</span>
                <strong className="text-white uppercase font-mono">{activeSlip.bank} — {activeSlip.rekening}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Keterangan:</span>
                <strong className="text-zinc-300 italic">{activeSlip.keterangan || 'Gaji Bulanan Standard'}</strong>
              </div>
            </div>

            {/* Calculations items */}
            <div style={{ padding: '10px', background: '#020710', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', marginBottom: '6px', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-400)' }}>
                RINCIAN PENERIMAAN (ADDITIONS)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mb-2">
                <span>Gaji Pokok / Aktual</span>
                <span className="mono text-white">{formatIDR(activeSlip.gajiPokok)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mb-2">
                <span>Tunjangan Operasional Kapal</span>
                <span className="mono text-emerald-400">+{formatIDR(activeSlip.tunjanganOps)}</span>
              </div>
              {activeSlip.tambahanKenaikan ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mb-2">
                  <span>Tambahan Kenaikan Jabatan</span>
                  <span className="mono text-emerald-400">+{formatIDR(activeSlip.tambahanKenaikan)}</span>
                </div>
              ) : null}

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', margin: '10px 0 6px', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-400)' }}>
                RINCIAN POTONGAN (DEDUCTIONS)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mb-2">
                <span>Iuran BPJS Kesehatan (1% Karyawan)</span>
                <span className="mono text-red-400">-{formatIDR(activeSlip.bpjsKes || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mb-2">
                <span>Iuran BPJS TK (JHT)</span>
                <span className="mono text-red-400">-{formatIDR(activeSlip.bpjsTK || 0)}</span>
              </div>
              {activeSlip.potonganPPh21 ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mb-2">
                  <span>Potongan Pajak PPh 21</span>
                  <span className="mono text-red-400">-{formatIDR(activeSlip.potonganPPh21)}</span>
                </div>
              ) : null}
              {activeSlip.potonganMCU ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mb-2">
                  <span>Potongan Biaya MCU</span>
                  <span className="mono text-red-400">-{formatIDR(activeSlip.potonganMCU)}</span>
                </div>
              ) : null}
            </div>

            {/* Net Salary section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,212,255,0.1)', border: '1px solid var(--neon)', padding: '12px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }} className="text-white">TAKE HOME PAY (GAJI BERSIH)</div>
              <div style={{ fontSize: '20px', fontWeight: '800' }} className="text-cyan-400 mono">{formatIDR(activeSlip.gajiBersih)}</div>
            </div>

            {/* Print action buttons */}
            <div className="modal-actions" style={{ marginTop: '14px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => window.print()}><i className="fa fa-print"></i> Cetak Dokumen</button>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveSlip(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Calculate Salary Modal form overlay */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal modal-lg">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-calculator text-neon"></i> Form Pembuatan Slip Gaji Baru
          </div>

          <form onSubmit={handleCreateSlip}>
            <div className="g g2">
              <div className="fg">
                <label className="fl">Pilih Awak Penerima Gaji *</label>
                <select className="fs" value={formCrewId} onChange={(e) => handleCrewSelection(e.target.value)}>
                  <option value="">-- Pilih Pelaut --</option>
                  {crew.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.rank})</option>
                  ))}
                </select>
              </div>

              <div className="fg">
                <label className="fl">Kapal Bertugas *</label>
                <select className="fs" value={formVesselId} onChange={(e) => setFormVesselId(e.target.value)}>
                  {vessels.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="fg">
                <label className="fl">Gaji Pokok / Standard (IDR) *</label>
                <input
                  type="number"
                  className="fi"
                  value={formGajiPokok}
                  onChange={(e) => {
                    setFormGajiPokok(Number(e.target.value));
                    setFormGajiAktual(Number(e.target.value));
                  }}
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Gaji Aktual (IDR) *</label>
                <input
                  type="number"
                  className="fi"
                  value={formGajiAktual}
                  onChange={(e) => setFormGajiAktual(Number(e.target.value))}
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Tunjangan Operasional LCT *</label>
                <input
                  type="number"
                  className="fi"
                  value={formTunjanganOps}
                  onChange={(e) => setFormTunjanganOps(Number(e.target.value))}
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Tambahan Kenaikan / Mutasi</label>
                <input
                  type="number"
                  className="fi"
                  value={formTambahanKenaikan}
                  onChange={(e) => setFormTambahanKenaikan(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Potongan Pajak PPh 21 (IDR)</label>
                <input
                  type="number"
                  className="fi"
                  value={formPotonganPPh21}
                  onChange={(e) => setFormPotonganPPh21(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Potongan Khusus (MCU/Koperasi)</label>
                <input
                  type="number"
                  className="fi"
                  value={formPotonganMcu}
                  onChange={(e) => setFormPotonganMcu(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Jumlah Hari Kerja Dinas</label>
                <input
                  type="number"
                  className="fi"
                  value={formHariAktif}
                  onChange={(e) => setFormHariAktif(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Daftar Bulan Gaji *</label>
                <input
                  type="text"
                  className="fi"
                  value={formMonth}
                  onChange={(e) => setFormMonth(e.target.value)}
                  placeholder="Contoh: 2026-04"
                  required
                />
              </div>
            </div>

            <div className="fg mt8">
              <label className="fl">Keterangan Transfer / Slip Gaji</label>
              <input
                type="text"
                className="fi"
                value={formKeterangan}
                onChange={(e) => setFormKeterangan(e.target.value)}
                placeholder="Contoh: Pembayaran Gaji Pokok + Tunjangan April 2026"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">Generate Slip Gaji</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
