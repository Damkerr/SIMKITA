import { useState, useEffect, useCallback } from "react";

const USERS = [
  { id: "admin", username: "admin", password: "admin123", role: "admin", nama: "Administrator SIMKITA" },
  { id: "op1", username: "operator1", password: "op123", role: "operator", nama: "Operator Bidang KUMKM" },
  { id: "op2", username: "operator2", password: "op456", role: "operator", nama: "Operator Bidang Koperasi" },
];

const BULAN_LIST = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const IKU_LIST = [
  { id: "iku1", label: "Rasio Volume Usaha Koperasi terhadap PDRB", target: 0.80 },
  { id: "iku2", label: "Rasio Kewirausahaan", target: 2.25 },
  { id: "iku3", label: "Persentase Koperasi yang Berkualitas", target: 70.00 },
  { id: "iku4", label: "Persentase Usaha Kecil dari Informal ke Formal", target: 5.00 },
  { id: "iku5", label: "Persentase Pertumbuhan Kewirausahaan", target: null },
];

const RENCANA_DEFAULT = [759337891.71,985115526.22,1393673783.41,821703291.71,1107453491.71,1375291783.41,752550891.71,1106997758.92,696812891.71,717453491.71,870775991.71,219033357.07];

const DOKUMEN_SAKIP = [
  {id:1,nama:"Renstra Perangkat Daerah",komponen:"Perencanaan Kinerja",bobot:4,bulan:0,tw:"TW 1"},
  {id:2,nama:"Renja (Rencana Kerja) Tahunan",komponen:"Perencanaan Kinerja",bobot:3.5,bulan:0,tw:"TW 1"},
  {id:3,nama:"Perjanjian Kinerja Kepala OPD",komponen:"Perencanaan Kinerja",bobot:4,bulan:0,tw:"TW 1"},
  {id:4,nama:"Indikator Kinerja Utama (IKU)",komponen:"Perencanaan Kinerja",bobot:3.5,bulan:0,tw:"TW 1"},
  {id:5,nama:"DPA (Dok. Pelaksanaan Anggaran)",komponen:"Perencanaan Kinerja",bobot:3,bulan:0,tw:"TW 1"},
  {id:6,nama:"SK Tim Evaluasi SAKIP Internal 2027",komponen:"Evaluasi Internal",bobot:2.5,bulan:0,tw:"TW 1"},
  {id:7,nama:"Cascading / Pohon Kinerja",komponen:"Perencanaan Kinerja",bobot:3,bulan:1,tw:"TW 1"},
  {id:8,nama:"Perjanjian Kinerja Eselon III & IV",komponen:"Perencanaan Kinerja",bobot:3,bulan:1,tw:"TW 1"},
  {id:9,nama:"LKjIP (Lap. Kinerja Inst. Pemerintah) 2027",komponen:"Pelaporan Kinerja",bobot:5,bulan:1,tw:"TW 1"},
  {id:10,nama:"Ringkasan Eksekutif LKjIP",komponen:"Pelaporan Kinerja",bobot:2.5,bulan:1,tw:"TW 1"},
  {id:11,nama:"Rencana Aksi Kinerja",komponen:"Perencanaan Kinerja",bobot:2.5,bulan:2,tw:"TW 1"},
  {id:12,nama:"Dok. Identifikasi Risiko Kinerja",komponen:"Perencanaan Kinerja",bobot:3.5,bulan:2,tw:"TW 1"},
  {id:13,nama:"Tindak Lanjut Hasil Evaluasi SAKIP Tahun Lalu",komponen:"Evaluasi Internal",bobot:4,bulan:2,tw:"TW 1"},
  {id:14,nama:"Reviu LKjIP oleh APIP / Inspektorat",komponen:"Evaluasi Internal",bobot:4,bulan:2,tw:"TW 1"},
  {id:15,nama:"Laporan Capaian Kinerja TW I",komponen:"Pengukuran Kinerja",bobot:3.5,bulan:3,tw:"TW 2"},
  {id:16,nama:"Laporan Pengawasan Berbasis Risiko (PKPT)",komponen:"Evaluasi Internal",bobot:3.5,bulan:5,tw:"TW 2"},
  {id:17,nama:"Laporan Capaian Kinerja TW II",komponen:"Pengukuran Kinerja",bobot:3.5,bulan:6,tw:"TW 3"},
  {id:18,nama:"Pengukuran IKU Semester I",komponen:"Pengukuran Kinerja",bobot:2.5,bulan:6,tw:"TW 3"},
  {id:19,nama:"Monitoring Rencana Aksi Semester I",komponen:"Pengukuran Kinerja",bobot:2.5,bulan:6,tw:"TW 3"},
  {id:20,nama:"Laporan Capaian Kinerja TW III",komponen:"Pengukuran Kinerja",bobot:3.5,bulan:9,tw:"TW 4"},
  {id:21,nama:"Hasil Self Assessment SAKIP",komponen:"Evaluasi Internal",bobot:3.5,bulan:9,tw:"TW 4"},
  {id:22,nama:"Laporan Evaluasi SAKIP Internal",komponen:"Evaluasi Internal",bobot:5,bulan:10,tw:"TW 4"},
  {id:23,nama:"Pengukuran IKU Semester II / Tahunan",komponen:"Pengukuran Kinerja",bobot:2.5,bulan:11,tw:"TW 4"},
  {id:24,nama:"Monitoring Rencana Aksi Semester II",komponen:"Pengukuran Kinerja",bobot:2.5,bulan:11,tw:"TW 4"},
  {id:25,nama:"Data Dukung Capaian Kinerja",komponen:"Pengukuran Kinerja",bobot:3,bulan:11,tw:"TW 4"},
  {id:26,nama:"Rekap Realisasi Anggaran vs Target Kinerja",komponen:"Pengukuran Kinerja",bobot:3,bulan:11,tw:"TW 4"},
  {id:27,nama:"Laporan Realisasi Fisik & Keuangan",komponen:"Pelaporan Kinerja",bobot:2.5,bulan:11,tw:"TW 4"},
  {id:28,nama:"Profil Kinerja OPD",komponen:"Pelaporan Kinerja",bobot:2.5,bulan:11,tw:"TW 4"},
  {id:29,nama:"Laporan Kontribusi IKD",komponen:"Pelaporan Kinerja",bobot:2.5,bulan:11,tw:"TW 4"},
  {id:30,nama:"Dokumentasi Diseminasi Hasil Evaluasi",komponen:"Evaluasi Internal",bobot:2.5,bulan:11,tw:"TW 4"},
  {id:31,nama:"Laporan Capaian Kinerja TW IV",komponen:"Pengukuran Kinerja",bobot:3.5,bulan:0,tw:"TW 4"},
];

const KOMPONEN_SAKIP = ["Perencanaan Kinerja","Pengukuran Kinerja","Pelaporan Kinerja","Evaluasi Internal"];
const BOBOT_KOMPONEN = {"Perencanaan Kinerja":30,"Pengukuran Kinerja":30,"Pelaporan Kinerja":15,"Evaluasi Internal":25};

