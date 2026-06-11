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
  function load(){ try{ const r=localStorage.getItem(KEY); const s=r?JSON.parse(r):clone(SEED); if(!s.waitlist) s.waitlist=[]; return s;}catch(e){ const s=clone(SEED); s.waitlist=[]; return s;} }

  let state = load();
  const subs = [];
  function notify(){ subs.forEach(f=>{ try{f(state);}catch(e){} }); }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); last=localStorage.getItem(KEY);}catch(e){} notify(); }

  // cross-tab sync: storage event + polling fallback (file:// can be flaky)
  window.addEventListener('storage', e=>{ if(e.key===KEY){ state=load(); notify(); } });
  let last = localStorage.getItem(KEY);
  setInterval(()=>{ const cur=localStorage.getItem(KEY); if(cur!==last){ last=cur; state=load(); notify(); } }, 1000);

  const COUNTRIES = ["Kuwait", "Saudi Arabia", "United Arab Emirates", "Qatar", "Bahrain", "Oman"];

  const TE = {
    GOV,
    COUNTRIES,
    state: ()=>state,
    on: (f)=>{ subs.push(f); return ()=>{}; },
    save,
    reset: ()=>{ state=clone(SEED); save(); },

    // featured drop = newest product marked Live (admin controls the store via the Status field)
    product: ()=> state.products.find(p=>p.status==="live") || state.products[0],
    productById: (id)=> state.products.find(p=>p.id===id),
    setStockLeft: (n)=>{ const p=TE.product(); p.left=Math.max(0, Math.min(p.total, n)); save(); },
    addProduct: (p)=>{ state.products.unshift(p); save(); },
    updateProduct: (id,patch)=>{ const p=state.products.find(x=>x.id===id); if(p) Object.assign(p,patch); save(); },

    setVideo: (k,url)=>{ state.videos[k]=url; save(); },

    addComingSoon: (c)=>{ state.comingSoon.push(c); save(); },
    removeComingSoon: (id)=>{ state.comingSoon=state.comingSoon.filter(x=>x.id!==id); save(); },

    // ----- waitlist (notify-me per upcoming drop) -----
    addWaitlist: (dropId, phone)=>{ if(!state.waitlist) state.waitlist=[];
      if(state.waitlist.some(w=>w.dropId===dropId && w.phone===phone)) return false;
      state.waitlist.push({ dropId, phone, date: new Date().toISOString() }); save(); return true; },
    waitlistCount: (dropId)=> (state.waitlist||[]).filter(w=>w.dropId===dropId).length,
    waitlistFor: (dropId)=> (state.waitlist||[]).filter(w=>w.dropId===dropId),

    addSupplier: (s)=>{ state.suppliers.unshift(s); save(); },

    // ----- supplier product submission & approval (360 loop) -----
    submitProduct: (supplierId,p)=>{ p.id=p.id||('p'+Date.now()); p.status='draft'; p.approval='pending'; p.supplier=supplierId;
      state.products.unshift(p);
      const s=state.suppliers.find(x=>x.id===supplierId); if(s)s.productId=p.id;
      save(); return p; },
    approveProduct: (id)=>{ const p=state.products.find(x=>x.id===id); if(p)p.approval='approved'; save(); },
    salesFor: (productId)=>{ let units=0,rev=0;
      state.orders.forEach(o=>(o.items||[]).forEach(i=>{ if(i.productId===productId){units+=i.q;rev+=i.q*i.p;} }));
      return {units:units,rev:rev}; },
    toggleSupplier: (id)=>{ const s=state.suppliers.find(x=>x.id===id); if(s) s.active=!s.active; save(); },

    setDelivery: (gov,price)=>{ state.delivery[gov]=price; save(); },
    feeFor: (gov)=> state.delivery[gov] != null ? state.delivery[gov] : 0,

    createOrder: (o)=>{
      const id = "AE-" + (state.seq++);
      const order = Object.assign({ id, date:"Just now", country:"Kuwait", ship:"driver", courier:null, tracking:"", payStatus:"new", prepStatus:"new", driverStatus:"unassigned", driverId:null, cashDeclared:false }, o);
      state.orders.unshift(order);
      const p = TE.product();
      const qty = (order.items||[]).reduce((s,i)=>s+(i.q||1),0) || 1;
      p.left = Math.max(0, p.left - qty);
      save();
      return order;
    },
    setPayStatus: (id,st)=>{ const o=state.orders.find(x=>x.id===id); if(o) o.payStatus=st; save(); },
    setPrepStatus: (id,st)=>{ const o=state.orders.find(x=>x.id===id); if(o) o.prepStatus=st; save(); },

    // ----- drivers / delivery -----
    addDriver: (d)=>{ d.id = d.id || ("drv"+Date.now()); d.active = true; state.drivers.unshift(d); save(); return d; },
    driverById: (id)=> state.drivers.find(x=>x.id===id),
    availableForDriver: ()=> state.orders.filter(o=> o.prepStatus==="ready" && o.driverStatus==="unassigned" && (o.ship||"driver")==="driver"),
    driverOrders: (driverId)=> state.orders.filter(o=> o.driverId===driverId),
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
