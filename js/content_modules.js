function getDailyFal(userId){const seed=`${userId}-${todayStr()}`; return HAFEZ_DATA[simpleHash(seed)%HAFEZ_DATA.length];}
function getGhazalById(id){return HAFEZ_DATA.find(g=>String(g.id)===String(id))||null;}
function getRandomMunajat(){return MUNAJAT_DATA[Math.floor(Math.random()*MUNAJAT_DATA.length)];}
function shuffleArray(arr){const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;}
function getTodayElham(){
  const key='elham_state'; const stored=safeParse(key,null); const today=todayStr();
  let order,position;
  if(!stored){order=shuffleArray(ELHAM_DATA.map((_,i)=>i)); position=0; localStorage.setItem(key,JSON.stringify({order,position,lastDate:today}));}
  else if(stored.lastDate===today){order=stored.order; position=stored.position;}
  else{
    order=stored.order; position=stored.position+1;
    if(position>=order.length){
      const lastIdx=order[order.length-1];
      order=shuffleArray(ELHAM_DATA.map((_,i)=>i));
      if(order[0]===lastIdx&&order.length>1){[order[0],order[1]]=[order[1],order[0]];}
      position=0;
    }
    localStorage.setItem(key,JSON.stringify({order,position,lastDate:today}));
  }
  return ELHAM_DATA[order[position]];
}
// لینک کتاب با نویسه‌های فارسی به‌صورت percent-encoded (استاندارد URL) — سازگار با همه مرورگرها و ابزارهای اشتراک‌گذاری
const ZAMANBANDI_LINK="https://taaghche.com/book/232958/%D8%A8%D9%87-%D8%B2%D9%85%D8%A7%D9%86-%D8%A8%D9%86%D8%AF%DB%8C-%D8%AE%D8%AF%D8%A7-%D8%A7%D8%B9%D8%AA%D9%85%D8%A7%D8%AF-%DA%A9%D9%86";
function getDailyZamanbandi(userId){const seed=`${userId}-zamanbandi-${todayStr()}`; return ZAMANBANDI_DATA[simpleHash(seed)%ZAMANBANDI_DATA.length];}
function getZamanbandiById(id){return ZAMANBANDI_DATA.find(z=>z.id===id)||null;}
function getRandomZamanbandi(){return ZAMANBANDI_DATA[Math.floor(Math.random()*ZAMANBANDI_DATA.length)];}
function getDailySlogan(userId){const seed=`${userId}-slogan-${todayStr()}`; return SLOGANS_DATA[simpleHash(seed)%SLOGANS_DATA.length];}
function getRandomSlogan(){return SLOGANS_DATA[Math.floor(Math.random()*SLOGANS_DATA.length)];}
