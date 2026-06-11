import { Vessel, CrewMember, VesselDocument, CrewDocument, Rotation, MlcLog, Incident, Voyage, Activity, PayrollEntry } from './types';

export const INITIAL_VESSELS: Vessel[] = [
  {
    id: 'v1',
    name: 'LCT. DEWA SAMUDERA ABADI',
    type: 'LCT',
    gt: 707,
    dwt: 1200,
    loa: 59.61,
    breadth: 12.20,
    depth: 4.00,
    draft: 3.00,
    year: 2014,
    cls: 'BKI',
    port: 'Samarinda',
    flag: 'Indonesia',
    engine: '2x Yanmar Marine Diesel 6AYM-WTE 500kW',
    status: 'operational',
    crew: 13,
    location: 'Selat Makassar — Samarinda',
    notes: 'Rampdoor: 9.00×7.50m | Aux: 1x Yuchai 53kW + YC2115C 40kW | Pump: 2x Ebara 65×50 FSJ'
  },
  {
    id: 'v2',
    name: 'LCT. LAS 2',
    type: 'LCT',
    gt: 1085,
    dwt: 2000,
    loa: 78.12,
    breadth: 13.50,
    depth: 4.20,
    draft: 3.15,
    year: 2015,
    cls: 'BKI',
    port: 'Samarinda',
    flag: 'Indonesia',
    engine: '2x Mitsubishi Diesel S6R2-MPTK2',
    status: 'route',
    crew: 13,
    location: 'Laut Jawa — Menuju Surabaya',
    notes: 'Rampdoor: 7.30×8.00m | Aux: 2x Mitsubishi S6R-60kVA | SSAS, AIS'
  },
  {
    id: 'v_mofs1k3i_03j8go',
    name: 'LCT. RADJA SAMUDERA ABADI',
    type: 'LCT',
    gt: 719,
    dwt: 1200,
    loa: 59.85,
    breadth: 12.20,
    depth: 4.00,
    draft: 3.00,
    year: 2014,
    cls: 'BKI',
    port: 'Samarinda',
    flag: 'Indonesia',
    engine: '2x Yanmar Marine Diesel 6HYM-WET X YX161L/500kW',
    status: 'operational',
    crew: 13,
    location: 'Perairan Kalimantan Timur',
    notes: 'Rampdoor: 9.00×7.50m | Aux: 2x Yuchai YC6105CA 53kW | Thuraya Tracking VHF Marine'
  },
  {
    id: 'v_mofs2u6g_59hzfi',
    name: 'CINTA SAMUDERA ABADI',
    type: 'LCT',
    gt: 1240,
    dwt: 2400,
    loa: 76.88,
    breadth: 15.00,
    depth: 4.50,
    draft: 3.24,
    year: 2021,
    cls: 'BKI',
    port: 'Samarinda',
    flag: 'Indonesia',
    engine: '2x 829HP Yanmar 6AYM-WET | Kecepatan maks. 11 knot',
    status: 'drydock',
    crew: 8,
    location: 'Galangan Kapal Samarinda',
    notes: 'Kapasitas: 86 TEUS | Rampdoor: 10.00×9.00m | Aux: 2x Doosan AD136 85kVA | Pump: Ebara 65×50 FSJ'
  }
];