// HELPERS
const fRp = (n) => n||n===0 ? "Rp "+Number(n).toLocaleString("id-ID",{maximumFractionDigits:0}) : "—";
const fPct = (n) => (n===null||n===undefined||n==="") ? "—" : Number(n).toFixed(2)+"%";
const getPredikat = (s) => {
  if(s>=90) return {label:"AA – Sangat Memuaskan",color:"#1a5276"};
  if(s>=80) return {label:"A – Memuaskan",color:"#1e8449"};
  if(s>=70) return {label:"BB – Sangat Baik",color:"#27ae60"};
  if(s>=60) return {label:"B – Baik",color:"#f39c12"};
  if(s>=50) return {label:"CC – Cukup",color:"#e67e22"};
  return {label:"C – Kurang",color:"#c0392b"};
};
const getSerapanStatus = (p) => {
  if(p===0) return {label:"Belum Direalisasi",color:"#7f8c8d"};
  if(p>=90) return {label:"✅ Baik",color:"#1e8449"};
  if(p>=70) return {label:"⚠️ Sedang",color:"#f39c12"};
  return {label:"❌ Rendah",color:"#c0392b"};
};
const getIKUStatus = (val, target) => {
  if(val===null||val===undefined||val==="") return {label:"Belum ada data",color:"#94a3b8"};
  if(!target) return {label:fPct(val),color:"#2980b9"};
  const p=(Number(val)/target)*100;
  if(p>=100) return {label:"✅ Tercapai",color:"#1e8449"};
  if(p>=75)  return {label:"⚠️ Mendekati",color:"#f39c12"};
  return {label:"❌ Kritis",color:"#c0392b"};
};

