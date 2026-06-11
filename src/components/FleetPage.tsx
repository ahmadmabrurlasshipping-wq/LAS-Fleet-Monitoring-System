import React, { useState } from 'react';
import { Vessel } from '../types';

interface FleetPageProps {
  vessels: Vessel[];
  setVessels: React.Dispatch<React.SetStateAction<Vessel[]>>;
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
  userRole: string;
}

export const FleetPage: React.FC<FleetPageProps> = ({ vessels, setVessels, toast, userRole }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortKey, setSortKey] = useState<keyof Vessel>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof Vessel) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      toast(`Urutan kolom ${String(key).toUpperCase()} diubah (${sortOrder === 'asc' ? 'Z-A' : 'A-Z'})`, 'i');
    } else {
      setSortKey(key);
      setSortOrder('asc');
      toast(`Urutan kolom diset ke ${String(key).toUpperCase()} (A-Z)`, 'i');
    }
  };

  const renderSortIcon = (key: keyof Vessel) => {
    if (sortKey !== key) {
      return <i className="fa fa-sort opacity-30 ml-1.5" style={{ fontSize: '10px' }}></i>;
    }
    return sortOrder === 'asc' ? (
      <i className="fa fa-caret-up text-cyan-400 ml-1.5" style={{ fontSize: '11px' }}></i>
    ) : (
      <i className="fa fa-caret-down text-cyan-400 ml-1.5" style={{ fontSize: '11px' }}></i>
    );
  };

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('LCT');
  const [formGt, setFormGt] = useState(0);
  const [formDwt, setFormDwt] = useState(0);
  const [formLoa, setFormLoa] = useState(0);
  const [formBreadth, setFormBreadth] = useState(0);
  const [formDepth, setFormDepth] = useState(0);
  const [formDraft, setFormDraft] = useState(0);
  const [formYear, setFormYear] = useState(2025);
  const [formCls, setFormCls] = useState('BKI');
  const [formPort, setFormPort] = useState('Samarinda');
  const [formFlag, setFormFlag] = useState('Indonesia');
  const [formEngine, setFormEngine] = useState('');
  const [formStatus, setFormStatus] = useState<'operational' | 'route' | 'drydock'>('operational');
  const [formCrew, setFormCrew] = useState(13);
  const [formLocation, setFormLocation] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    if (userRole !== 'Admin') {
      toast('Akses ditolak: Hanya Admin yang dapat mengedit data armada!', 'd');
      return;
    }
    setEditingVessel(null);
    setFormName('');
    setFormType('LCT');
    setFormGt(700);
    setFormDwt(1200);
    setFormLoa(60);
    setFormBreadth(12);
    setFormDepth(4);
    setFormDraft(3);
    setFormYear(2020);
    setFormCls('BKI');
    setFormPort('Samarinda');
    setFormFlag('Indonesia');
    setFormEngine('');
    setFormStatus('operational');
    setFormCrew(13);
    setFormLocation('Samarinda');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vessel) => {
    if (userRole !== 'Admin') {
      toast('Akses ditolak: Hanya Admin yang dapat mengedit data armada!', 'd');
      return;
    }
    setEditingVessel(v);
    setFormName(v.name);
    setFormType(v.type);
    setFormGt(v.gt);
    setFormDwt(v.dwt);
    setFormLoa(v.loa);
    setFormBreadth(v.breadth);
    setFormDepth(v.depth || 0);
    setFormDraft(v.draft || 0);
    setFormYear(v.year);
    setFormCls(v.cls);
    setFormPort(v.port);
    setFormFlag(v.flag);
    setFormEngine(v.engine);
    setFormStatus(v.status);
    setFormCrew(v.crew);
    setFormLocation(v.location);
    setFormNotes(v.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast('Nama kapal wajib diisi!', 'd');
      return;
    }

    if (editingVessel) {
      // Edit
      setVessels((prev) =>
        prev.map((v) =>
          v.id === editingVessel.id
            ? {
                ...v,
                name: formName,
                type: formType,
                gt: Number(formGt),
                dwt: Number(formDwt),
                loa: Number(formLoa),
                breadth: Number(formBreadth),
                depth: Number(formDepth),
                draft: Number(formDraft),
                year: Number(formYear),
                cls: formCls,
                port: formPort,
                flag: formFlag,
                engine: formEngine,
                status: formStatus,
                crew: Number(formCrew),
                location: formLocation,
                notes: formNotes,
              }
            : v
        )
      );
      toast(`Data kapal ${formName} berhasil diperbarui`, 's');
    } else {
      // Add new
      const newVessel: Vessel = {
        id: `v_${Date.now()}`,
        name: formName,
        type: formType,
        gt: Number(formGt),
        dwt: Number(formDwt),
        loa: Number(formLoa),
        breadth: Number(formBreadth),
        depth: Number(formDepth),
        draft: Number(formDraft),
        year: Number(formYear),
        cls: formCls,
        port: formPort,
        flag: formFlag,
        engine: formEngine,
        status: formStatus,
        crew: Number(formCrew),
        location: formLocation,
        notes: formNotes,
      };
      setVessels((prev) => [...prev, newVessel]);
      toast(`Kapal ${formName} berhasil ditambahkan ke armada`, 's');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (userRole !== 'Admin') {
      toast('Akses ditolak: Hanya Admin yang dapat menghapus data armada!', 'd');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus kapal ${name} dari sistem?`)) {
      setVessels((prev) => prev.filter((v) => v.id !== id));
      toast(`Kapal ${name} berhasil dihapus`, 's');
    }
  };

  const filteredVessels = vessels.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                           v.cls.toLowerCase().includes(search.toLowerCase()) ||
                           v.engine.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedVessels = [...filteredVessels].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (valA === undefined || valA === null) valA = '';
    if (valB === undefined || valB === null) valB = '';

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    } else {
      const sA = String(valA).toLowerCase();
      const sB = String(valB).toLowerCase();
      return sortOrder === 'asc' ? sA.localeCompare(sB) : sB.localeCompare(sA);
    }
  });

  return (
    <div>
      {/* Page Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '19px', fontWeight: '800' }}>Manajemen Armada Kapal (Fleet)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-400)', marginTop: '2px' }}>Daftar detail &amp; spesifikasi teknis LCT PT. LAS</div>
        </div>
        {userRole === 'Admin' && (
          <button className="btn btn-primary" onClick={openAddModal}>
            <i className="fa fa-plus"></i> Tambah Kapal
          </button>
        )}
      </div>

      {/* Filters bar */}
      <div className="card mb14" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div className="tb-search" style={{ border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', width: '280px' }}>
              <i className="fa fa-magnifying-glass" style={{ color: 'var(--text-400)', fontSize: '12px' }}></i>
              <input
                type="text"
                placeholder="Cari kapal, klasifikasi atau mesin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className="text-[11px] text-zinc-400 font-medium">Tampilan:</span>
              <div className="tabs">
                <button className={`tab ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                  <i className="fa fa-table-list mr-1"></i> Data Grid
                </button>
                <button className={`tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                  <i className="fa fa-grip mr-1"></i> Cards
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="text-[11px] text-zinc-400 font-medium">Filter Status:</span>
            <div className="tabs">
              <button className={`tab ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>Semua</button>
              <button className={`tab ${filterStatus === 'operational' ? 'active' : ''}`} onClick={() => setFilterStatus('operational')}>Operational</button>
              <button className={`tab ${filterStatus === 'route' ? 'active' : ''}`} onClick={() => setFilterStatus('route')}>On Route</button>
              <button className={`tab ${filterStatus === 'drydock' ? 'active' : ''}`} onClick={() => setFilterStatus('drydock')}>Dry Dock</button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Vessels Table Data Grid */
        <div className="card">
          <div className="ct flex justify-between items-center">
            <span>
              <i className="fa fa-table text-neon mr-1"></i> Data Grid Armada (Total: {sortedVessels.length} Kapal)
            </span>
            <span className="text-[10px] text-zinc-400 font-mono italic">
              * Klik judul kolom untuk mengurutkan metrics armada
            </span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors" style={{ padding: '12px 10px' }}>
                    Nama Kapal {renderSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('type')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    Tipe {renderSortIcon('type')}
                  </th>
                  <th onClick={() => handleSort('gt')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    GT {renderSortIcon('gt')}
                  </th>
                  <th onClick={() => handleSort('dwt')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    DWT {renderSortIcon('dwt')}
                  </th>
                  <th onClick={() => handleSort('loa')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    LOA {renderSortIcon('loa')}
                  </th>
                  <th onClick={() => handleSort('breadth')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    Lebar {renderSortIcon('breadth')}
                  </th>
                  <th onClick={() => handleSort('year')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    Tahun {renderSortIcon('year')}
                  </th>
                  <th onClick={() => handleSort('cls')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    Klas {renderSortIcon('cls')}
                  </th>
                  <th onClick={() => handleSort('location')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    Pelacakan Lokasi Terakhir {renderSortIcon('location')}
                  </th>
                  <th onClick={() => handleSort('status')} className="cursor-pointer select-none hover:text-cyan-400 transition-colors">
                    Status {renderSortIcon('status')}
                  </th>
                  {userRole === 'Admin' && <th style={{ textAlign: 'right', paddingRight: '14px' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {sortedVessels.length === 0 ? (
                  <tr>
                    <td colSpan={userRole === 'Admin' ? 11 : 10} style={{ textAlign: 'center', color: 'var(--text-600)', padding: '30px' }}>
                      Tidak ada data kapal yang sesuai dengan filter pencarian
                    </td>
                  </tr>
                ) : (
                  sortedVessels.map((v) => (
                    <tr key={v.id} className="hover:bg-cyan-500/5 transition-colors">
                      <td className="font-bold text-white py-3">{v.name}</td>
                      <td><span className="badge badge-muted">{v.type}</span></td>
                      <td className="mono text-zinc-300 font-semibold">{v.gt}</td>
                      <td className="mono text-zinc-300 font-semibold">{v.dwt}</td>
                      <td className="mono text-zinc-300">{v.loa} m</td>
                      <td className="mono text-zinc-300">{v.breadth} m</td>
                      <td className="mono text-zinc-400">{v.year}</td>
                      <td className="mono text-cyan-300 font-semibold">{v.cls}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa fa-location-dot text-cyan-400 text-[11px]"></i>
                          <span className="text-zinc-200">{v.location}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${v.status === 'operational' ? 'badge-success' : v.status === 'route' ? 'badge-info' : 'badge-warning'}`}>
                          {v.status === 'operational' ? 'Operational' : v.status === 'route' ? 'On Route' : 'Dry Dock'}
                        </span>
                      </td>
                      {userRole === 'Admin' && (
                        <td style={{ textAlign: 'right', paddingRight: '14px' }}>
                          <div style={{ display: 'inline-flex', gap: '4px' }}>
                            <button className="btn btn-ghost btn-xs" style={{ minWidth: 'auto', padding: '4px 6px' }} onClick={() => openEditModal(v)}>
                              <i className="fa fa-pen"></i>
                            </button>
                            <button className="btn btn-danger btn-xs" style={{ minWidth: 'auto', padding: '4px 6px' }} onClick={() => handleDelete(v.id, v.name)}>
                              <i className="fa fa-trash-can"></i>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Vessels Grid */
        <div className="g g2">
          {sortedVessels.length === 0 ? (
            <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--text-600)' }}>
              Tidak ada kapal yang sesuai dengan filter pencarian
            </div>
          ) : (
            sortedVessels.map((v) => (
              <div
                className={`vc ${v.status === 'operational' ? 'op' : v.status === 'route' ? 'rt' : 'dk'}`}
                key={v.id}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="vn">{v.name}</div>
                    <div className="vt">{v.type} — GT {v.gt} / DWT {v.dwt} kg</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {userRole === 'Admin' && (
                      <>
                        <button className="btn btn-ghost btn-xs" style={{ minWidth: 'auto', padding: '4px 6px' }} onClick={() => openEditModal(v)}>
                          <i className="fa fa-pen"></i>
                        </button>
                        <button className="btn btn-danger btn-xs" style={{ minWidth: 'auto', padding: '4px 6px' }} onClick={() => handleDelete(v.id, v.name)}>
                          <i className="fa fa-trash-can"></i>
                        </button>
                      </>
                    )}
                    <span className={`badge ${v.status === 'operational' ? 'badge-success' : v.status === 'route' ? 'badge-info' : 'badge-warning'}`}>
                      {v.status === 'operational' ? 'Operational' : v.status === 'route' ? 'On Route' : 'Dry Dock'}
                    </span>
                  </div>
                </div>

                <div className="vstats mt12">
                  <div>
                    LOA
                    <span>{v.loa} m</span>
                  </div>
                  <div>
                    Lebar
                    <span>{v.breadth} m</span>
                  </div>
                  <div>
                    Tinggi / Draft
                    <span>{v.depth || '—'} / {v.draft || '—'} m</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(0, 180, 255, 0.05)', paddingTop: '8px', fontSize: '11px', color: 'var(--text-400)' }}>
                  <div><strong className="text-white">Mesin:</strong> {v.engine || '—'}</div>
                  <div className="mt8" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong className="text-white">Klas:</strong> {v.cls}</span>
                    <span><strong className="text-white">Port Registrasi:</strong> {v.port}</span>
                  </div>
                </div>

                <div className="vloc bg-[rgba(0,0,0,0.2)] p-2 rounded mt-3">
                  <i className="fa fa-location-dot text-neon"></i>
                  <span>{v.location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add / Edit Vessel Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal modal-lg">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-anchor"></i>
            {editingVessel ? `Form Edit Kapal: ${editingVessel.name}` : 'Tambah Kapal Baru'}
          </div>

          <form onSubmit={handleSave}>
            <div className="g g2">
              <div className="fg">
                <label className="fl">Nama Kapal *</label>
                <input
                  type="text"
                  className="fi animate-none"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value.toUpperCase())}
                  placeholder="Contoh: LCT. LAS 2"
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Tipe Kapal</label>
                <select className="fs" value={formType} onChange={(e) => setFormType(e.target.value)}>
                  <option value="LCT">LCT (Landing Craft Tank)</option>
                  <option value="Tugboat">Tugboat</option>
                  <option value="Barge">Barge</option>
                  <option value="SPOB">SPOB</option>
                </select>
              </div>

              <div className="fg">
                <label className="fl">Gross Tonnage (GT) *</label>
                <input
                  type="number"
                  className="fi"
                  value={formGt}
                  onChange={(e) => setFormGt(Number(e.target.value))}
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Deadweight Tonnage (DWT) *</label>
                <input
                  type="number"
                  className="fi"
                  value={formDwt}
                  onChange={(e) => setFormDwt(Number(e.target.value))}
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Length Overall (LOA) m</label>
                <input
                  type="number"
                  step="0.01"
                  className="fi"
                  value={formLoa}
                  onChange={(e) => setFormLoa(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Breadth (Lebar) m</label>
                <input
                  type="number"
                  step="0.01"
                  className="fi"
                  value={formBreadth}
                  onChange={(e) => setFormBreadth(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Depth (Tinggi Kapal) m</label>
                <input
                  type="number"
                  step="0.01"
                  className="fi"
                  value={formDepth}
                  onChange={(e) => setFormDepth(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Draft Maksimum m</label>
                <input
                  type="number"
                  step="0.01"
                  className="fi"
                  value={formDraft}
                  onChange={(e) => setFormDraft(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Tahun Pembuatan</label>
                <input
                  type="number"
                  className="fi"
                  value={formYear}
                  onChange={(e) => setFormYear(Number(e.target.value))}
                />
              </div>

              <div className="fg">
                <label className="fl">Badan Klasifikasi</label>
                <input
                  type="text"
                  className="fi"
                  value={formCls}
                  onChange={(e) => setFormCls(e.target.value)}
                  placeholder="Contoh: BKI, ABS, LR"
                />
              </div>

              <div className="fg">
                <label className="fl">Status Operasi</label>
                <select className="fs" value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)}>
                  <option value="operational">Operational</option>
                  <option value="route">On Route (Dalam Pelayaran)</option>
                  <option value="drydock">Dry Dock (Galangan/Perbaikan)</option>
                </select>
              </div>

              <div className="fg">
                <label className="fl">Kebutuhan Jumlah Awak</label>
                <input
                  type="number"
                  className="fi"
                  value={formCrew}
                  onChange={(e) => setFormCrew(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="fg mt8">
              <label className="fl">Spesifikasi Mesin Utama</label>
              <input
                type="text"
                className="fi"
                value={formEngine}
                onChange={(e) => setFormEngine(e.target.value)}
                placeholder="Contoh: 2x Yanmar Marine Diesel 6AYM-WTE 500kW"
              />
            </div>

            <div className="fg">
              <label className="fl">Lokasi Saat Ini / Koordinat Terakhir</label>
              <input
                type="text"
                className="fi"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Contoh: Selat Makassar — Menuju Samarinda"
              />
            </div>

            <div className="fg">
              <label className="fl">Catatan Teknis / Tambahan</label>
              <textarea
                className="fta"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Contoh: Rampdoor size, Generator Auxiliary specs..."
              ></textarea>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">Simpan Kapal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