export const INITIAL_CREW: CrewMember[] = [
  /* ── LCT DEWA SAMUDERA ABADI (v1) ── */
  {id:'c_dsa01',name:'DARWIN',rank:'Nakhoda',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'F 151466',dob:'1942-03-27',status:'onboard',coc:'ANT II',cocExp:'2028-06-20',seamanCode:'6200099261N20423',medExp:'2027-06-20',gmdss:'',emergency:''},
  {id:'c_dsa02',name:'MIRWAN',rank:'Mualim I',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'F 318245',dob:'1984-05-12',status:'onboard',coc:'ANT III M',cocExp:'2027-04-10',seamanCode:'6200318368M30423',medExp:'2027-04-10',gmdss:'',emergency:'jadnggaming@gmail.com'},
  {id:'c_dsa03',name:'MUH. TAUFIK QURAHMAN R',rank:'Mualim II',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'G 132440',dob:'2014-04-05',status:'onboard',coc:'ANT III',cocExp:'2028-07-20',seamanCode:'6212304775010620',medExp:'2028-07-20',gmdss:'',emergency:''},
  {id:'c_dsa04',name:'AHLAL IRFAN',rank:'KKM',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'J 088913',dob:'2021-11-15',status:'onboard',coc:'ATT II',cocExp:'2027-08-07',seamanCode:'6201319171T20418',medExp:'2027-08-07',gmdss:'',emergency:'ahlaldhira1512@gmail.com'},
  {id:'c_dsa05',name:'EKO NUR CAHYO',rank:'Masinis II',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'I 080455',dob:'2022-06-15',status:'onboard',coc:'ATT III',cocExp:'2027-04-09',seamanCode:'6211547556S30321',medExp:'2027-04-09',gmdss:'',emergency:'synystere94@gmail.com'},
  {id:'c_dsa06',name:'ILHAM AKBAR',rank:'Masinis III',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'I 124058',dob:'2013-04-17',status:'onboard',coc:'ATT III',cocExp:'2028-07-08',seamanCode:'6212304748TC0625',medExp:'2028-07-08',gmdss:'',emergency:''},
  {id:'c_dsa07',name:'IRWAN F',rank:'Juru Mudi',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'J 006675',dob:'2007-09-20',status:'onboard',coc:'RATINGS',cocExp:'2027-07-15',seamanCode:'6212408406330420',medExp:'2027-07-15',gmdss:'',emergency:'firwan2896@gmail.com'},
  {id:'c_dsa08',name:'MUJAHIDIN',rank:'Juru Mudi',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'L 049428',dob:'2011-10-21',status:'onboard',coc:'RATINGS',cocExp:'2028-11-18',seamanCode:'6212535690330420',medExp:'2028-11-18',gmdss:'',emergency:''},
  {id:'c_dsa09',name:'JUAN RAFAEL MONGGESANG',rank:'Juru Mudi',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'H 097184',dob:'2012-10-30',status:'onboard',coc:'RATINGS',cocExp:'2028-04-27',seamanCode:'6212303937340620',medExp:'2028-04-27',gmdss:'',emergency:'griffinalexander0312@gmail.com'},
  {id:'c_dsa10',name:'ABDI REZA PAHLAWAN',rank:'Juru Minyak',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'J 063998',dob:'2011-10-10',status:'onboard',coc:'RATINGS',cocExp:'2027-07-28',seamanCode:'6212513286354720',medExp:'2027-07-28',gmdss:'',emergency:'ezhazha213@gmail.com'},
  {id:'c_dsa11',name:'ARJUN',rank:'Juru Minyak',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'L 108031',dob:'2013-04-08',status:'onboard',coc:'RATINGS',cocExp:'2027-03-10',seamanCode:'6212554154010420',medExp:'2027-03-10',gmdss:'',emergency:''},
  {id:'c_dsa12',name:'MOHAMAD IKSAN',rank:'Juru Minyak',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'F 342925',dob:'2004-07-13',status:'onboard',coc:'RATINGS',cocExp:'2028-06-20',seamanCode:'6211589022350220',medExp:'2028-06-20',gmdss:'',emergency:'mohamadiksan159@gmail.com'},
  {id:'c_dsa13',name:'FIRMAN',rank:'Juru Masak',vessel:'v1',nationality:'Indonesia',passport:'',seamanbook:'L 079755',dob:'2013-12-01',status:'onboard',coc:'RATINGS',cocExp:'2029-02-16',seamanCode:'6212554100330420',medExp:'2029-02-16',gmdss:'',emergency:'firmanluki027@gmail.com'},
  /* ── LCT LAS 2 (v2) ── */
  {id:'c_las01',name:'ARIS SYAH PUTRA',rank:'Nakhoda',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'J 087216',dob:'1990-04-04',status:'onboard',coc:'ANT II',cocExp:'2029-03-07',seamanCode:'6201097474N20625',medExp:'2029-03-07',gmdss:'',emergency:''},
  {id:'c_las02',name:'SUPRIADI',rank:'Mualim I',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'F 336521',dob:'1992-08-22',status:'onboard',coc:'ANT III MN',cocExp:'2027-04-16',seamanCode:'6201338702M30416',medExp:'2027-04-16',gmdss:'',emergency:'supriadi0961@gmail.com'},
  {id:'c_las03',name:'CHRISTOVER AGUSTINO',rank:'Mualim II',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'H 009787',dob:'2001-10-08',status:'onboard',coc:'ANT III',cocExp:'2027-06-13',seamanCode:'6212126089N32424',medExp:'2027-06-13',gmdss:'',emergency:'christover1010@gmail.com'},
  {id:'c_las04',name:'AMRUL',rank:'KKM',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'H 087864',dob:'1983-06-26',status:'onboard',coc:'ATT III',cocExp:'2028-02-17',seamanCode:'6200269541S30217',medExp:'2028-02-17',gmdss:'',emergency:'amrullappo@gmail.com'},
  {id:'c_las05',name:'MARWAN',rank:'Masinis II',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'J 032705',dob:'1998-09-03',status:'onboard',coc:'ATT II',cocExp:'2027-06-12',seamanCode:'6211592612T20424',medExp:'2027-06-12',gmdss:'',emergency:'marwansuli@gmail.com'},
  {id:'c_las06',name:'MUH. SYAEFULLAH SYAFRIL',rank:'Masinis III',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'G 081448',dob:'2000-10-03',status:'onboard',coc:'ATT III',cocExp:'2027-04-24',seamanCode:'6212023348T30424',medExp:'2027-04-24',gmdss:'',emergency:'msyaefullah536@gmail.com'},
  {id:'c_las07',name:'BACTYAR AFANDI',rank:'Juru Mudi',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'H 070830',dob:'1996-08-10',status:'onboard',coc:'RATINGS ABLE',cocExp:'2027-05-22',seamanCode:'6212210635330522',medExp:'2027-05-22',gmdss:'',emergency:'bactyarafandi12@gmail.com'},
  {id:'c_las08',name:'MARDI SALEH',rank:'Juru Mudi',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'H 095370',dob:'1983-10-10',status:'onboard',coc:'RATINGS',cocExp:'2028-06-22',seamanCode:'6200566287340622',medExp:'2028-06-22',gmdss:'',emergency:''},
  {id:'c_las09',name:'ARFA',rank:'Juru Mudi',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'L 086575',dob:'1998-03-15',status:'onboard',coc:'RATINGS ABLE',cocExp:'2028-10-01',seamanCode:'6211721437344724',medExp:'2028-10-01',gmdss:'',emergency:'patobaarfa31@gmail.com'},
  {id:'c_las10',name:'ARJUNA ASRI',rank:'Juru Minyak',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'J 058738',dob:'1992-01-01',status:'onboard',coc:'RATINGS',cocExp:'2027-04-24',seamanCode:'6212425279350424',medExp:'2027-04-24',gmdss:'',emergency:'arjunaasri008@gmail.com'},
  {id:'c_las11',name:'SUDIRMAN',rank:'Juru Minyak',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'F 253961',dob:'1999-01-02',status:'onboard',coc:'ATT V',cocExp:'2027-04-24',seamanCode:'6211933344T50424',medExp:'2027-04-24',gmdss:'',emergency:'suditt19@gmail.com'},
  {id:'c_las12',name:'ZULFIKAR',rank:'Juru Minyak',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'G 111327',dob:'2002-02-26',status:'onboard',coc:'RATINGS ABLE',cocExp:'2028-01-25',seamanCode:'6212126706420125',medExp:'2028-01-25',gmdss:'',emergency:'zulfikarzulfikar9966@gmail.com'},
  {id:'c_las13',name:'RAEFAL DWI MANTOFANY',rank:'Juru Masak',vessel:'v2',nationality:'Indonesia',passport:'',seamanbook:'L 022246',dob:'1998-07-02',status:'onboard',coc:'RATINGS',cocExp:'2028-04-25',seamanCode:'6212520793330425',medExp:'2028-04-25',gmdss:'',emergency:'raefalraefal@gmail.com'},
  /* ── LCT RADJA SAMUDERA ABADI (v_mofs1k3i_03j8go) ── */
  {id:'c_rsa01',name:'YUSRI YULIUS',rank:'Nakhoda',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'I 038180',dob:'1975-09-08',status:'onboard',coc:'ANT II',cocExp:'2027-04-26',seamanCode:'6200042560N2041',medExp:'2027-04-26',gmdss:'',emergency:'yusri.yulius75@gmail.com'},
  {id:'c_rsa02',name:'ARBI JUSANDI',rank:'Mualim I',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'J 114907',dob:'1997-08-07',status:'onboard',coc:'ANT III',cocExp:'2027-06-23',seamanCode:'6211750634M30623',medExp:'2027-06-23',gmdss:'',emergency:'arbijusandi@gmail.com'},
  {id:'c_rsa03',name:'ASWANDI',rank:'Mualim II',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'G 081970',dob:'2001-04-12',status:'onboard',coc:'ANT III',cocExp:'2027-04-23',seamanCode:'6212105914N30423',medExp:'2027-04-23',gmdss:'',emergency:'aswandimuliadi12@gmail.com'},
  {id:'c_rsa04',name:'MUH. ILHAM SYARIF',rank:'KKM',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'G 111035',dob:'1994-11-10',status:'onboard',coc:'ATT III M',cocExp:'2027-07-19',seamanCode:'6211419530S30419',medExp:'2027-07-19',gmdss:'',emergency:''},
  {id:'c_rsa05',name:'AWALUDDIN',rank:'Masinis II',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'L 077677',dob:'1994-01-01',status:'onboard',coc:'ATT III',cocExp:'2028-04-19',seamanCode:'6211428787S30419',medExp:'2028-04-19',gmdss:'',emergency:''},
  {id:'c_rsa06',name:'MUH. ALDI FARI',rank:'Masinis III',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'I 064999',dob:'2003-05-21',status:'onboard',coc:'ATT III',cocExp:'2027-06-25',seamanCode:'6212215024T30625',medExp:'2027-06-25',gmdss:'',emergency:'aldialdifari14@gmail.com'},
  {id:'c_rsa07',name:'SUIL ASRI',rank:'Juru Mudi',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'L 016316',dob:'2000-02-21',status:'onboard',coc:'RATINGS',cocExp:'2028-04-25',seamanCode:'6212500397330425',medExp:'2028-04-25',gmdss:'',emergency:''},
  {id:'c_rsa08',name:'IRWANSYAH',rank:'Juru Mudi',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'H 054564',dob:'2001-07-17',status:'onboard',coc:'RATINGS',cocExp:'2027-04-22',seamanCode:'6212228545330422',medExp:'2027-04-22',gmdss:'',emergency:'ii8512983@gmail.com'},
  {id:'c_rsa09',name:'MUH. IKFAR RAMAHDANI',rank:'Juru Mudi',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'J 095349',dob:'2005-11-09',status:'onboard',coc:'RATINGS',cocExp:'2027-06-24',seamanCode:'6212456277330424',medExp:'2027-06-24',gmdss:'',emergency:'muhikfarramahdani@gmail.com'},
  {id:'c_rsa10',name:'JAMALUDDIN',rank:'Juru Minyak',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'I 104530',dob:'1998-05-30',status:'onboard',coc:'RATINGS',cocExp:'2027-04-23',seamanCode:'6212341987350423',medExp:'2027-04-23',gmdss:'',emergency:'jamalzxuan6@gmail.com'},
  {id:'c_rsa11',name:'PAJAR ABADI JACOBUS',rank:'Juru Minyak',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'F 253651',dob:'1997-05-18',status:'onboard',coc:'RATINGS',cocExp:'2027-06-20',seamanCode:'6211816251350620',medExp:'2027-06-20',gmdss:'',emergency:'fajarabadi1997@gmail.com'},
  {id:'c_rsa12',name:'ILHAM MAULANA',rank:'Juru Minyak',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'J 058573',dob:'1998-07-24',status:'onboard',coc:'RATINGS',cocExp:'2027-04-24',seamanCode:'6212425326350424',medExp:'2027-04-24',gmdss:'',emergency:'ilhammaulanaa615@gmail.com'},
  {id:'c_rsa13',name:'RIKI ARDIANSYAH',rank:'Juru Masak',vessel:'v_mofs1k3i_03j8go',nationality:'Indonesia',passport:'',seamanbook:'I 091462',dob:'2006-05-12',status:'onboard',coc:'RATINGS',cocExp:'2027-01-24',seamanCode:'6212356202330124',medExp:'2027-01-24',gmdss:'',emergency:'rikiardiansyahriki95@gmail.com'},
  /* ── LCT CINTA SAMUDERA ABADI (v_mofs2u6g_59hzfi) ── */
  {id:'c_csa01',name:'DWI ADITIA ANDRIAWAN',rank:'Nakhoda',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'I 077076',dob:'1995-06-17',status:'onboard',coc:'ANT II',cocExp:'2030-10-29',seamanCode:'6211428797N20625',medExp:'2030-10-29',gmdss:'',emergency:'dwiaditya8188@gmail.com'},
  {id:'c_csa02',name:'HERMANSYAH HASAN',rank:'Mualim I',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'F 104191',dob:'1995-04-27',status:'onboard',coc:'ANT III',cocExp:'2028-06-29',seamanCode:'6211809252N30421',medExp:'2028-06-29',gmdss:'',emergency:'omherr.hermansyah@gmail.com'},
  {id:'c_csa03',name:'MUCHLIS FAJRI S',rank:'Mualim II',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'J 059191',dob:'1999-04-03',status:'onboard',coc:'ANT IV',cocExp:'2027-06-18',seamanCode:'6201305842N40618',medExp:'2027-06-18',gmdss:'',emergency:''},
  {id:'c_csa04',name:'USMAN',rank:'KKM',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'L 113347',dob:'1989-06-10',status:'onboard',coc:'ATT III',cocExp:'2029-04-16',seamanCode:'6201457922S30416',medExp:'2029-04-16',gmdss:'',emergency:'usmanrayna@gmail.com'},
  {id:'c_csa05',name:'MUHAJIR',rank:'Masinis II',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'I 065209',dob:'1994-04-10',status:'onboard',coc:'ATT III',cocExp:'2027-04-24',seamanCode:'6211540515S30424',medExp:'2027-04-24',gmdss:'',emergency:'muhajirajhyr94@gmail.com'},
  {id:'c_csa06',name:'MUH. REZA ASHAR SAPUTRA',rank:'Masinis III',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'J 059389',dob:'2000-09-07',status:'onboard',coc:'ATT III',cocExp:'2027-06-24',seamanCode:'6211700614T30424',medExp:'2027-06-24',gmdss:'',emergency:''},
  {id:'c_csa07',name:'SAHRUL GUNAWAN',rank:'Juru Mudi',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'F 253501',dob:'2001-07-16',status:'onboard',coc:'ABLE',cocExp:'2027-03-26',seamanCode:'6211929430345322',medExp:'2027-03-26',gmdss:'',emergency:'gunawansyah027@gmail.com'},
  {id:'c_csa08',name:'MUHAMMAD AKBAR',rank:'Juru Mudi',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'J 007220',dob:'1998-01-07',status:'onboard',coc:'RATINGS',cocExp:'2027-04-24',seamanCode:'6211832306330424',medExp:'2027-04-24',gmdss:'',emergency:''},
  {id:'c_csa09',name:'JUSNAEDI',rank:'Juru Mudi',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'L 002127',dob:'1998-02-19',status:'onboard',coc:'RATINGS',cocExp:'2028-06-22',seamanCode:'6211814007330622',medExp:'2028-06-22',gmdss:'',emergency:'junaedilea98@gmail.com'},
  {id:'c_csa10',name:'M. WARISTYA SAPUTRA WS',rank:'Juru Minyak',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'L 004521',dob:'2007-01-20',status:'onboard',coc:'RATINGS',cocExp:'2028-04-25',seamanCode:'6212502897350425',medExp:'2028-04-25',gmdss:'',emergency:'waristya495@gmail.com'},
  {id:'c_csa11',name:'MUSLIMIN',rank:'Juru Minyak',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'I 104672',dob:'1996-08-16',status:'onboard',coc:'RATINGS',cocExp:'2027-06-23',seamanCode:'6211604768350623',medExp:'2027-06-23',gmdss:'',emergency:'musliminpelaut98@gmail.com'},
  {id:'c_csa12',name:'AFRIDA SISWANDI',rank:'Juru Minyak',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'J080665',dob:'1996-04-08',status:'onboard',coc:'ABLE',cocExp:'2028-04-22',seamanCode:'6211751297422422',medExp:'2028-04-22',gmdss:'',emergency:'afdalcorslet@gmail.com'},
  {id:'c_csa13',name:'FAISAL',rank:'Juru Masak',vessel:'v_mofs2u6g_59hzfi',nationality:'Indonesia',passport:'',seamanbook:'J 058774',dob:'1995-05-08',status:'onboard',coc:'RATINGS',cocExp:'2027-04-24',seamanCode:'6212425266330424',medExp:'2027-04-24',gmdss:'',emergency:'faisalfaisal8353@gmail.com'}
];