// RUPIAH INPUT COMPONENT
// Menampilkan angka dengan pemisah ribuan saat diketik, menyimpan nilai numerik murni
function RupiahInput({value, onChange, disabled, style={}}) {
  const [display, setDisplay] = useState("");
  const [focused, setFocused] = useState(false);

  // Format angka ke string dengan titik pemisah ribuan
  const toDisplay = (val) => {
    const num = Number(String(val).replace(/\./g,"").replace(/,/g,""));
    if(!val && val !== 0) return "";
    if(isNaN(num)) return "";
    return num.toLocaleString("id-ID");
  };

  // Sinkronkan display saat value berubah dari luar (bukan saat sedang diketik)
  useEffect(()=>{
    if(!focused) setDisplay(toDisplay(value));
  }, [value, focused]);

  const handleFocus = () => {
    setFocused(true);
    // Saat fokus, tampilkan tanpa titik agar mudah diedit
    const num = Number(String(value).replace(/\./g,""));
    setDisplay(num > 0 ? String(num) : "");
  };

  const handleBlur = () => {
    setFocused(false);
    const raw = String(display).replace(/\./g,"").replace(/,/g,"").replace(/[^0-9]/g,"");
    const num = raw ? Number(raw) : 0;
    onChange(num);
    setDisplay(toDisplay(num));
  };

  const handleChange = (e) => {
    // Hanya izinkan angka
    const raw = e.target.value.replace(/[^0-9]/g,"");
    setDisplay(raw);
    onChange(raw ? Number(raw) : 0);
  };

  return (
    <div style={{position:"relative", display:"flex", alignItems:"center"}}>
      <span style={{position:"absolute",left:8,fontSize:11,color:"#94a3b8",pointerEvents:"none",zIndex:1}}>Rp</span>
      <input
        type="text"
        inputMode="numeric"
        value={focused ? display : toDisplay(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="0"
        style={{paddingLeft:26, textAlign:"right", fontWeight:600, ...style}}
      />
    </div>
  );
}

const initData = () => ({
  iku: BULAN_LIST.map((b,i)=>({bulan:b,idx:i,iku1:"",iku2:"",iku3:"",iku4:"",iku5:"",rencana:RENCANA_DEFAULT[i],realisasi:i===0?80000000:""})),
  dokumen: DOKUMEN_SAKIP.map(d=>({...d,status:[1,2,3,4,5,7,8,11].includes(d.id)?"ADA":"",link:""})),
  lastUpdate:null
});

const computeAll = (data) => {
  const {iku,dokumen} = data;
  const skorPerKomponen = {};
  KOMPONEN_SAKIP.forEach(k=>{skorPerKomponen[k]=dokumen.filter(d=>d.komponen===k&&d.status==="ADA").reduce((s,d)=>s+d.bobot,0);});
  const totalSkor = Object.values(skorPerKomponen).reduce((a,b)=>a+b,0);
  const totalRencana = iku.reduce((s,b)=>s+(Number(b.rencana)||0),0);
  const totalRealisasi = iku.reduce((s,b)=>s+(Number(b.realisasi)||0),0);
  const serapanTotal = totalRencana>0?(totalRealisasi/totalRencana)*100:0;
  const ikuAvg = IKU_LIST.map(def=>{
    const vals=iku.map(b=>b[def.id]).filter(v=>v!==""&&v!==null&&v!==undefined).map(Number);
    return vals.length>0?vals.reduce((a,b)=>a+b,0)/vals.length:null;
  });
  const twGroups=[[0,1,2],[3,4,5],[6,7,8],[9,10,11]];
  const twData=twGroups.map(months=>{
    const rencana=months.reduce((s,i)=>s+(Number(iku[i]?.rencana)||0),0);
    const realisasi=months.reduce((s,i)=>s+(Number(iku[i]?.realisasi)||0),0);
    const serapan=rencana>0?(realisasi/rencana)*100:0;
    const ikuAvgs=IKU_LIST.map(def=>{
      const vals=months.map(i=>iku[i][def.id]).filter(v=>v!==""&&v!==null).map(Number);
      return vals.length>0?vals.reduce((a,b)=>a+b,0)/vals.length:null;
    });
    const sakipPerKomponen={};
    KOMPONEN_SAKIP.forEach(k=>{sakipPerKomponen[k]=dokumen.filter(d=>d.komponen===k&&d.status==="ADA"&&months.includes(d.bulan)).reduce((s,d)=>s+d.bobot,0);});
    return {rencana,realisasi,serapan,ikuAvgs,sakipPerKomponen};
  });
  return {skorPerKomponen,totalSkor,totalRencana,totalRealisasi,serapanTotal,ikuAvg,twData};
};

// STYLES
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0f4f8;color:#1a2332}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-thumb{background:#2563a8;border-radius:3px}
.fade-in{animation:fi 0.35s ease}
@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
table{border-collapse:collapse;width:100%}
th,td{padding:7px 11px;text-align:left;border-bottom:1px solid #dde4ee;font-size:12.5px}
th{background:#1a4a8a;color:#fff;font-weight:600;font-size:11px;letter-spacing:.04em;text-transform:uppercase;position:sticky;top:0;z-index:2}
tr:hover td{background:#f0f6ff}
input[type=number],input[type=text],select{width:100%;padding:5px 9px;border:1px solid #c5d4e8;border-radius:6px;font-family:inherit;font-size:12.5px;background:#fff;color:#1a2332;outline:none;transition:border .2s}
input:focus,select:focus{border-color:#2563a8;box-shadow:0 0 0 3px rgba(37,99,168,.12)}
.badge{display:inline-block;padding:2px 9px;border-radius:12px;font-size:11px;font-weight:700}
.btn{padding:7px 18px;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;transition:all .2s}
.btn-primary{background:#1a4a8a;color:#fff}
.btn-primary:hover{background:#143d73;transform:translateY(-1px);box-shadow:0 4px 12px rgba(26,74,138,.3)}
`;

// LOGIN
function LoginPage({onLogin}) {
  const [form,setForm]=useState({username:"",password:""});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const doLogin=()=>{
    setErr("");setLoading(true);
    setTimeout(()=>{
      const u=USERS.find(u=>u.username===form.username&&u.password===form.password);
      if(u) onLogin(u); else setErr("Username atau password salah.");
      setLoading(false);
    },500);
  };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f2d5c,#1a4a8a,#1e6aa8)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400}} className="fade-in">
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:68,height:68,background:"rgba(255,255,255,.15)",border:"2px solid rgba(255,255,255,.3)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:30}}>🏛️</div>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",marginBottom:5}}>Pemerintah Provinsi Sulawesi Tenggara</div>
          <h1 style={{color:"#fff",fontSize:21,fontWeight:800}}>SIMKITA Terpadu</h1>
          <div style={{color:"rgba(255,255,255,.65)",fontSize:12,marginTop:3}}>Dinas Koperasi, UMKM — 2026</div>
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:"28px 26px",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
          <h2 style={{fontSize:17,fontWeight:700,color:"#1a2332",marginBottom:5}}>Masuk ke Sistem</h2>
          <p style={{fontSize:12.5,color:"#64748b",marginBottom:22}}>Monitoring IKU · SAKIP · Anggaran</p>
          {["username","password"].map(f=>(
            <div key={f} style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"#374151",marginBottom:5,textTransform:"uppercase",letterSpacing:".05em"}}>{f}</label>
              <input type={f==="password"?"password":"text"} placeholder={`Masukkan ${f}`} value={form[f]}
                onChange={e=>setForm({...form,[f]:e.target.value})}
                onKeyDown={e=>e.key==="Enter"&&doLogin()}
                style={{width:"100%",padding:"9px 13px",border:"1.5px solid #dde4ee",borderRadius:8,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
            </div>
          ))}
          {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"9px 13px",color:"#b91c1c",fontSize:12.5,marginBottom:14}}>⚠️ {err}</div>}
          <button className="btn btn-primary" onClick={doLogin} disabled={loading} style={{width:"100%",padding:"11px",fontSize:14,fontWeight:700}}>
            {loading?"Memverifikasi...":"Masuk"}
          </button>
          <div style={{marginTop:18,padding:12,background:"#f8fafc",borderRadius:8,fontSize:11.5,color:"#64748b"}}>
            <strong style={{color:"#374151"}}>Akun Demo:</strong><br/>
            Admin: <code>admin / admin123</code><br/>
            Operator: <code>operator1 / op123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

// SIDEBAR
function Sidebar({active,onNav,user,onLogout,collapsed,onToggle}) {
  const nav=[
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    ...(user.role==="admin"?[{id:"input",icon:"✏️",label:"Input Data"}]:[]),
    {id:"rekap",icon:"📋",label:"Rekap Triwulan"},
    ...(user.role!=="admin"?[{id:"evidence",icon:"🔗",label:"Link Evidence"}]:[]),
    {id:"panduan",icon:"📖",label:"Panduan"},
  ];
  if(user.role==="admin") nav.push({id:"pengguna",icon:"👥",label:"Kelola Pengguna"});
  return (
    <div style={{width:collapsed?60:230,background:"linear-gradient(180deg,#0f2d5c,#1a4a8a)",height:"100vh",position:"fixed",left:0,top:0,display:"flex",flexDirection:"column",transition:"width .25s",zIndex:100,overflow:"hidden"}}>
      <div style={{padding:collapsed?"16px 0":"16px 14px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:8,justifyContent:collapsed?"center":"space-between"}}>
        {!collapsed&&<div><div style={{color:"#fff",fontSize:14,fontWeight:800}}>SIMKITA</div><div style={{color:"rgba(255,255,255,.5)",fontSize:10}}>KUMKM SULTRA 2026</div></div>}
        <button onClick={onToggle} style={{background:"rgba(255,255,255,.1)",border:"none",color:"#fff",cursor:"pointer",borderRadius:6,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>
          {collapsed?"→":"←"}
        </button>
      </div>
      <nav style={{flex:1,padding:"10px 6px",overflowY:"auto"}}>
        {nav.map(item=>(
          <button key={item.id} onClick={()=>onNav(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:collapsed?"9px":"9px 11px",borderRadius:8,border:"none",background:active===item.id?"rgba(255,255,255,.15)":"transparent",color:active===item.id?"#fff":"rgba(255,255,255,.65)",cursor:"pointer",marginBottom:3,fontSize:12.5,fontWeight:active===item.id?700:500,fontFamily:"inherit",transition:"all .15s",justifyContent:collapsed?"center":"flex-start",borderLeft:active===item.id?"3px solid #60a5fa":"3px solid transparent"}}>
            <span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>
            {!collapsed&&item.label}
          </button>
        ))}
      </nav>
      <div style={{padding:collapsed?"10px 6px":"10px 14px",borderTop:"1px solid rgba(255,255,255,.1)"}}>
        {!collapsed&&<div style={{marginBottom:8}}><div style={{color:"#fff",fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.nama}</div><div style={{color:"rgba(255,255,255,.5)",fontSize:10,textTransform:"capitalize"}}>{user.role}</div></div>}
        <button className="btn" onClick={onLogout} style={{width:"100%",background:"rgba(192,57,43,.8)",color:"#fff",fontSize:12,padding:"7px",display:"flex",alignItems:"center",gap:5,justifyContent:collapsed?"center":"flex-start"}}>
          <span>🚪</span>{!collapsed&&"Keluar"}
        </button>
      </div>
    </div>
  );
}

// STAT CARD
function Card({icon,label,value,sub,color="#1a4a8a"}) {
  return (
    <div style={{background:"#fff",borderRadius:12,padding:"18px 22px",boxShadow:"0 2px 12px rgba(0,0,0,.06)",borderTop:`4px solid ${color}`,flex:1,minWidth:160}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:7}}>{label}</div>
          <div style={{fontSize:26,fontWeight:800,color,lineHeight:1}}>{value}</div>
          {sub&&<div style={{fontSize:11,color:"#94a3b8",marginTop:5}}>{sub}</div>}
        </div>
        <div style={{fontSize:26,opacity:.8}}>{icon}</div>
      </div>
    </div>
  );
}

// DASHBOARD
function DashboardPage({data}) {
  const c=computeAll(data);
  const pred=getPredikat(c.totalSkor);
  const dokAda=data.dokumen.filter(d=>d.status==="ADA").length;
  const linkAda=data.dokumen.filter(d=>d.link&&d.link.trim()!=="").length;
  return (
    <div className="fade-in">
      <div style={{background:"linear-gradient(135deg,#0f2d5c,#1a4a8a)",borderRadius:14,padding:"22px 26px",marginBottom:22,color:"#fff"}}>
        <div style={{fontSize:10,letterSpacing:".12em",opacity:.7,textTransform:"uppercase",marginBottom:4}}>Dinas Koperasi, UMKM — Provinsi Sulawesi Tenggara</div>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:4}}>Dashboard Monitoring Kinerja Terpadu 2026</h2>
        <div style={{fontSize:12.5,opacity:.75}}>IKU KUMKM · Dokumen SAKIP · Realisasi Anggaran</div>
      </div>
      <div style={{display:"flex",gap:14,marginBottom:22,flexWrap:"wrap"}}>
        <Card icon="🏆" label="Skor SAKIP" value={c.totalSkor.toFixed(1)} sub="dari 100 poin" color={pred.color}/>
        <Card icon="📜" label="Predikat SAKIP" value={pred.label.split(" – ")[0]} sub={pred.label.split(" – ")[1]} color={pred.color}/>
        <Card icon="💰" label="Serapan Anggaran" value={c.serapanTotal.toFixed(2)+"%"} sub={`Rp ${(c.totalRealisasi/1e9).toFixed(2)}M dari Rp ${(c.totalRencana/1e9).toFixed(2)}M`} color={c.serapanTotal>=70?"#1e8449":"#c0392b"}/>
        <Card icon="📂" label="Dokumen SAKIP" value={`${dokAda}/31`} sub={`${linkAda} ada link evidence`} color="#7c3aed"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid #e8edf8",fontSize:13,fontWeight:700,color:"#1a2332"}}>📈 Capaian IKU vs Target</div>
          <div style={{overflowX:"auto"}}><table>
            <thead><tr><th>#</th><th>Indikator</th><th>Target</th><th>Capaian</th><th>Status</th></tr></thead>
            <tbody>{IKU_LIST.map((def,i)=>{
              const avg=c.ikuAvg[i];const st=getIKUStatus(avg,def.target);
              return <tr key={def.id}><td style={{fontWeight:700,color:"#1a4a8a"}}>{i+1}</td><td style={{fontSize:11.5}}>{def.label}</td><td style={{fontWeight:600}}>{def.target?def.target+"%":"—"}</td><td style={{fontWeight:700,color:"#1a4a8a"}}>{avg!==null?avg.toFixed(2)+"%":"—"}</td><td><span className="badge" style={{background:st.color+"22",color:st.color}}>{st.label}</span></td></tr>;
            })}</tbody>
          </table></div>
        </div>
        <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid #e8edf8",fontSize:13,fontWeight:700,color:"#1a2332"}}>🎯 Skor SAKIP Per Komponen</div>
          <table><thead><tr><th>#</th><th>Komponen</th><th>Bobot</th><th>Skor</th><th>%</th><th>Predikat</th></tr></thead>
          <tbody>
            {KOMPONEN_SAKIP.map((k,i)=>{
              const bobot=BOBOT_KOMPONEN[k];const skor=c.skorPerKomponen[k]||0;const pct=bobot>0?(skor/bobot)*100:0;const pred2=getPredikat(pct);
              return <tr key={k}><td style={{fontWeight:700,color:"#1a4a8a"}}>{i+1}</td><td style={{fontSize:11.5,fontWeight:500}}>{k}</td><td>{bobot}</td><td style={{fontWeight:700}}>{skor.toFixed(1)}</td><td style={{fontWeight:600}}>{pct.toFixed(1)}%</td><td><span className="badge" style={{background:pred2.color+"22",color:pred2.color,fontSize:10}}>{pred2.label.split(" – ")[0]}</span></td></tr>;
            })}
            <tr style={{background:"#f0f6ff"}}><td colSpan={2} style={{fontWeight:700}}>TOTAL SKOR SAKIP</td><td style={{fontWeight:700}}>100</td><td style={{fontWeight:800,color:pred.color}}>{c.totalSkor.toFixed(1)}</td><td style={{fontWeight:800,color:pred.color}}>{c.totalSkor.toFixed(1)}%</td><td><span className="badge" style={{background:pred.color+"22",color:pred.color}}>{pred.label.split(" – ")[0]}</span></td></tr>
          </tbody></table>
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #e8edf8",fontSize:13,fontWeight:700,color:"#1a2332"}}>💵 Rekap Realisasi Anggaran Bulanan</div>
        <div style={{overflowX:"auto"}}><table>
          <thead><tr><th>#</th><th>Bulan</th><th>Rencana (Rp)</th><th>Realisasi (Rp)</th><th>Serapan (%)</th><th>Status</th></tr></thead>
          <tbody>
            {data.iku.map((b,i)=>{const real=Number(b.realisasi)||0;const sep=b.rencana>0?(real/b.rencana)*100:0;const st=getSerapanStatus(sep);return <tr key={i}><td style={{fontWeight:700,color:"#1a4a8a"}}>{i+1}</td><td style={{fontWeight:500}}>{b.bulan}</td><td>{fRp(b.rencana)}</td><td style={{fontWeight:real>0?700:400}}>{real>0?fRp(real):"—"}</td><td style={{fontWeight:600,color:st.color}}>{real>0?sep.toFixed(2)+"%":"0%"}</td><td><span className="badge" style={{background:st.color+"22",color:st.color}}>{st.label}</span></td></tr>;})}
            <tr style={{background:"#f0f6ff"}}><td colSpan={2} style={{fontWeight:800}}>TOTAL KUMULATIF</td><td style={{fontWeight:700}}>{fRp(c.totalRencana)}</td><td style={{fontWeight:700}}>{fRp(c.totalRealisasi)}</td><td style={{fontWeight:800,color:c.serapanTotal>=70?"#1e8449":"#c0392b"}}>{c.serapanTotal.toFixed(2)}%</td><td>—</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}

// INPUT PAGE
function InputPage({data,onSave,user}) {
  const [ld,setLd]=useState(JSON.parse(JSON.stringify(data)));
  const [saved,setSaved]=useState(false);
  const [tab,setTab]=useState("iku");
  const isAdmin=user?.role==="admin";

  const upd=(i,f,v)=>{const nd={...ld};nd.iku[i][f]=v;setLd(nd);};
  const updDoc=(id,f,v)=>{const nd={...ld};const idx=nd.dokumen.findIndex(d=>d.id===id);if(idx!==-1)nd.dokumen[idx][f]=v;setLd(nd);};
  const save=()=>{onSave({...ld,lastUpdate:new Date().toISOString()});setSaved(true);setTimeout(()=>setSaved(false),3000);};

  const tabSt=(t)=>({padding:"9px 18px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12.5,fontWeight:600,borderRadius:"8px 8px 0 0",background:tab===t?"#fff":"#e8edf8",color:tab===t?"#1a4a8a":"#64748b",borderBottom:tab===t?"2px solid #1a4a8a":"2px solid transparent"});

  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div><h2 style={{fontSize:19,fontWeight:800,color:"#1a2332"}}>✏️ Input Data Terpadu</h2><p style={{fontSize:12.5,color:"#64748b",marginTop:2}}>IKU & Anggaran Bulanan + Kelengkapan Dokumen SAKIP</p></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {saved&&<span style={{color:"#1e8449",fontSize:12.5,fontWeight:600}}>✅ Data berhasil disimpan!</span>}
          <button className="btn btn-primary" onClick={save}>💾 Simpan Data</button>
        </div>
      </div>
      <div style={{display:"flex",gap:0,marginBottom:0}}>
        <button style={tabSt("iku")} onClick={()=>setTab("iku")}>📊 Capaian IKU & Anggaran</button>
        <button style={tabSt("dokumen")} onClick={()=>setTab("dokumen")}>📂 Kelengkapan Dokumen SAKIP</button>
      </div>
      <div style={{background:"#fff",borderRadius:"0 12px 12px 12px",boxShadow:"0 2px 12px rgba(0,0,0,.06)",overflow:"hidden"}}>
        {tab==="iku"&&(
          <div style={{overflowX:"auto"}}>
            <div style={{padding:"12px 18px",background:"#f0f6ff",borderBottom:"1px solid #dde4ee",fontSize:12,color:"#1a4a8a"}}>
              <strong>Petunjuk:</strong> Isi capaian IKU (dalam %) dan realisasi anggaran setiap bulan. Kolom anggaran otomatis berformat Rp dengan pemisah ribuan.
              {isAdmin
                ?<span style={{marginLeft:10,background:"#fef3c7",color:"#b45309",padding:"2px 9px",borderRadius:8,fontWeight:700}}>✏️ Admin — Rencana Anggaran dapat diubah</span>
                :<span style={{marginLeft:10,background:"#f1f5f9",color:"#64748b",padding:"2px 9px",borderRadius:8,fontWeight:600}}>🔒 Rencana Anggaran hanya bisa diubah Admin</span>
              }
            </div>
            <table>
              <thead><tr>
                <th>#</th><th>Bulan</th>
                <th style={{minWidth:100}}>IKU-1 Vol.Usaha/PDRB (%)</th>
                <th style={{minWidth:100}}>IKU-2 Rasio Wirausaha (%)</th>
                <th style={{minWidth:100}}>IKU-3 Koperasi Berkualitas (%)</th>
                <th style={{minWidth:100}}>IKU-4 Usaha Kecil ke Formal (%)</th>
                <th style={{minWidth:100}}>IKU-5 Pertumb. Wirausaha (%)</th>
                <th style={{minWidth:130}}>Rencana Anggaran (Rp) {isAdmin?"✏️":"🔒"}</th>
                <th style={{minWidth:150}}>Realisasi Anggaran (Rp)</th>
              </tr></thead>
              <tbody>{ld.iku.map((row,i)=>(
                <tr key={i}>
                  <td style={{fontWeight:700,color:"#1a4a8a"}}>{i+1}</td>
                  <td style={{fontWeight:600}}>{row.bulan}</td>
                  {["iku1","iku2","iku3","iku4","iku5"].map(f=>(
                    <td key={f} style={{padding:"5px 7px"}}><input type="number" step="0.01" placeholder="—" value={row[f]} onChange={e=>upd(i,f,e.target.value)}/></td>
                  ))}
                  <td style={{padding:isAdmin?"5px 7px":undefined,fontSize:12,color:"#64748b",fontWeight:500}}>
                    {isAdmin
                      ?<RupiahInput value={row.rencana} onChange={v=>upd(i,"rencana",v)} style={{borderColor:"#f59e0b",background:"#fffbeb"}}/>
                      :fRp(row.rencana)
                    }
                  </td>
                  <td style={{padding:"5px 7px"}}><RupiahInput value={row.realisasi} onChange={v=>upd(i,"realisasi",v)}/></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {tab==="dokumen"&&(
          <div style={{overflowX:"auto"}}>
            <div style={{padding:"12px 18px",background:"#f0f6ff",borderBottom:"1px solid #dde4ee",fontSize:12,color:"#1a4a8a"}}>
              <strong>Petunjuk:</strong> Pilih status <strong>ADA</strong> atau <strong>TIDAK ADA</strong>. Isi <strong>Link Evidence</strong> jika ada URL dokumen.
            </div>
            <table>
              <thead><tr><th>#</th><th>Nama Dokumen</th><th>Komponen</th><th>Bobot</th><th>Periode</th><th>TW</th><th style={{minWidth:150}}>Status</th><th>Ket.</th><th style={{minWidth:190}}>🔗 Link Evidence</th><th>Skor</th></tr></thead>
              <tbody>
                {ld.dokumen.map(doc=>(
                  <tr key={doc.id}>
                    <td style={{fontWeight:700,color:"#1a4a8a"}}>{doc.id}</td>
                    <td style={{fontSize:11.5,maxWidth:230}}>{doc.nama}</td>
                    <td style={{fontSize:10.5}}><span className="badge" style={{background:"#e8f4fd",color:"#1a4a8a"}}>{doc.komponen}</span></td>
                    <td style={{fontWeight:700}}>{doc.bobot}</td>
                    <td style={{fontSize:11.5}}>{BULAN_LIST[doc.bulan]}</td>
                    <td><span className="badge" style={{background:"#f0f4ff",color:"#5c3aed"}}>{doc.tw}</span></td>
                    <td style={{padding:"5px 7px"}}>
                      <select value={doc.status} onChange={e=>updDoc(doc.id,"status",e.target.value)}
                        style={{borderColor:doc.status==="ADA"?"#1e8449":doc.status==="TIDAK ADA"?"#c0392b":"#c5d4e8",color:doc.status==="ADA"?"#1e8449":doc.status==="TIDAK ADA"?"#c0392b":"#94a3b8",fontWeight:600}}>
                        <option value="">— Belum —</option>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                      </select>
                    </td>
                    <td style={{fontSize:11.5,color:doc.status==="ADA"?"#1e8449":doc.status==="TIDAK ADA"?"#c0392b":"#94a3b8"}}>
                      {doc.status==="ADA"?"✅ Tersedia":doc.status==="TIDAK ADA"?"❌ Tidak Ada":"⬛ Belum"}
                    </td>
                    <td style={{padding:"5px 7px"}}>
                      {doc.status==="ADA"
                        ?<div style={{display:"flex",gap:4,alignItems:"center"}}>
                            <input type="text" placeholder="https://..." value={doc.link||""} onChange={e=>updDoc(doc.id,"link",e.target.value)} style={{fontSize:11,padding:"4px 7px"}}/>
                            {doc.link&&<a href={doc.link} target="_blank" rel="noopener noreferrer" style={{fontSize:13,textDecoration:"none",flexShrink:0}}>🔗</a>}
                          </div>
                        :<span style={{fontSize:11,color:"#94a3b8"}}>—</span>
                      }
                    </td>
                    <td style={{fontWeight:700,color:doc.status==="ADA"?"#1e8449":"#94a3b8"}}>{doc.status==="ADA"?doc.bobot:0}</td>
                  </tr>
                ))}
                <tr style={{background:"#f0f6ff"}}>
                  <td colSpan={9} style={{fontWeight:800}}>TOTAL SKOR SAKIP (dari 100)</td>
                  <td style={{fontWeight:800,fontSize:15,color:"#1a4a8a"}}>{ld.dokumen.filter(d=>d.status==="ADA").reduce((s,d)=>s+d.bobot,0).toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// REKAP
function RekapPage({data}) {
  const c=computeAll(data);
  const twL=["TW I (Jan–Mar)","TW II (Apr–Jun)","TW III (Jul–Sep)","TW IV (Okt–Des)"];
  return (
    <div className="fade-in">
      <div style={{marginBottom:22}}><h2 style={{fontSize:19,fontWeight:800,color:"#1a2332"}}>📋 Rekap Kinerja Per Triwulan</h2><p style={{fontSize:12.5,color:"#64748b",marginTop:2}}>Agregasi otomatis dari data input bulanan</p></div>
      {/* A. IKU */}
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)",marginBottom:18}}>
        <div style={{padding:"13px 18px",background:"#1a4a8a",color:"#fff",fontSize:13,fontWeight:700}}>A. Capaian IKU Per Triwulan</div>
        <div style={{overflowX:"auto"}}><table>
          <thead><tr><th>#</th><th>Indikator Kinerja Utama</th><th>Target</th>{twL.map(t=><th key={t}>{t}</th>)}<th>Rata-rata Tahunan</th></tr></thead>
          <tbody>{IKU_LIST.map((def,i)=>{const annual=c.ikuAvg[i];return(
            <tr key={def.id}><td style={{fontWeight:700,color:"#1a4a8a"}}>{i+1}</td><td style={{fontSize:11.5}}>{def.label}</td><td style={{fontWeight:600}}>{def.target?def.target+"%":"—"}</td>
            {c.twData.map((tw,ti)=><td key={ti} style={{fontWeight:tw.ikuAvgs[i]!==null?700:400,color:tw.ikuAvgs[i]!==null?"#1a4a8a":"#94a3b8"}}>{tw.ikuAvgs[i]!==null?tw.ikuAvgs[i].toFixed(2)+"%":"—"}</td>)}
            <td style={{fontWeight:800,color:annual!==null?"#1a4a8a":"#94a3b8"}}>{annual!==null?annual.toFixed(2)+"%":"—"}</td></tr>
          );})}</tbody>
        </table></div>
      </div>
      {/* B. Anggaran */}
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)",marginBottom:18}}>
        <div style={{padding:"13px 18px",background:"#1a4a8a",color:"#fff",fontSize:13,fontWeight:700}}>B. Realisasi Anggaran Per Triwulan</div>
        <div style={{overflowX:"auto"}}><table>
          <thead><tr><th>#</th><th>Komponen</th><th>Total</th>{twL.map(t=><th key={t}>{t}</th>)}<th>% Serapan</th></tr></thead>
          <tbody>
            <tr><td style={{fontWeight:700,color:"#1a4a8a"}}>1</td><td style={{fontWeight:600}}>Rencana Realisasi (Rp)</td><td style={{fontWeight:700}}>{fRp(c.totalRencana)}</td>{c.twData.map((tw,ti)=><td key={ti}>{fRp(tw.rencana)}</td>)}<td style={{fontWeight:700}}>100.00%</td></tr>
            <tr><td style={{fontWeight:700,color:"#1a4a8a"}}>2</td><td style={{fontWeight:600}}>Realisasi Anggaran (Rp)</td><td style={{fontWeight:700}}>{fRp(c.totalRealisasi)}</td>{c.twData.map((tw,ti)=><td key={ti} style={{fontWeight:tw.realisasi>0?700:400,color:tw.realisasi>0?"#1a4a8a":"#94a3b8"}}>{tw.realisasi>0?fRp(tw.realisasi):"—"}</td>)}<td style={{fontWeight:700,color:c.serapanTotal>=70?"#1e8449":"#c0392b"}}>{c.serapanTotal.toFixed(2)}%</td></tr>
            <tr><td style={{fontWeight:700,color:"#1a4a8a"}}>3</td><td style={{fontWeight:600}}>Persentase Serapan (%)</td><td style={{fontWeight:700,color:c.serapanTotal>=70?"#1e8449":"#c0392b"}}>{c.serapanTotal.toFixed(2)}%</td>{c.twData.map((tw,ti)=><td key={ti} style={{fontWeight:700,color:tw.serapan>=70?"#1e8449":tw.serapan>0?"#c0392b":"#94a3b8"}}>{tw.serapan>0?tw.serapan.toFixed(2)+"%":"—"}</td>)}<td>—</td></tr>
          </tbody>
        </table></div>
      </div>
      {/* C. SAKIP */}
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
        <div style={{padding:"13px 18px",background:"#1a4a8a",color:"#fff",fontSize:13,fontWeight:700}}>C. Skor SAKIP Per Komponen & Triwulan</div>
        <div style={{overflowX:"auto"}}><table>
          <thead><tr><th>#</th><th>Komponen SAKIP</th><th>Bobot Maks</th>{twL.map(t=><th key={t}>{t}</th>)}<th>Total Skor</th></tr></thead>
          <tbody>
            {KOMPONEN_SAKIP.map((k,i)=>{const total=c.skorPerKomponen[k]||0;return(
              <tr key={k}><td style={{fontWeight:700,color:"#1a4a8a"}}>{i+1}</td><td style={{fontWeight:600,fontSize:11.5}}>{k}</td><td>{BOBOT_KOMPONEN[k]}</td>
              {c.twData.map((tw,ti)=><td key={ti} style={{fontWeight:700}}>{(tw.sakipPerKomponen[k]||0).toFixed(1)}</td>)}
              <td style={{fontWeight:800,color:"#1a4a8a"}}>{total.toFixed(1)}</td></tr>
            );})}
            <tr style={{background:"#f0f6ff"}}><td colSpan={2} style={{fontWeight:800}}>TOTAL SKOR SAKIP</td><td style={{fontWeight:700}}>100</td>{c.twData.map((tw,ti)=><td key={ti} style={{fontWeight:800,color:"#1a4a8a"}}>{Object.values(tw.sakipPerKomponen).reduce((a,b)=>a+b,0).toFixed(1)}</td>)}<td style={{fontWeight:800,fontSize:14,color:"#1a4a8a"}}>{c.totalSkor.toFixed(1)}</td></tr>
            <tr><td colSpan={8} style={{fontWeight:800,color:getPredikat(c.totalSkor).color,fontSize:13}}>PREDIKAT AKHIR SAKIP: {getPredikat(c.totalSkor).label}</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}

// PANDUAN
function PanduanPage() {
  return (
    <div className="fade-in" style={{maxWidth:860}}>
      <div style={{background:"linear-gradient(135deg,#0f2d5c,#1a4a8a)",borderRadius:14,padding:"22px 26px",marginBottom:22,color:"#fff"}}>
        <h2 style={{fontSize:20,fontWeight:800}}>📖 Panduan Penggunaan SIMKITA</h2>
        <p style={{fontSize:12.5,opacity:.8,marginTop:5}}>Sistem Monitoring Kinerja Terpadu — Dinas KUMKM Prov. Sulawesi Tenggara · TA 2026</p>
      </div>
      <div style={{background:"#fff",borderRadius:12,padding:22,marginBottom:18,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
        <h3 style={{fontSize:14,fontWeight:700,color:"#1a4a8a",marginBottom:14,borderBottom:"2px solid #e8edf8",paddingBottom:7}}>A. Informasi Dasar OPD</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["Nama OPD","Dinas Koperasi, Usaha Mikro, Kecil dan Menengah Provinsi Sulawesi Tenggara"],["Kepala Dinas","Dr. La Ode Muh. Shalihin, S.Pd.,M.Pd — NIP: 197209271998021005"],["Kode SKPD","2.17.0.00.0.00.01.0000"],["Nomor DPA","DPA/A.1/2.17.0.00.0.00.01.0000/001/2026"],["Total Pagu","Rp 10.806.200.151 | Penetapan: 20 Januari 2026"],["Tahun Anggaran","2026"]].map(([k,v])=>(
            <div key={k} style={{background:"#f8fafc",borderRadius:8,padding:"11px 14px"}}>
              <div style={{fontSize:10.5,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:3}}>{k}</div>
              <div style={{fontSize:12.5,fontWeight:600,color:"#1a2332"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)",marginBottom:18}}>
        <div style={{padding:"13px 18px",background:"#1a4a8a",color:"#fff",fontSize:13,fontWeight:700}}>B. Bobot & Komponen SAKIP</div>
        <table><thead><tr><th>Komponen</th><th>Bobot</th><th>Jml Dok</th><th>Dokumen yang Dinilai</th></tr></thead>
        <tbody>
          {[["Perencanaan Kinerja","30","9","Renstra, Renja, PK, IKU, Cascading, Rencana Aksi, DPA, Risiko Kinerja, PK Es. III&IV"],["Pengukuran Kinerja","30","10","Lap. Capaian TW I–IV, Pengukuran IKU Sem I–II, Monitoring Aksi, Data Dukung, Rekap Anggaran"],["Pelaporan Kinerja","15","5","LKjIP, Ringkasan Eksekutif, Lap. Realisasi Fisik&Keu, Profil OPD, Kontribusi IKD"],["Evaluasi Akuntabilitas Internal","25","7","SK Tim Evaluasi, Tindak Lanjut, Reviu APIP, PKPT, Self Assessment, Lap. Evaluasi, Diseminasi"]].map(([k,b,d,ket])=>(
            <tr key={k}><td style={{fontWeight:600}}>{k}</td><td style={{fontWeight:700,color:"#1a4a8a"}}>{b}</td><td style={{fontWeight:600}}>{d}</td><td style={{fontSize:11.5,color:"#64748b"}}>{ket}</td></tr>
          ))}
        </tbody></table>
      </div>
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)",marginBottom:18}}>
        <div style={{padding:"13px 18px",background:"#1a4a8a",color:"#fff",fontSize:13,fontWeight:700}}>C. Predikat SAKIP</div>
        <table><thead><tr><th>Rentang Skor</th><th>Predikat</th><th>Keterangan</th></tr></thead>
        <tbody>
          {[["90–100","AA","Sangat Memuaskan"],["80–89.99","A","Memuaskan"],["70–79.99","BB","Sangat Baik"],["60–69.99","B","Baik"],["50–59.99","CC","Cukup"],["< 50","C","Kurang / Perlu Perhatian"]].map(([r,p,k])=>{const col=getPredikat(r==="< 50"?0:parseInt(r)).color;return<tr key={p}><td style={{fontWeight:600}}>{r}</td><td><span className="badge" style={{background:col+"22",color:col,fontSize:12}}>{p}</span></td><td style={{fontWeight:500}}>{k}</td></tr>;})}
        </tbody></table>
      </div>
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
        <div style={{padding:"13px 18px",background:"#1a4a8a",color:"#fff",fontSize:13,fontWeight:700}}>D. IKU — Dinas KUMKM Sultra 2026</div>
        <table><thead><tr><th>#</th><th>Indikator</th><th>Target</th><th>Formula</th></tr></thead>
        <tbody>
          {[[1,"Rasio Volume Usaha Koperasi terhadap PDRB","0.80%","Vol. Usaha Koperasi ÷ PDRB Wilayah × 100%"],[2,"Rasio Kewirausahaan","2.25%","∑ Wirausahawan ÷ ∑ Penduduk Usia Produktif × 100%"],[3,"Persentase Koperasi yang Berkualitas","70.00%","∑ Koperasi RAT ÷ ∑ Total Koperasi × 100%"],[4,"Persentase Usaha Kecil dari Informal ke Formal","5.00%","∑ Usaha Kecil ber-NIB ÷ ∑ Total Usaha Kecil × 100%"],[5,"Persentase Pertumbuhan Kewirausahaan","—","∑(Wirausaha Pemula + Mapan) ÷ ∑ Angkatan Kerja × 100%"]].map(([no,ind,target,formula])=>(
            <tr key={no}><td style={{fontWeight:700,color:"#1a4a8a"}}>{no}</td><td style={{fontWeight:600,fontSize:12}}>{ind}</td><td style={{fontWeight:700,color:"#1e8449"}}>{target}</td><td style={{fontSize:11.5,color:"#64748b"}}>{formula}</td></tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}

// KELOLA PENGGUNA
function KelolaPenggunaPage() {
  return (
    <div className="fade-in">
      <h2 style={{fontSize:19,fontWeight:800,color:"#1a2332",marginBottom:5}}>👥 Kelola Pengguna</h2>
      <p style={{fontSize:12.5,color:"#64748b",marginBottom:18}}>Daftar akun yang dapat mengakses SIMKITA</p>
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
        <table><thead><tr><th>Username</th><th>Nama</th><th>Role</th><th>Status</th></tr></thead>
        <tbody>
          {USERS.map(u=>(
            <tr key={u.id}>
              <td style={{fontWeight:700,fontFamily:"monospace"}}>{u.username}</td>
              <td>{u.nama}</td>
              <td><span className="badge" style={{background:u.role==="admin"?"#1a4a8a22":"#1e844922",color:u.role==="admin"?"#1a4a8a":"#1e8449",textTransform:"capitalize"}}>{u.role}</span></td>
              <td><span className="badge" style={{background:"#1e844922",color:"#1e8449"}}>Aktif</span></td>
            </tr>
          ))}
        </tbody></table>
        <div style={{padding:14,background:"#f8fafc",fontSize:12,color:"#94a3b8"}}>ℹ️ Fitur tambah/hapus pengguna akan tersedia di versi berikutnya.</div>
      </div>
    </div>
  );
}

// ACCESS DENIED
function AccessDeniedPage() {
  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16}}>
      <div style={{fontSize:56}}>🔒</div>
      <h2 style={{fontSize:20,fontWeight:800,color:"#c0392b"}}>Akses Ditolak</h2>
      <p style={{fontSize:13,color:"#64748b",textAlign:"center",maxWidth:340}}>Halaman ini hanya dapat diakses oleh <strong>Administrator</strong>. Silakan hubungi admin jika Anda membutuhkan akses.</p>
    </div>
  );
}

// EVIDENCE PAGE (untuk Operator)
function EvidencePage({data}) {
  const dokAda = data.dokumen.filter(d=>d.status==="ADA");
  const dokBerlink = dokAda.filter(d=>d.link&&d.link.trim()!=="");
  return (
    <div className="fade-in">
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:19,fontWeight:800,color:"#1a2332"}}>🔗 Link Evidence Dokumen SAKIP</h2>
        <p style={{fontSize:12.5,color:"#64748b",marginTop:2}}>Daftar tautan dokumen bukti yang telah diunggah oleh Administrator</p>
      </div>
      <div style={{display:"flex",gap:14,marginBottom:18,flexWrap:"wrap"}}>
        <div style={{background:"#fff",borderRadius:12,padding:"16px 22px",boxShadow:"0 2px 12px rgba(0,0,0,.06)",borderTop:"4px solid #1a4a8a",flex:1,minWidth:140}}>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Total Dokumen ADA</div>
          <div style={{fontSize:28,fontWeight:800,color:"#1a4a8a"}}>{dokAda.length}<span style={{fontSize:14,fontWeight:500,color:"#94a3b8"}}>/31</span></div>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"16px 22px",boxShadow:"0 2px 12px rgba(0,0,0,.06)",borderTop:"4px solid #7c3aed",flex:1,minWidth:140}}>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Dokumen Berlink</div>
          <div style={{fontSize:28,fontWeight:800,color:"#7c3aed"}}>{dokBerlink.length}</div>
        </div>
      </div>
      {dokBerlink.length===0 ? (
        <div style={{background:"#fff",borderRadius:12,padding:32,textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <div style={{fontSize:36,marginBottom:10}}>📭</div>
          <div style={{fontSize:13.5,color:"#94a3b8"}}>Belum ada link evidence yang tersedia. Hubungi Administrator.</div>
        </div>
      ) : (
        <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <table>
            <thead><tr><th>#</th><th>Nama Dokumen</th><th>Komponen</th><th>Bobot</th><th>TW</th><th>Status</th><th>🔗 Link Evidence</th></tr></thead>
            <tbody>
              {dokBerlink.map((doc,i)=>(
                <tr key={doc.id}>
                  <td style={{fontWeight:700,color:"#1a4a8a"}}>{i+1}</td>
                  <td style={{fontSize:11.5,maxWidth:230,fontWeight:500}}>{doc.nama}</td>
                  <td><span className="badge" style={{background:"#e8f4fd",color:"#1a4a8a"}}>{doc.komponen}</span></td>
                  <td style={{fontWeight:700}}>{doc.bobot}</td>
                  <td><span className="badge" style={{background:"#f0f4ff",color:"#5c3aed"}}>{doc.tw}</span></td>
                  <td><span className="badge" style={{background:"#1e844922",color:"#1e8449"}}>✅ ADA</span></td>
                  <td>
                    <a href={doc.link} target="_blank" rel="noopener noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:5,color:"#1a4a8a",fontSize:12,fontWeight:600,textDecoration:"none",background:"#f0f6ff",padding:"4px 10px",borderRadius:6,border:"1px solid #c5d4e8"}}>
                      🔗 Buka Link
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {dokAda.filter(d=>!d.link||d.link.trim()==="").length>0&&(
        <div style={{marginTop:18,background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <div style={{padding:"12px 18px",background:"#f8fafc",borderBottom:"1px solid #e8edf8",fontSize:12.5,fontWeight:700,color:"#64748b"}}>📋 Dokumen ADA namun Belum Ada Link</div>
          <table>
            <thead><tr><th>#</th><th>Nama Dokumen</th><th>Komponen</th><th>TW</th><th>Keterangan</th></tr></thead>
            <tbody>
              {dokAda.filter(d=>!d.link||d.link.trim()==="").map((doc,i)=>(
                <tr key={doc.id}>
                  <td style={{fontWeight:700,color:"#94a3b8"}}>{i+1}</td>
                  <td style={{fontSize:11.5,color:"#64748b"}}>{doc.nama}</td>
                  <td><span className="badge" style={{background:"#f1f5f9",color:"#94a3b8"}}>{doc.komponen}</span></td>
                  <td><span className="badge" style={{background:"#f0f4ff",color:"#5c3aed"}}>{doc.tw}</span></td>
                  <td style={{fontSize:11.5,color:"#94a3b8"}}>Link belum diisi oleh Admin</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// MAIN APP
export default function App() {
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);
  const [appData,setAppData]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    try{
      const s=localStorage.getItem("simkita_data");
      setAppData(s?JSON.parse(s):initData());
    }catch{
      setAppData(initData());
    }
    setLoading(false);
  },[]);

  useEffect(()=>{
    try{const s=sessionStorage.getItem("simkita_user");if(s)setUser(JSON.parse(s));}catch{}
  },[]);

  const login=(u)=>{setUser(u);try{sessionStorage.setItem("simkita_user",JSON.stringify(u));}catch{}};
  const logout=()=>{setUser(null);try{sessionStorage.removeItem("simkita_user");}catch{}};
  const save=useCallback((nd)=>{setAppData(nd);try{localStorage.setItem("simkita_data",JSON.stringify(nd));}catch{}},[]);

  if(loading) return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f4f8"}}><div style={{textAlign:"center"}}><div style={{fontSize:38,marginBottom:10}}>🏛️</div><div style={{fontSize:13.5,color:"#64748b"}}>Memuat SIMKITA...</div></div></div>;
  if(!user) return <><style>{css}</style><LoginPage onLogin={login}/></>;

  const ml=collapsed?60:230;
  return (
    <>
      <style>{css}</style>
      <Sidebar active={page} onNav={setPage} user={user} onLogout={logout} collapsed={collapsed} onToggle={()=>setCollapsed(p=>!p)}/>
      <main style={{marginLeft:ml,minHeight:"100vh",background:"#f0f4f8",transition:"margin-left .25s"}}>
        <div style={{background:"#fff",borderBottom:"1px solid #e8edf8",padding:"11px 26px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
          <div style={{fontSize:12,color:"#94a3b8"}}>🏛️ Dinas KUMKM Sulawesi Tenggara &nbsp;›&nbsp; <strong style={{color:"#1a4a8a"}}>SIMKITA 2026</strong></div>
          <div style={{display:"flex",gap:14,alignItems:"center",fontSize:12,color:"#64748b"}}>
            {appData?.lastUpdate&&<span>Update: {new Date(appData.lastUpdate).toLocaleString("id-ID")}</span>}
            <span style={{background:"#f0f6ff",color:"#1a4a8a",padding:"3px 11px",borderRadius:20,fontWeight:600}}>👤 {user.nama}</span>
          </div>
        </div>
        <div style={{padding:26}}>
          {page==="dashboard"&&<DashboardPage data={appData}/>}
          {page==="input"&&(user.role==="admin"?<InputPage data={appData} onSave={save} user={user}/>:<AccessDeniedPage/>)}
          {page==="rekap"&&<RekapPage data={appData}/>}
          {page==="panduan"&&<PanduanPage/>}
          {page==="pengguna"&&user.role==="admin"&&<KelolaPenggunaPage/>}
          {page==="evidence"&&<EvidencePage data={appData}/>}
        </div>
      </main>
    </>
  );
}
