/* ====================================================================
   THE EDIT — shared data layer (prototype "database")
   One source of truth shared by: storefront, admin, supplier portal.
   Backed by localStorage so all three pages (in the same browser) stay
   in sync live across tabs. Replace with a real backend later.
   ==================================================================== */
(function () {
  const KEY = 'theedit_v4'; // bumped so every visitor gets the new seed

  const GOV = [
    { n: "Capital", ar: "العاصمة", p: 1.5, areas: ["Kuwait City","Sharq","Mirqab","Qibla","Dasman","Dasma","Daiya","Abdullah Al-Salem","Mansouriya","Faiha","Nuzha","Kaifan","Khaldiya","Adailiya","Shamiya","Rawda","Yarmouk","Qadsiya","Surra","Qurtuba","Granada","Jaber Al-Ahmad","Sulaibikhat","Doha","Shuwaikh","Nahda","Failaka"] },
    { n: "Hawalli", ar: "حولي", p: 1.5, areas: ["Hawalli","Salmiya","Rumaithiya","Bayan","Mishref","Jabriya","Salwa","Maidan Hawalli","Nugra","Hitteen","Shaab","Salam","Zahra","Al-Bidea","Anjafa"] },
    { n: "Farwaniya", ar: "الفروانية", p: 2, areas: ["Farwaniya","Khaitan","Abraq Khaitan","Jleeb Al-Shuyoukh","Ardiya","Rabiya","Rehab","Firdous","Ishbiliya","Andalous","Omariya","Dhajeej","Sabah Al-Nasser","Abdullah Al-Mubarak","Riggae","Rai"] },
    { n: "Mubarak Al-Kabeer", ar: "مبارك الكبير", p: 2, areas: ["Mubarak Al-Kabeer","Sabah Al-Salem","Messila","Al-Qurain","Al-Qusour","Adan","Fnaitees","Abu Futaira","Abu Al-Hasaniya","Wista"] },
    { n: "Ahmadi", ar: "الأحمدي", p: 2.5, areas: ["Ahmadi","Fahaheel","Mangaf","Abu Halifa","Fintas","Mahboula","Riqqa","Hadiya","Sabahiya","Jaber Al-Ali","Egaila","Fahad Al-Ahmad","Ali Sabah Al-Salem","Sabah Al-Ahmad","Wafra","Khairan","Bnaider"] },
    { n: "Jahra", ar: "الجهراء", p: 3, areas: ["Jahra","Saad Al-Abdullah","Naeem","Naseem","Qasr","Oyoun","Taima","Waha","Sulaibiya","Amghara","Kabd","Abdali","Subiya"] }
  ];

  const SEED = {
    currency: "KWD",
    drop: { name: "The Aurora", edition: 200 },
    videos: {
      intro: "",
      product: ""
    },
    products: [
      { id: "runner", name: "The Desert Runner", price: 28, total: 150, left: 150, status: "live",
        variant: "Limited run · 150 pairs", supplier: "aurora_co",
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1100&q=80",
        yt: "",
        desc: "Drop 01. A shoe built for Kuwait streets — light, tough, beautiful.",
        options: [
          { name: "Size", values: ["40","41","42","43","44","45"] },
          { name: "Colour", values: ["Red","Black","White"] }
        ],
        optImgs: {
          "Red":   "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1100&q=80",
          "Black": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1100&q=80",
          "White": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1100&q=80"
        },
        feat1: { img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1100&q=80",
                 head: "Runs cool in 50°.",
                 text: "Breathable mesh built for Gulf summers — tested on Kuwait asphalt in July, not in a catalogue." },
        feat2: { img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1100&q=80",
                 head: "Every stitch, checked.",
                 text: "I refused three factories before this one. This is the pair I kept for myself." } },
      { id: "aurora", name: "The Aurora", price: 89, total: 200, left: 47, status: "draft",
        variant: "Champagne · 40mm", supplier: "aurora_co",
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1100&q=80",
        yt: "",
        desc: "Drop 02. A watch engineered to be worn." }
    ],
    comingSoon: [
      { id: "cs1", title: "The Field Bag", tease: "Everyday carry, rebuilt.", tag: "Coming soon", img: "" },
      { id: "cs2", title: "Desk Series", tease: "The objects on my desk.", tag: "Coming soon", img: "" },
      { id: "cs3", title: "Signature Scent", tease: "A collaboration I've been waiting to share.", tag: "Coming soon", img: "" }
    ],
    suppliers: [
      { id: "aurora_co", name: "Aurora Watches Co.", productId: "aurora", user: "aurora_watches", pass: "aurora-2026", active: true, pickup: "Shuwaikh Industrial, Block 2, St 28, Warehouse 14" }
    ],
    delivery: { "Capital": 1.5, "Hawalli": 1.5, "Farwaniya": 2, "Mubarak Al-Kabeer": 2, "Ahmadi": 2.5, "Jahra": 3 },
    gccShipping: { "Saudi Arabia": 12, "United Arab Emirates": 10, "Qatar": 11, "Bahrain": 9, "Oman": 13 },
    couriers: ["DHL", "Aramex"],
    driverFee: 1.0,
    drivers: [
      { id:"drv1", name:"Mohammed (demo)", type:"individual", phone:"+965 6000 0000", civilId:"290010100000", license:"DL-114052", vehicle:"Toyota Hilux · 1-23456", active:true }
    ],
    orders: [
      mk("AE-1042","Yousef Al-Sabah","+965 5000 1234","Hawalli","Salmiya","10","3","12","","cod","new","new","Today 14:20"),
      mk("AE-1041","Dana Al-Ali","+965 6611 7788","Hawalli","Jabriya","4","1","7","2","link","new","new","Today 12:05"),
      mk("AE-1040","Fahad Nasser","+965 9988 4455","Hawalli","Mishref","6","1","8","","link","await","prep","Today 09:40"),
      mk("AE-1039","Latifa Kareem","+965 5544 3322","Hawalli","Salwa","12","5","30","","cod","delivery","ready","Yesterday"),
      mk("AE-1038","Omar Saleh","+965 6700 1199","Hawalli","Bayan","8","4","21","3","paid","delivery","picked","Yesterday"),
      mk("AE-1037","Mariam Adel","+965 5123 9090","Hawalli","Rumaithiya","3","9","15","","link","delivered","picked","2 days ago")
    ],
    seq: 1043
  };

  function mk(id,name,phone,gov,area,block,street,house,avenue,pay,payStatus,prepStatus,date){
    let driverStatus="unassigned", driverId=null;
    if(prepStatus==="picked"){ driverStatus="delivered"; driverId="drv1"; }
    return { id, name, phone, country:"Kuwait", ship:"driver", courier:null, tracking:"", gov, area, block, street, house, avenue,
      items:[{ productId:"aurora", n:"The Aurora", q:1, p:89 }],
      fee: SEEDFEE(gov), pay, payStatus, prepStatus, driverStatus, driverId, cashDeclared:false, date };
  }
  function SEEDFEE(gov){ const m={ "Capital":1.5,"Hawalli":1.5,"Farwaniya":2,"Mubarak Al-Kabeer":2,"Ahmadi":2.5,"Jahra":3 }; return m[gov]||2; }

  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function load(){ try{ const r=localStorage.getItem(KEY); const s=r?JSON.parse(r):clone(SEED); if(!s.waitlist) s.waitlist=[]; if(!s.customers) s.customers=[]; return s;}catch(e){ const s=clone(SEED); s.waitlist=[]; s.customers=[]; return s;} }

  let state = load();
  const subs = [];
  function notify(){ subs.forEach(f=>{ try{f(state);}catch(e){} }); }
  // Root XSS protection: no stored string may carry < or > (they become harmless
  // look-alikes), so nothing user-entered can ever form an HTML tag in any dashboard.
  function deepSan(o){
    if(typeof o==='string') return o.indexOf('<')<0&&o.indexOf('>')<0&&o.indexOf('"')<0?o:o.replace(/</g,'\u2039').replace(/>/g,'\u203A').replace(/"/g,'\u201D');
    if(Array.isArray(o)){ for(let i=0;i<o.length;i++) o[i]=deepSan(o[i]); return o; }
    if(o&&typeof o==='object'){ for(const k in o) o[k]=deepSan(o[k]); return o; }
    return o;
  }
  function save(){ try{ deepSan(state); localStorage.setItem(KEY, JSON.stringify(state)); last=localStorage.getItem(KEY);}catch(e){} notify(); }

  // cross-tab sync: storage event + polling fallback (file:// can be flaky)
  window.addEventListener('storage', e=>{ if(e.key===KEY){ state=load(); notify(); } });
  let last = localStorage.getItem(KEY);
  setInterval(()=>{ const cur=localStorage.getItem(KEY); if(cur!==last){ last=cur; state=load(); notify(); } }, 1000);

  // migration: every driver gets a password + an owner ('ali' fleet or a supplier id)
  (function(){ let ch=false; (state.drivers||[]).forEach(d=>{ if(!d.pass){d.pass='0000';ch=true;} if(!d.owner){d.owner='ali';ch=true;} }); if(ch) save(); })();

  const COUNTRIES = ["Kuwait", "Saudi Arabia", "United Arab Emirates", "Qatar", "Bahrain", "Oman"];

  const TE = {
    esc: x=>String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
    GOV,
    COUNTRIES,
    state: ()=>state,
    on: (f)=>{ subs.push(f); return ()=>{}; },
    save,
    reset: ()=>{ state=clone(SEED); save(); },
    resetEmpty: ()=>{ state={ currency:"KWD", drop:{}, videos:{intro:"",product:""}, products:[], comingSoon:[], suppliers:[],
      delivery:clone(SEED.delivery), gccShipping:clone(SEED.gccShipping), couriers:clone(SEED.couriers), driverFee:1.0,
      drivers:[], orders:[], waitlist:[], customers:[], seq:1001 }; save(); },

    // featured drop = newest product that is LIVE and APPROVED — drafts/pending NEVER show on the store
    product: ()=> state.products.find(p=>p.status==="live" && p.approval!=="pending"),
    productById: (id)=> state.products.find(p=>p.id===id),
    setStockLeft: (n)=>{ const p=TE.product(); if(!p)return; p.left=Math.max(0, Math.min(p.total, n)); save(); },
    addProduct: (p)=>{ state.products.unshift(p); save(); },
    updateProduct: (id,patch)=>{ const p=state.products.find(x=>x.id===id); if(p) Object.assign(p,patch); save(); },

    setVideo: (k,url)=>{ state.videos[k]=url; save(); },

    addComingSoon: (c)=>{ state.comingSoon.push(c); save(); },
    removeComingSoon: (id)=>{ state.comingSoon=state.comingSoon.filter(x=>x.id!==id); save(); },
    updateComingSoon: (id,patch)=>{ const c=state.comingSoon.find(x=>x.id===id); if(c)Object.assign(c,patch); save(); },
    submitTeaser: (supplierId,c)=>{ c.id=c.id||('cs'+Date.now()); c.tag=c.tag||'Coming soon'; c.approval='pending'; c.supplier=supplierId;
      state.comingSoon.push(c); save(); return c; },
    approveTeaser: (id)=>{ const c=state.comingSoon.find(x=>x.id===id); if(c)c.approval='approved'; save(); },
    visibleComingSoon: ()=> state.comingSoon.filter(c=>c.approval!=='pending'),

    // ----- waitlist (notify-me per upcoming drop) -----
    addWaitlist: (dropId, phone)=>{ if(!state.waitlist) state.waitlist=[];
      if(state.waitlist.some(w=>w.dropId===dropId && w.phone===phone)) return false;
      state.waitlist.push({ dropId, phone, date: new Date().toISOString() }); save();
      try{ TE.registerCustomer({phone:phone,source:'waitlist'}); }catch(e){}
      return true; },
    waitlistCount: (dropId)=> (state.waitlist||[]).filter(w=>w.dropId===dropId).length,
    waitlistFor: (dropId)=> (state.waitlist||[]).filter(w=>w.dropId===dropId),

    addSupplier: (s)=>{ state.suppliers.unshift(s); save(); },

    // ----- customer bank (registrations from orders, waitlists, drop alerts) -----
    registerCustomer: (c)=>{ if(!state.customers) state.customers=[];
      const key=(c.phone||'').replace(/\D/g,'')||((c.email||'').toLowerCase());
      if(!key) return null;
      let ex=state.customers.find(x=>((x.phone||'').replace(/\D/g,'')===key)||(key.includes('@')&&(x.email||'').toLowerCase()===key));
      if(ex){ Object.keys(c).forEach(k=>{ if(c[k]&&!ex[k]) ex[k]=c[k]; }); ex.lastSeen=new Date().toISOString(); }
      else { ex=Object.assign({date:new Date().toISOString(),lastSeen:new Date().toISOString()},c); state.customers.unshift(ex); }
      save(); return ex; },
    customers: ()=> state.customers||[],
    customerByEmail: (em)=> (state.customers||[]).find(c=>(c.email||'').toLowerCase()===(em||'').toLowerCase()),
    updateCustomerByEmail: (em,patch)=>{ const c=TE.customerByEmail(em); if(!c)return null;
      Object.assign(c,patch); c.lastSeen=new Date().toISOString();
      if(patch.gov!==undefined && c.addresses && c.addresses.length){
        const d=c.addresses.find(a=>a.def)||c.addresses[0];
        Object.assign(d,{gov:patch.gov,area:patch.area,block:patch.block,street:patch.street,house:patch.house,avenue:patch.avenue});
        if(patch.phone)d.phone=patch.phone;
      }
      save(); return c; },
    ordersForCustomer: (em)=> state.orders.filter(o=>(o.customerEmail||'').toLowerCase()===(em||'').toLowerCase()),
    // ----- multiple saved addresses (default mirrors to legacy fields for checkout/admin) -----
    _mirrorDefault: (c)=>{ const d=(c.addresses||[]).find(a=>a.def); if(d){ c.gov=d.gov;c.area=d.area;c.block=d.block;c.street=d.street;c.house=d.house;c.avenue=d.avenue; if(d.phone)c.phone=d.phone; } },
    addresses: (em)=>{ const c=TE.customerByEmail(em); if(!c)return [];
      if(!c.addresses&&c.gov){ c.addresses=[{label:'Home',def:true,gov:c.gov,area:c.area,block:c.block,street:c.street,house:c.house,avenue:c.avenue,phone:c.phone}]; save(); }
      return c.addresses||[]; },
    addAddress: (em,a)=>{ const c=TE.customerByEmail(em); if(!c)return;
      c.addresses=c.addresses||[]; if(a.def||!c.addresses.length){ c.addresses.forEach(x=>x.def=false); a.def=true; }
      c.addresses.push(a); TE._mirrorDefault(c); save(); },
    updateAddress: (em,i,a)=>{ const c=TE.customerByEmail(em); if(!c||!c.addresses||!c.addresses[i])return;
      const wasDef=c.addresses[i].def; Object.assign(c.addresses[i],a); if(wasDef)c.addresses[i].def=true; TE._mirrorDefault(c); save(); },
    deleteAddress: (em,i)=>{ const c=TE.customerByEmail(em); if(!c||!c.addresses)return;
      const wasDef=c.addresses[i]&&c.addresses[i].def; c.addresses.splice(i,1);
      if(wasDef&&c.addresses.length)c.addresses[0].def=true; TE._mirrorDefault(c); save(); },
    setDefaultAddress: (em,i)=>{ const c=TE.customerByEmail(em); if(!c||!c.addresses)return;
      c.addresses.forEach((x,j)=>x.def=(j===i)); TE._mirrorDefault(c); save(); },

    // ----- password reset (code generated here; EMAIL DELIVERY = real backend at launch) -----
    startReset: (em)=>{ const c=TE.customerByEmail(em); if(!c||!c.pass)return null;
      c.resetCode=(''+Math.floor(100000+Math.random()*900000)); c.resetExp=Date.now()+30*60000; save(); return c.resetCode; },
    finishReset: (em,code,newPass)=>{ const c=TE.customerByEmail(em);
      if(!c||!c.resetCode||c.resetCode!==(''+code).trim())return {ok:false,err:'Wrong or expired code.'};
      if(Date.now()>(c.resetExp||0))return {ok:false,err:'Code expired — request a new one.'};
      if((newPass||'').length<4)return {ok:false,err:'Password needs at least 4 characters.'};
      c.pass=newPass; delete c.resetCode; delete c.resetExp; save(); return {ok:true}; },

    addGiftCard: (em,amount)=>{ const c=TE.customerByEmail(em); if(!c)return null;
      c.giftCards=c.giftCards||[];
      const card={code:'GIFT-'+Math.random().toString(36).slice(2,8).toUpperCase(),amount:+amount||0,date:new Date().toISOString()};
      c.giftCards.push(card); save(); return card; },
    giftBalance: (em)=>{ const c=TE.customerByEmail(em); return (c&&c.giftCards)?c.giftCards.reduce((s,g)=>s+(+g.amount||0),0):0; },
    redeemGift: (em,amount)=>{ const c=TE.customerByEmail(em); if(!c||!c.giftCards||!(amount>0))return 0;
      let left=amount,used=0;
      c.giftCards.forEach(g=>{ if(left<=0)return; const take=Math.min(+g.amount||0,left); g.amount=Math.round(((+g.amount||0)-take)*100)/100; left-=take; used+=take; });
      c.giftCards=c.giftCards.filter(g=>(+g.amount||0)>0);
      save(); return Math.round(used*100)/100; },
    customersToday: ()=>{ const today=new Date().toISOString().slice(0,10);
      return (state.customers||[]).filter(c=>(c.date||'').slice(0,10)===today).length; },

    // ----- supplier product submission & approval (360 loop) -----
    submitProduct: (supplierId,p)=>{ p.id=p.id||('p'+Date.now()); p.status='draft'; p.approval='pending'; p.supplier=supplierId;
      state.products.unshift(p);
      const s=state.suppliers.find(x=>x.id===supplierId); if(s)s.productId=p.id;
      save(); return p; },
    approveProduct: (id)=>{ const p=state.products.find(x=>x.id===id); if(p)p.approval='approved'; save(); },
    // revenue split: my commission vs supplier share, per time range
    revenue: (from)=>{ let rev=0,ali=0;
      (state.orders||[]).forEach(o=>{ if((o.ts||0)<(from||0))return;
        (o.items||[]).forEach(i=>{ const line=i.q*i.p, c=(i.comm!=null?i.comm:20); rev+=line; ali+=line*c/100; }); });
      return { rev:Math.round(rev*100)/100, ali:Math.round(ali*100)/100, sup:Math.round((rev-ali)*100)/100 }; },
    revenueByDay: (days)=>{ const out=[]; const now=new Date(); now.setHours(0,0,0,0);
      for(let d=days-1;d>=0;d--){ const start=now.getTime()-d*864e5, end=start+864e5;
        let rev=0,ali=0;
        (state.orders||[]).forEach(o=>{ if(!o.ts||o.ts<start||o.ts>=end)return;
          (o.items||[]).forEach(i=>{ const line=i.q*i.p,c=(i.comm!=null?i.comm:20); rev+=line; ali+=line*c/100; }); });
        const dt=new Date(start); out.push({label:dt.getDate()+'/'+(dt.getMonth()+1),rev:rev,ali:ali}); }
      return out; },
    salesFor: (productId)=>{ let units=0,rev=0;
      state.orders.forEach(o=>(o.items||[]).forEach(i=>{ if(i.productId===productId){units+=i.q;rev+=i.q*i.p;} }));
      return {units:units,rev:rev}; },
    toggleSupplier: (id)=>{ const s=state.suppliers.find(x=>x.id===id); if(s) s.active=!s.active; save(); },

    setDelivery: (gov,price)=>{ state.delivery[gov]=price; save(); },
    feeFor: (gov)=> state.delivery[gov] != null ? state.delivery[gov] : 0,

    createOrder: (o)=>{
      const id = "AE-" + (state.seq++);
      const order = Object.assign({ id, ts: Date.now(), date:"Just now", country:"Kuwait", ship:"driver", courier:null, tracking:"", payStatus:"new", prepStatus:"new", driverStatus:"unassigned", driverId:null, cashDeclared:false }, o);
      (order.items||[]).forEach(i=>{ if(i.comm==null){ const pp=state.products.find(x=>x.id===i.productId); i.comm=(pp&&pp.commission!=null)?pp.commission:20; } });
      state.orders.unshift(order);
      try{ TE.registerCustomer({name:o.name,phone:o.phone,gov:o.gov,area:o.area,block:o.block,street:o.street,house:o.house,source:'order'}); }catch(e){}
      const p = TE.product();
      const qty = (order.items||[]).reduce((s,i)=>s+(i.q||1),0) || 1;
      p.left = Math.max(0, p.left - qty);
      save();
      return order;
    },
    setPayStatus: (id,st)=>{ const o=state.orders.find(x=>x.id===id); if(o) o.payStatus=st; save(); },
    setPrepStatus: (id,st)=>{ const o=state.orders.find(x=>x.id===id); if(o) o.prepStatus=st; save(); },

    // ----- drivers / delivery -----
    addDriver: (d)=>{ d.id = d.id || ("drv"+Date.now()); d.active = true; if(!d.pass)d.pass='0000'; if(!d.owner)d.owner='ali'; state.drivers.unshift(d); save(); return d; },
    driverLogin: (phone,pass)=> state.drivers.find(x=> x.active && (x.phone||'').replace(/\s/g,'')===String(phone||'').replace(/\s/g,'') && (x.pass||'0000')===String(pass||'')),
    driversFor: (owner)=> state.drivers.filter(d=> (d.owner||'ali')===owner),
    supplierAddDriver: (supplierId, d)=>{ d.owner=supplierId; d.id="drv"+Date.now(); d.active=true; if(!d.pass)d.pass='0000'; state.drivers.unshift(d); save(); return d; },
    setDriverActive: (id,on)=>{ const d=state.drivers.find(x=>x.id===id); if(d){ d.active=!!on; save(); } },
    availableForSupplierDriver: (supplierId)=>{ const s=state.suppliers.find(x=>x.id===supplierId); if(!s||!s.selfDelivery) return [];
      return state.orders.filter(o=> o.prepStatus==="ready" && o.driverStatus==="unassigned" && o.items[0] && o.items[0].productId===s.productId); },
    setDeliveryBy: (orderId, who)=>{ const o=state.orders.find(x=>x.id===orderId); if(!o)return;
      o.deliveryBy = who || null;
      if(who==='supplier'){ o.ship='supplier'; }                       // stays OUT of the ALI pool
      if(who==='ali'){ o.ship='driver'; o.driverId=null; o.driverStatus='unassigned'; } // ALI dashboard handles it
      save(); },
    supplierAssignDriver: (orderId, driverId)=>{ const o=state.orders.find(x=>x.id===orderId); if(!o)return;
      o.ship='supplier'; o.driverId=driverId; o.driverStatus='assigned'; o.payStatus='delivery'; save(); },
    handToAli: (orderId)=>{ const o=state.orders.find(x=>x.id===orderId); if(!o)return;
      o.ship='driver'; o.driverId=null; o.driverStatus='unassigned'; save(); },
    claimSupplierOrder: (orderId, driverId)=>{ const o=state.orders.find(x=>x.id===orderId); if(o && o.driverStatus==="unassigned"){ o.ship='supplier'; o.driverId=driverId; o.driverStatus="assigned"; o.payStatus='delivery'; } save(); },
    driverById: (id)=> state.drivers.find(x=>x.id===id),
    availableForDriver: ()=> state.orders.filter(o=> o.prepStatus==="ready" && o.driverStatus==="unassigned" && (o.ship||"driver")==="driver"),
    driverOrders: (driverId)=> state.orders.filter(o=> o.driverId===driverId),
    assignDriver: (orderId, driverId)=>{ const o=state.orders.find(x=>x.id===orderId); if(!o)return;
      o.driverId=driverId; o.driverStatus='assigned'; save(); },
    supplierStartDelivery: (orderId)=>{ const o=state.orders.find(x=>x.id===orderId); if(!o)return;
      o.ship='supplier'; o.prepStatus='picked'; o.payStatus='delivery'; o.driverStatus='supplier'; save(); },
    supplierDelivered: (orderId)=>{ const o=state.orders.find(x=>x.id===orderId); if(!o)return;
      o.payStatus='delivered'; save(); },
    claimOrder: (orderId, driverId)=>{ const o=state.orders.find(x=>x.id===orderId); if(o && o.driverStatus==="unassigned"){ o.driverId=driverId; o.driverStatus="assigned"; } save(); },
    setDriverStatus: (orderId, st)=>{ const o=state.orders.find(x=>x.id===orderId); if(!o) return;
      o.driverStatus=st;
      if(st==="picked"){ o.prepStatus="picked"; o.payStatus="delivery"; }
      if(st==="delivered"){ o.payStatus="delivered"; }
      save(); },
    cashToDeclare: (driverId)=> state.orders.filter(o=> o.driverId===driverId && o.driverStatus==="delivered" && o.pay==="cod" && !o.cashDeclared),
    declareCash: (driverId)=>{ state.orders.forEach(o=>{ if(o.driverId===driverId && o.driverStatus==="delivered" && o.pay==="cod") o.cashDeclared=true; }); save(); },

    // ----- GCC / international shipping -----
    feeForCountry: (country)=> country==="Kuwait" ? 0 : (state.gccShipping[country] != null ? state.gccShipping[country] : 12),
    setGccShipping: (country,price)=>{ state.gccShipping[country]=price; save(); },
    setTracking: (orderId,courier,tracking)=>{ const o=state.orders.find(x=>x.id===orderId); if(o){ o.courier=courier; o.tracking=tracking; if(tracking) o.payStatus="delivery"; } save(); },
    markShippedDelivered: (orderId)=>{ const o=state.orders.find(x=>x.id===orderId); if(o){ o.payStatus="delivered"; } save(); }
  };

  window.TE = TE;
})();