export const INITIAL_DOCUMENTS: VesselDocument[] = [
  /* ══ LCT CINTA SAMUDERA ABADI (v_mofs2u6g_59hzfi) — 34 Dokumen ══ */
  {id:'d_csa01',vessel:'v_mofs2u6g_59hzfi',type:'Registrasi',name:'Certificate of Nationality',issuer:'DJPL Jakarta',issue:'2023-04-03',expiry:'9999-12-31',notes:'PERMANEN'},
  {id:'d_csa02',vessel:'v_mofs2u6g_59hzfi',type:'Registrasi',name:'International Tonnage Certificate (ITC)',issuer:'DJPL Samarinda',issue:'2023-03-28',expiry:'9999-12-31',notes:'PERMANEN'},
  {id:'d_csa03',vessel:'v_mofs2u6g_59hzfi',type:'Safety',name:'Cargo Ship Safety Construction Certificate',issuer:'DJPL Sorong',issue:'2026-04-18',expiry:'2026-07-14',notes:''},
  {id:'d_csa04',vessel:'v_mofs2u6g_59hzfi',type:'Safety',name:'Cargo Ship Safety Equipment Certificate',issuer:'DJPL Jakarta',issue:'2026-01-09',expiry:'2026-07-14',notes:''},
  {id:'d_csa05',vessel:'v_mofs2u6g_59hzfi',type:'Safety',name:'Cargo Ship Safety Radio Certificate',issuer:'DJPL Jakarta',issue:'2026-01-09',expiry:'2026-07-14',notes:''},
  {id:'d_csa06',vessel:'v_mofs2u6g_59hzfi',type:'Kelas BKI',name:'Load Line Certificate (BKI)',issuer:'BKI Jakarta',issue:'2024-12-10',expiry:'2028-09-02',notes:''},
  {id:'d_csa07',vessel:'v_mofs2u6g_59hzfi',type:'Kelas BKI',name:'Machinery Certificate (BKI)',issuer:'BKI Jakarta',issue:'2024-12-10',expiry:'2028-09-02',notes:''},
  {id:'d_csa08',vessel:'v_mofs2u6g_59hzfi',type:'Kelas BKI',name:'Hull Certificate (BKI)',issuer:'BKI Jakarta',issue:'2024-12-10',expiry:'2028-09-02',notes:''},
  {id:'d_csa09',vessel:'v_mofs2u6g_59hzfi',type:'Manning',name:'Safe Manning Document',issuer:'DJPL Jakarta',issue:'2025-09-10',expiry:'2026-09-09',notes:'13 ABK'},
  {id:'d_csa10',vessel:'v_mofs2u6g_59hzfi',type:'Radio',name:'Izin Stasiun Radio Kapal Laut',issuer:'DJPL Jakarta',issue:'2023-04-14',expiry:'2028-04-14',notes:''},
  {id:'d_csa11',vessel:'v_mofs2u6g_59hzfi',type:'MARPOL',name:'National Pollution Prevention Certificate (NOPP)',issuer:'DJPL Sorong',issue:'2026-04-18',expiry:'2026-07-16',notes:''},
  {id:'d_csa12',vessel:'v_mofs2u6g_59hzfi',type:'ISPS',name:'International Ship Security Certificate (ISSC)',issuer:'DJPL Jakarta',issue:'2023-11-27',expiry:'2028-05-04',notes:''},
  {id:'d_csa13',vessel:'v_mofs2u6g_59hzfi',type:'Asuransi',name:'Civil Liability for Bunker Oil Pollution (CLC)',issuer:'DJPL Jakarta',issue:'2026-04-16',expiry:'2027-04-01',notes:''},
  {id:'d_csa14',vessel:'v_mofs2u6g_59hzfi',type:'Safety',name:'Anti Fouling System Certificate (AFS)',issuer:'DJPL Pare-Pare',issue:'2025-08-13',expiry:'2026-08-21',notes:''},
  {id:'d_csa15',vessel:'v_mofs2u6g_59hzfi',type:'ISM',name:'Safety Management Certificate (SMC)',issuer:'BKI Jakarta',issue:'2023-08-23',expiry:'2028-04-02',notes:''},
  {id:'d_csa16',vessel:'v_mofs2u6g_59hzfi',type:'ISM',name:'Document of Compliance (DOC)',issuer:'BKI Jakarta',issue:'2026-02-18',expiry:'2030-09-17',notes:''},
  /* ══ LCT DEWA SAMUDERA ABADI (v1) ══ */
  {id:'d_dsa01',vessel:'v1',type:'Registrasi',name:'Certificate of Nationality',issuer:'DJPL Jakarta',issue:'2021-06-01',expiry:'9999-12-31',notes:'PERMANEN'},
  {id:'d_dsa02',vessel:'v1',type:'Registrasi',name:'International Tonnage Certificate (ITC)',issuer:'DJPL Samarinda',issue:'2021-06-01',expiry:'9999-12-31',notes:'PERMANEN'},
  {id:'d_dsa03',vessel:'v1',type:'Kelas BKI',name:'Load Line Certificate (BKI)',issuer:'BKI Jakarta',issue:'2022-07-01',expiry:'2027-07-01',notes:''},
  {id:'d_dsa04',vessel:'v1',type:'Kelas BKI',name:'Hull Certificate (BKI)',issuer:'BKI Jakarta',issue:'2022-07-01',expiry:'2027-07-01',notes:''},
  {id:'d_dsa06',vessel:'v1',type:'ISM',name:'Safety Management Certificate (SMC)',issuer:'BKI Jakarta',issue:'2021-01-10',expiry:'2026-01-10',notes:''},
  /* ══ LCT LAS 2 (v2) ══ */
  {id:'d_las01',vessel:'v2',type:'Registrasi',name:'Certificate of Nationality',issuer:'DJPL Jakarta',issue:'2015-07-01',expiry:'9999-12-31',notes:'PERMANEN'},
  {id:'d_las02',vessel:'v2',type:'Registrasi',name:'International Tonnage Certificate (ITC)',issuer:'DJPL Samarinda',issue:'2015-07-01',expiry:'9999-12-31',notes:'PERMANEN'},
  {id:'d_las03',vessel:'v2',type:'Kelas BKI',name:'Load Line Certificate (BKI)',issuer:'BKI Samarinda',issue:'2023-03-05',expiry:'2028-03-05',notes:''},
  /* ══ LCT RADJA SAMUDERA ABADI (v_mofs1k3i_03j8go) ══ */
  {id:'d_rsa01',vessel:'v_mofs1k3i_03j8go',type:'Registrasi',name:'Certificate of Nationality',issuer:'DJPL Jakarta',issue:'2014-09-01',expiry:'9999-12-31',notes:'PERMANEN'},
  {id:'d_rsa02',vessel:'v_mofs1k3i_03j8go',type:'Kelas BKI',name:'Load Line Certificate (BKI)',issuer:'BKI Samarinda',issue:'2022-09-01',expiry:'2027-09-01',notes:''}
];

