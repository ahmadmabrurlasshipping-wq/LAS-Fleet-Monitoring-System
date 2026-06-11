import React, { useState } from 'react';
import { CrewMember, Vessel } from '../types';

interface CrewPageProps {
  crew: CrewMember[];
  setCrew: React.Dispatch<React.SetStateAction<CrewMember[]>>;
  vessels: Vessel[];
  toast: (txt: string, type: 's' | 'd' | 'w' | 'i') => void;
  userRole: string;
}

export const CrewPage: React.FC<CrewPageProps> = ({ crew, setCrew, vessels, toast, userRole }) => {
  const [search, setSearch] = useState('');
  const [filterVessel, setFilterVessel] = useState('all');
  const [filterRank, setFilterRank] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formRank, setFormRank] = useState('Nakhoda');
  const [formVessel, setFormVessel] = useState('');
  const [formNationality, setFormNationality] = useState('Indonesia');
  const [formPassport, setFormPassport] = useState('');
  const [formSeamanBook, setFormSeamanBook] = useState('');
  const [formDob, setFormDob] = useState('1990-01-01');
  const [formStatus, setFormStatus] = useState<'onboard' | 'leave' | 'standby' | 'medical'>('onboard');
  const [formCoc, setFormCoc] = useState('ANT II');
  const [formCocExp, setFormCocExp] = useState('');
  const [formSeamanCode, setFormSeamanCode] = useState('');
  const [formMedExp, setFormMedExp] = useState('');
  const [formGmdss, setFormGmdss] = useState('');
  const [formEmergency, setFormEmergency] = useState('');

  const rankOptions = [
    'Nakhoda',
    'Mualim I',
    'Mualim II',
    'Mualim III',
    'KKM',
    'Masinis II',
    'Masinis III',
    'Juru Mudi',
    'Juru Minyak',
    'Juru Masak',
  ];

  const statusMap = {
    onboard: { label: 'Di Kapal', color: 'badge-success' },
    leave: { label: 'Cuti', color: 'badge-info' },
    standby: { label: 'Standby', color: 'badge-warning' },
    medical: { label: 'Cuti Sakit', color: 'badge-danger' },
  };

  const openAddModal = () => {
    if (userRole !== 'Admin') {
      toast('Akses ditolak: Hanya Admin yang dapat mengedit kru!', 'd');
      return;
    }
    setEditingCrew(null);
    setFormName('');
    setFormRank('Nakhoda');
    setFormVessel(vessels.length > 0 ? vessels[0].id : '');
    setFormNationality('Indonesia');
    setFormPassport('');
    setFormSeamanBook('');
    setFormDob('1990-01-01');
    setFormStatus('onboard');
    setFormCoc('ANT II');
    setFormCocExp(new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
    setFormSeamanCode('');
    setFormMedExp(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
    setFormGmdss('');
    setFormEmergency('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: CrewMember) => {
    if (userRole !== 'Admin') {
      toast('Akses ditolak: Hanya Admin yang dapat mengedit data kru!', 'd');
      return;
    }
    setEditingCrew(c);
    setFormName(c.name);
    setFormRank(c.rank);
    setFormVessel(c.vessel);
    setFormNationality(c.nationality);
    setFormPassport(c.passport);
    setFormSeamanBook(c.seamanbook);
    setFormDob(c.dob);
    setFormStatus(c.status);
    setFormCoc(c.coc);
    setFormCocExp(c.cocExp);
    setFormSeamanCode(c.seamanCode || '');
    setFormMedExp(c.medExp);
    setFormGmdss(c.gmdss || '');
    setFormEmergency(c.emergency || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast('Nama crew wajib diisi!', 'd');
      return;
    }

    if (editingCrew) {
      setCrew((prev) =>
        prev.map((c) =>
          c.id === editingCrew.id
            ? {
                ...c,
                name: formName,
                rank: formRank,
                vessel: formVessel,
                nationality: formNationality,
                passport: formPassport,
                seamanbook: formSeamanBook,
                dob: formDob,
                status: formStatus,
                coc: formCoc,
                cocExp: formCocExp,
                seamanCode: formSeamanCode,
                medExp: formMedExp,
                gmdss: formGmdss,
                emergency: formEmergency,
              }
            : c
        )
      );
      toast(`Profil crew ${formName} berhasil diperbarui`, 's');
    } else {
      const newCrew: CrewMember = {
        id: `c_${Date.now()}`,
        name: formName,
        rank: formRank,
        vessel: formVessel,
        nationality: formNationality,
        passport: formPassport,
        seamanbook: formSeamanBook,
        dob: formDob,
        status: formStatus,
        coc: formCoc,
        cocExp: formCocExp,
        seamanCode: formSeamanCode,
        medExp: formMedExp,
        gmdss: formGmdss,
        emergency: formEmergency,
      };
      setCrew((prev) => [...prev, newCrew]);
      toast(`Crew ${formName} berhasil ditambahkan ke daftar awak`, 's');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (userRole !== 'Admin') {
      toast('Akses ditolak: Hanya Admin yang dapat menghapus kru!', 'd');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus awak kapal ${name}?`)) {
      setCrew((prev) => prev.filter((c) => c.id !== id));
      toast(`Awak kapal ${name} berhasil dihapus dari sistem`, 's');
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (userRole !== 'Admin') {
      toast('Akses ditolak: Hanya Admin yang dapat melakukan import data!', 'd');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          toast('File CSV kosong atau tidak valid!', 'd');
          return;
        }

        const lines = text.split(/\r?\n/);
        const parsedRows: string[][] = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Basic CSV parsing split by comma, respecting quotes
          const row: string[] = [];
          let insideQuote = false;
          let entry = '';
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
              row.push(entry.trim().replace(/^"(.*)"$/, '$1'));
              entry = '';
            } else {
              entry += char;
            }
          }
          row.push(entry.trim().replace(/^"(.*)"$/, '$1'));
          parsedRows.push(row);
        }

        if (parsedRows.length < 2) {
          toast('Format CSV tidak valid! Pastikan baris header dan data tersedia.', 'd');
          return;
        }

        const headers = parsedRows[0].map(h => h.toLowerCase().trim());
        const dataRows = parsedRows.slice(1);

        // Helper to find column index by matching header synonyms
        const getIdx = (synonyms: string[]): number => {
          return headers.findIndex(h => synonyms.some(syn => h.includes(syn)));
        };

        const nameIdx = getIdx(['nama', 'name', 'fullname']);
        const rankIdx = getIdx(['jabatan', 'rank', 'peran', 'role']);
        const vesselIdx = getIdx(['kapal', 'vessel', 'ship', 'penempatan']);
        const nationalityIdx = getIdx(['kebangsaan', 'nationality', 'negara', 'national']);
        const passportIdx = getIdx(['passport', 'paspor']);
        const seamanbookIdx = getIdx(['seamanbook', 'seaman book', 'buku pelaut']);
        const dobIdx = getIdx(['tanggal lahir', 'dob', 'birth', 'lahir']);
        const statusIdx = getIdx(['status']);
        const cocIdx = getIdx(['coc', 'sertifikat', 'sertifikasi']);
        const cocExpIdx = getIdx(['coc exp', 'kadaluarsa coc', 'exp coc']);
        const seamanCodeIdx = getIdx(['kode pelaut', 'seaman code', 'seaman_code']);
        const medExpIdx = getIdx(['med exp', 'kadaluarsa medis', 'medical', 'med_exp']);
        const gmdssIdx = getIdx(['gmdss', 'keterangan']);
        const emergencyIdx = getIdx(['emergency', 'kontak darurat', 'hubungi']);

        if (nameIdx === -1 || seamanbookIdx === -1) {
          toast('Gagal mengimpor: Kolom "Nama" dan "Buku Pelaut" wajib ada di dalam header CSV!', 'd');
          return;
        }

        const newCrewMembers: CrewMember[] = [];
        let skippedCount = 0;

        dataRows.forEach((row, rowIndex) => {
          const name = row[nameIdx]?.trim();
          const seamanbook = row[seamanbookIdx]?.trim();

          if (!name || !seamanbook) {
            skippedCount++;
            return;
          }

          // Vessel mapping
          let vesselId = '';
          if (vesselIdx !== -1 && row[vesselIdx]) {
            const rawVessel = row[vesselIdx].trim().toLowerCase();
            const matchedV = vessels.find(v => 
              v.name.toLowerCase().includes(rawVessel) || 
              rawVessel.includes(v.name.toLowerCase()) ||
              v.id.toLowerCase() === rawVessel
            );
            if (matchedV) {
              vesselId = matchedV.id;
            }
          }

          // Status mapping
          let status: 'onboard' | 'leave' | 'standby' | 'medical' = 'standby';
          if (statusIdx !== -1 && row[statusIdx]) {
            const rawStatus = row[statusIdx].trim().toLowerCase();
            if (rawStatus.includes('kapal') || rawStatus.includes('onboard') || rawStatus.includes('aktif') || rawStatus.includes('active')) {
              status = 'onboard';
            } else if (rawStatus.includes('cuti') && rawStatus.includes('sakit')) {
              status = 'medical';
            } else if (rawStatus.includes('sakit') || rawStatus.includes('med')) {
              status = 'medical';
            } else if (rawStatus.includes('cuti') || rawStatus.includes('leave')) {
              status = 'leave';
            }
          } else if (vesselId) {
            status = 'onboard';
          }

          // Rank matching
          let rank = 'Juru Mudi';
          if (rankIdx !== -1 && row[rankIdx]) {
            const rawRank = row[rankIdx].trim();
            const matchedRank = rankOptions.find(ro => ro.toLowerCase() === rawRank.toLowerCase());
            rank = matchedRank || rawRank;
          }

          // Date helper
          const cleanDate = (valIndex: number, defaultVal: string): string => {
            if (valIndex === -1 || !row[valIndex]) return defaultVal;
            const raw = row[valIndex].trim();
            const parts = raw.split(/[-/]/);
            if (parts.length === 3) {
              if (parts[0].length === 4) {
                return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
              } else if (parts[2].length === 4) {
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              }
            }
            return raw;
          };

          const newMember: CrewMember = {
            id: `c_csv_${Date.now()}_${rowIndex}`,
            name: name.toUpperCase(),
            rank: rank,
            vessel: vesselId,
            nationality: (nationalityIdx !== -1 && row[nationalityIdx]) ? row[nationalityIdx].trim() : 'Indonesia',
            passport: (passportIdx !== -1 && row[passportIdx]) ? row[passportIdx].trim() : '',
            seamanbook: seamanbook.toUpperCase(),
            dob: cleanDate(dobIdx, '1990-01-01'),
            status: status,
            coc: (cocIdx !== -1 && row[cocIdx]) ? row[cocIdx].trim() : 'BST',
            cocExp: cleanDate(cocExpIdx, new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)),
            seamanCode: (seamanCodeIdx !== -1 && row[seamanCodeIdx]) ? row[seamanCodeIdx].trim() : '',
            medExp: cleanDate(medExpIdx, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)),
            gmdss: (gmdssIdx !== -1 && row[gmdssIdx]) ? row[gmdssIdx].trim() : '',
            emergency: (emergencyIdx !== -1 && row[emergencyIdx]) ? row[emergencyIdx].trim() : '',
          };

          newCrewMembers.push(newMember);
        });

        if (newCrewMembers.length === 0) {
          toast('Tidak ada data awak kapal valid yang berhasil diproses dari file CSV.', 'w');
          return;
        }

        setCrew(prev => {
          const existingBooks = new Set(prev.map(p => p.seamanbook.toUpperCase()));
          const uniqueNewArr = newCrewMembers.filter(m => !existingBooks.has(m.seamanbook));
          
          if (uniqueNewArr.length === 0) {
            toast('Semua awak kapal di file CSV sudah ada di direktori (berdasarkan nomor Buku Pelaut).', 'i');
            return prev;
          }

          toast(`Berhasil mengimpor ${uniqueNewArr.length} awak kapal baru! ${skippedCount > 0 ? `(${skippedCount} baris dilewati karena data tidak lengkap)` : ''}`, 's');
          return [...prev, ...uniqueNewArr];
        });

      } catch (err: any) {
        toast(`Error memproses file CSV: ${err.message}`, 'd');
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredCrew = crew.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.seamanbook.toLowerCase().includes(search.toLowerCase()) ||
                          c.coc.toLowerCase().includes(search.toLowerCase());
    const matchesVessel = filterVessel === 'all' || c.vessel === filterVessel;
    const matchesRank = filterRank === 'all' || c.rank === filterRank;

    return matchesSearch && matchesVessel && matchesRank;
  });

  const getVesselName = (id: string) => {
    if (!id) return 'Dalam Pool / Bebas';
    const v = vessels.find((vs) => vs.id === id);
    return v ? v.name : '—';
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '19px', fontWeight: '800' }}>Manajemen Awak &amp; Pelaut (Crewing)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-400)', marginTop: '2px' }}>Direktori sertifikasi, data kepelautan, dan penempatan kapal awak</div>
        </div>
        {userRole === 'Admin' && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label className="btn btn-ghost" style={{ cursor: 'pointer', margin: 0, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(5, 213, 250, 0.1)', border: '1px solid rgba(5, 213, 250, 0.3)' }} title="Format CSV: Nama, Buku Pelaut, Jabatan, Kapal, Status, dll.">
              <i className="fa fa-file-csv text-cyan-400"></i> Import CSV
              <input 
                type="file" 
                accept=".csv" 
                style={{ display: 'none' }} 
                onChange={handleCsvUpload} 
              />
            </label>
            <button className="btn btn-primary" onClick={openAddModal}>
              <i className="fa fa-plus"></i> Tambah Awak Kapal
            </button>
          </div>
        )}
      </div>

      {/* Stats Counter Bar */}
      <div className="g g4 mb14">
        <div className="sc" style={{ padding: '10px 14px' }}>
          <div className="lbl" style={{ fontSize: '9px' }}>Di Kapal (Active)</div>
          <div className="val text-success" style={{ fontSize: '20px' }}>{crew.filter((c) => c.status === 'onboard').length}</div>
        </div>
        <div className="sc" style={{ padding: '10px 14px' }}>
          <div className="lbl" style={{ fontSize: '9px' }}>Cuti (Leave)</div>
          <div className="val text-neon" style={{ fontSize: '20px' }}>{crew.filter((c) => c.status === 'leave').length}</div>
        </div>
        <div className="sc" style={{ padding: '10px 14px' }}>
          <div className="lbl" style={{ fontSize: '9px' }}>Standby</div>
          <div className="val text-orange" style={{ fontSize: '20px' }}>{crew.filter((c) => c.status === 'standby').length}</div>
        </div>
        <div className="sc" style={{ padding: '10px 14px' }}>
          <div className="lbl" style={{ fontSize: '9px' }}>Cuti Sakit</div>
          <div className="val text-danger" style={{ fontSize: '20px' }}>{crew.filter((c) => c.status === 'medical').length}</div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="card mb14" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div className="tb-search" style={{ border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', flex: '1 1 200px' }}>
            <i className="fa fa-magnifying-glass" style={{ color: 'var(--text-400)', fontSize: '12px' }}></i>
            <input
              type="text"
              placeholder="Cari nama, buku pelaut, atau sertifikat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select className="fs" style={{ width: '150px', padding: '6px 10px' }} value={filterVessel} onChange={(e) => setFilterVessel(e.target.value)}>
              <option value="all">Semua Kapal</option>
              <option value="">[Dalam Pool / Bebas]</option>
              {vessels.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <select className="fs" style={{ width: '140px', padding: '6px 10px' }} value={filterRank} onChange={(e) => setFilterRank(e.target.value)}>
              <option value="all">Semua Jabatan</option>
              {rankOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Crew Table Grid */}
      <div className="card">
        <div className="ct"><i className="fa fa-users text-neon"></i> Direktori Resmi Awak LCT ({filteredCrew.length} pelaut)</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Foto / Detail Awak</th>
                <th>Jabatan (Rank)</th>
                <th>Kapal Saat Ini</th>
                <th>Buku Pelaut</th>
                <th>No Sertifikat (CoC)</th>
                <th>Kadaluarsa Medis</th>
                <th>Status</th>
                {userRole === 'Admin' && <th style={{ textAlign: 'right' }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filteredCrew.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-600)', padding: '20px' }}>
                    Tidak ada awak pelaut terdaftar yang cocok dengan filter
                  </td>
                </tr>
              ) : (
                filteredCrew.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="cav-row">
                        {/* Custom visual initials avatar based on rank type */}
                        <div
                          className="cav font-bold"
                          style={{
                            background: c.rank === 'Nakhoda' || c.rank === 'KKM'
                              ? 'linear-gradient(135deg, var(--orange), #ff4500)'
                              : 'linear-gradient(135deg, #0099cc, #0055aa)',
                          }}
                        >
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="cinfo">
                          <div className="c1 text-white font-semibold">{c.name}</div>
                          <div className="c2 text-[10px] text-zinc-400">{c.nationality}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold">{c.rank}</td>
                    <td className="font-semibold text-cyan-300">{getVesselName(c.vessel)}</td>
                    <td className="mono text-xs">{c.seamanbook}</td>
                    <td className="mono text-xs">{c.seamanCode || '—'} <span className="text-muted">({c.coc})</span></td>
                    <td className="mono text-zinc-400">{c.medExp || '—'}</td>
                    <td>
                      <span className={`badge ${statusMap[c.status]?.color || 'badge-muted'}`}>
                        {statusMap[c.status]?.label || 'Pool'}
                      </span>
                    </td>
                    {userRole === 'Admin' && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <button className="btn btn-ghost btn-xs" onClick={() => openEditModal(c)}>
                            <i className="fa fa-pen"></i> Edit
                          </button>
                          <button className="btn btn-danger btn-xs" onClick={() => handleDelete(c.id, c.name)}>
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

      {/* Edit / Add Crew Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal modal-lg">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
          <div className="modal-title">
            <i className="fa fa-user-gear"></i>
            {editingCrew ? `Edit Profil Awak: ${editingCrew.name}` : 'Tambah Awak Kapal Baru'}
          </div>

          <form onSubmit={handleSave}>
            <div className="g g2">
              <div className="fg">
                <label className="fl">Nama Awak Kapal *</label>
                <input
                  type="text"
                  className="fi"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value.toUpperCase())}
                  placeholder="Contoh: DARWIN"
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Jabatan (Rank) *</label>
                <select className="fs" value={formRank} onChange={(e) => setFormRank(e.target.value)}>
                  {rankOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="fg">
                <label className="fl">Penempatan Kapal *</label>
                <select className="fs" value={formVessel} onChange={(e) => setFormVessel(e.target.value)}>
                  <option value="">[Dalam Pool / Bebas]</option>
                  {vessels.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="fg">
                <label className="fl">Status Tugas *</label>
                <select className="fs" value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)}>
                  <option value="onboard">Di Kapal (Active Onboard)</option>
                  <option value="leave">Cuti (On Leave)</option>
                  <option value="standby">Standby Pool</option>
                  <option value="medical">Cuti Medis/Sakit</option>
                </select>
              </div>

              <div className="fg">
                <label className="fl">Kebangsaan</label>
                <input
                  type="text"
                  className="fi"
                  value={formNationality}
                  onChange={(e) => setFormNationality(e.target.value)}
                />
              </div>

              <div className="fg">
                <label className="fl">Nomor Buku Pelaut (Seaman Book) *</label>
                <input
                  type="text"
                  className="fi"
                  value={formSeamanBook}
                  onChange={(e) => setFormSeamanBook(e.target.value.toUpperCase())}
                  placeholder="Contoh: F 151466"
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Tanggal Lahir *</label>
                <input
                  type="date"
                  className="fi"
                  value={formDob}
                  onChange={(e) => setFormDob(e.target.value)}
                  required
                />
              </div>

              <div className="fg">
                <label className="fl">Nomor Passport</label>
                <input
                  type="text"
                  className="fi"
                  value={formPassport}
                  onChange={(e) => setFormPassport(e.target.value.toUpperCase())}
                  placeholder="Opsional"
                />
              </div>

              <div className="fg">
                <label className="fl">Kode Pelaut (Seaman Code)</label>
                <input
                  type="text"
                  className="fi"
                  value={formSeamanCode}
                  onChange={(e) => setFormSeamanCode(e.target.value)}
                  placeholder="Contoh: 6200099..."
                />
              </div>

              <div className="fg">
                <label className="fl">Jenis CoC (Sertifikat Koki/Navigasi)</label>
                <input
                  type="text"
                  className="fi"
                  value={formCoc}
                  onChange={(e) => setFormCoc(e.target.value.toUpperCase())}
                  placeholder="Contoh: ANT II / ANT III M / RATINGS"
                />
              </div>

              <div className="fg">
                <label className="fl">Kadaluarsa Kelas CoC</label>
                <input
                  type="date"
                  className="fi"
                  value={formCocExp}
                  onChange={(e) => setFormCocExp(e.target.value)}
                />
              </div>

              <div className="fg">
                <label className="fl">Kadaluarsa Medis (Fit Certificate)</label>
                <input
                  type="date"
                  className="fi"
                  value={formMedExp}
                  onChange={(e) => setFormMedExp(e.target.value)}
                />
              </div>
            </div>

            <div className="fg mt8">
              <label className="fl">Kontak Darurat (Email/Telepon Keluarga)</label>
              <input
                type="text"
                className="fi"
                value={formEmergency}
                onChange={(e) => setFormEmergency(e.target.value)}
                placeholder="Contoh: istri@gmail.com / 081234567..."
              />
            </div>

            <div className="fg">
              <label className="fl">Keterangan / Nomor GMDSS lainnya</label>
              <input
                type="text"
                className="fi"
                value={formGmdss}
                onChange={(e) => setFormGmdss(e.target.value)}
                placeholder="Opsional GMDSS GOC atau sertifikat pelengkap"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Kembali</button>
              <button type="submit" className="btn btn-primary">Simpan Profil</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