export const INITIAL_ROTATIONS: Rotation[] = [
  {id:'r1',crew:'c_dsa01',vessel:'v1',rank:'Nakhoda',signOn:'2024-12-01',signOff:'2025-06-01',status:'onboard',port:'Samarinda'},
  {id:'r2',crew:'c_dsa02',vessel:'v1',rank:'Mualim I',signOn:'2024-11-15',signOff:'2025-05-15',status:'onboard',port:'Samarinda'},
  {id:'r3',crew:'c_las01',vessel:'v2',rank:'Nakhoda',signOn:'2024-10-15',signOff:'2025-04-15',status:'onboard',port:'Balikpapan'},
  {id:'r4',crew:'c_las04',vessel:'v2',rank:'KKM',signOn:'2024-11-01',signOff:'2025-05-01',status:'onboard',port:'Samarinda'},
  {id:'r5',crew:'c_csa11',vessel:'',rank:'Mualim III',signOn:'2025-05-01',signOff:'2025-10-01',status:'leave',port:''},
  {id:'r6',crew:'c_rsa12',vessel:'v_mofs1k3i_03j8go',rank:'Masinis II',signOn:'2025-05-01',signOff:'',status:'planned',port:'Samarinda'}
];

export const INITIAL_MLCLOGS: MlcLog[] = [
  {id:'mlc1',crew:'c_dsa01',vessel:'v1',date:'2025-04-14',hours:11.5,rest:12.5,notes:'Jaga navigasi pagi, koordinasi tambat'},
  {id:'mlc2',crew:'c_dsa02',vessel:'v1',date:'2025-04-14',hours:13.0,rest:11.0,notes:'Lembur operasi bongkar muatan'},
  {id:'mlc3',crew:'c_las01',vessel:'v2',date:'2025-04-14',hours:14.8,rest:9.2,notes:'Lembur pelabuhan melebihi batas'},
  {id:'mlc4',crew:'c_dsa08',vessel:'v1',date:'2025-04-14',hours:10.5,rest:13.5,notes:'Jaga normal'},
  {id:'mlc5',crew:'c_rsa05',vessel:'v_mofs1k3i_03j8go',date:'2025-04-14',hours:9.0,rest:15.0,notes:'Jaga navigasi siang'},
  {id:'mlc6',crew:'c_rsa06',vessel:'v_mofs1k3i_03j8go',date:'2025-04-14',hours:12.0,rest:12.0,notes:'Perawatan mesin'}
];

export const INITIAL_INCIDENTS: Incident[] = [
  {id:'i1',vessel:'v2',date:'2025-04-08T10:30',type:'Near Miss',description:'Terpeleset di area geladak utama saat kondisi hujan deras. Tidak ada cedera.',action:'Memasang safety tape anti-slip dan tanda peringatan bahaya di area basah.',severity:'medium',status:'Investigasi',investigator:'Ahmad Mabrur'},
  {id:'i2',vessel:'v1',date:'2025-03-20T14:15',type:'Kecelakaan Personel',description:'Cedera tangan ringan pada AB Deck saat operasi muatan di pelabuhan Samarinda.',action:'Pertolongan pertama diberikan, laporan dikirim ke DPA dan manajemen darat.',severity:'high',status:'Ditutup',investigator:'Ahmad Mabrur'},
  {id:'i3',vessel:'v_mofs1k3i_03j8go',date:'2025-02-14T08:00',type:'Near Miss',description:'Kebocoran kecil pada sistem hidrolik di ruang mesin. Segera diatasi oleh tim mesin.',action:'Perbaikan darurat oleh Masinis I. Komponen pengganti dipesan.',severity:'low',status:'Ditutup',investigator:'Ahmad Mabrur'}
];

export const INITIAL_VOYAGES: Voyage[] = [
  {id:'vy1',vessel:'v1',no:'V2025-041',from:'Samarinda',to:'Surabaya',cargo:'Alat Berat & Material Konstruksi',qty:'1.200 MT',start:'2025-04-10T08:00',eta:'2025-04-16T16:00',status:'active'},
  {id:'vy2',vessel:'v2',no:'V2025-039',from:'Balikpapan',to:'Bitung',cargo:'Peti Kemas (Container)',qty:'800 MT',start:'2025-04-12T06:00',eta:'2025-04-18T12:00',status:'active'},
  {id:'vy3',vessel:'v_mofs1k3i_03j8go',no:'V2025-038',from:'Samarinda',to:'Makassar',cargo:'Material Konstruksi Jalan',qty:'1.200 MT',start:'2025-04-08T07:00',eta:'2025-04-15T10:00',status:'port'},
  {id:'vy4',vessel:'v_mofs2u6g_59hzfi',no:'DOC-2025-003',from:'Samarinda',to:'Galangan Kapal',cargo:'Dry Dock Maintenance',qty:'—',start:'2025-04-01T00:00',eta:'2025-04-30T00:00',status:'port'}
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {time:'2 jam lalu',text:'LCT. LAS 2 — Sign-ON Capt. Agus Setiawan dikonfirmasi',ship:'LCT. LAS 2',col:'var(--neon)'},
  {time:'5 jam lalu',text:'Dokumen ISPS Code LCT. Dewa Samudera Abadi diperbarui',ship:'LCT. DEWA SAMUDERA ABADI',col:'var(--success)'},
  {time:'1 hari lalu',text:'Pelanggaran MLC terdeteksi — Capt. Agus Setiawan melampaui 14j kerja',ship:'LCT. LAS 2',col:'var(--danger)'},
  {time:'2 hari lalu',text:'Voyage V2025-041 dimulai dari Samarinda menuju Surabaya',ship:'LCT. DEWA SAMUDERA ABADI',col:'var(--neon2)'},
  {time:'3 hari lalu',text:'Near-miss dilaporkan di LCT. Radja Samudera Abadi',ship:'LCT. RADJA SAMUDERA ABADI',col:'var(--warning)'}
];

export const INITIAL_PAYROLL: PayrollEntry[] = [
  // LCT LAS 2 (v2)
  {id:'pay_las01',crewId:'c_las01',vesselId:'v2',month:'2026-04',gajiPokok:16500000,gajiAktual:16500000,tambahanKenaikan:0,tunjanganOps:7000000,tambahanLain:0,hariAktif:30,penguranganOff:0,totalGaji:23500000,bpjsKes:84550,bpjsTK:190000,jkk:84550,jkm:28500,jhttk:351500,jpKantor:190000,jpKaryawan:95000,potonganPPh21:148946,potonganMCU:0,gajiBersih:23075504,rekening:'0255233058',bank:'BNI',keterangan:''},
  {id:'pay_las02',crewId:'c_las02',vesselId:'v2',month:'2026-04',gajiPokok:9500000,gajiAktual:10000000,tambahanKenaikan:500000,tunjanganOps:2000000,tambahanLain:1500000,hariAktif:30,penguranganOff:0,totalGaji:13000000,bpjsKes:71200,bpjsTK:160000,jkk:71200,jkm:24000,jhttk:296000,jpKantor:160000,jpKaryawan:80000,potonganPPh21:965712,potonganMCU:0,gajiBersih:11803088,rekening:'1813760777',bank:'BNI',keterangan:'SSO/ORU'},
  {id:'pay_las03',crewId:'c_las03',vesselId:'v2',month:'2026-04',gajiPokok:8000000,gajiAktual:8000000,tambahanKenaikan:0,tunjanganOps:1000000,tambahanLain:0,hariAktif:30,penguranganOff:0,totalGaji:9000000,bpjsKes:62300,bpjsTK:140000,jkk:62300,jkm:21000,jhttk:259000,jpKantor:140000,jpKaryawan:70000,potonganPPh21:154583,potonganMCU:0,gajiBersih:8642817,rekening:'1118191563',bank:'BNI',keterangan:''},
  {id:'pay_las04',crewId:'c_las04',vesselId:'v2',month:'2026-04',gajiPokok:12500000,gajiAktual:13000000,tambahanKenaikan:500000,tunjanganOps:4000000,tambahanLain:0,hariAktif:30,penguranganOff:0,totalGaji:16500000,bpjsKes:80100,bpjsTK:180000,jkk:80100,jkm:27000,jhttk:333000,jpKantor:180000,jpKaryawan:90000,potonganPPh21:1292697,potonganMCU:0,gajiBersih:14947203,rekening:'1223026916',bank:'BNI',keterangan:''},
  /* ── LCT DEWA SAMUDERA ABADI (v1) ── */
  {id:'pay_dsa01',crewId:'c_dsa01',vesselId:'v1',month:'2026-04',gajiPokok:16500000,gajiAktual:17000000,tambahanKenaikan:500000,tunjanganOps:7500000,tambahanLain:0,hariAktif:30,penguranganOff:0,totalGaji:24000000,bpjsKes:84550,bpjsTK:190000,jkk:84550,jkm:28500,jhttk:351500,jpKantor:190000,jpKaryawan:95000,potonganPPh21:1337914,potonganMCU:0,gajiBersih:22387536,rekening:'0246957527',bank:'BNI',keterangan:''},
  {id:'pay_dsa02',crewId:'c_dsa02',vesselId:'v1',month:'2026-04',gajiPokok:9500000,gajiAktual:10000000,tambahanKenaikan:500000,tunjanganOps:2000000,tambahanLain:1500000,hariAktif:30,penguranganOff:0,totalGaji:13000000,bpjsKes:71200,bpjsTK:160000,jkk:71200,jkm:24000,jhttk:296000,jpKantor:160000,jpKaryawan:80000,potonganPPh21:1126664,potonganMCU:0,gajiBersih:11641336,rekening:'1223027080',bank:'BNI',keterangan:''}
];

export const INITIAL_CREWDOCS: CrewDocument[] = [
  {id:'cd_csa01a',crewId:'c_csa01',type:'COC',docNumber:'6211428797N20625',issuer:'DJPL Jakarta',place:'Jakarta',issue:'2025-10-29',expiry:'2030-10-29',status:'valid',notes:'ANT II'},
  {id:'cd_csa01b',crewId:'c_csa01',type:'Seaman Book',docNumber:'I 077076',issuer:'DJPL',place:'Jakarta',issue:'2020-01-01',expiry:'2027-01-01',status:'valid',notes:''},
  {id:'cd_csa01c',crewId:'c_csa01',type:'Medical Certificate',docNumber:'MCU-2025-001',issuer:'Klinik Pelaut',place:'Jakarta',issue:'2025-01-01',expiry:'2027-01-01',status:'valid',notes:''},
  {id:'cd_csa02a',crewId:'c_csa02',type:'COC',docNumber:'6211809252N30421',issuer:'DJPL Jakarta',place:'Jakarta',issue:'2023-06-29',expiry:'2028-06-29',status:'valid',notes:'ANT III'},
  {id:'cd_csa02b',crewId:'c_csa02',type:'Seaman Book',docNumber:'F 104191',issuer:'DJPL',place:'Jakarta',issue:'2021-01-01',expiry:'2028-01-01',status:'valid',notes:''},
  {id:'cd_las01a',crewId:'c_las01',type:'COC',docNumber:'6201097474N20625',issuer:'DJPL Jakarta',place:'Jakarta',issue:'2025-03-07',expiry:'2030-03-07',status:'valid',notes:'ANT II'},
  {id:'cd_las02a',crewId:'c_las02',type:'COC',docNumber:'6201338702M30416',issuer:'DJPL Jakarta',place:'Jakarta',issue:'2022-04-16',expiry:'2027-04-16',status:'valid',notes:'ANT III MN'},
  {id:'cd_dsa01a',crewId:'c_dsa01',type:'COC',docNumber:'6200099261N20423',issuer:'DJPL Jakarta',place:'Jakarta',issue:'2023-04-23',expiry:'2028-04-23',status:'valid',notes:'ANT II'}
];
