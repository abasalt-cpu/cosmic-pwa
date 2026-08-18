function getDailyFal(userId){const seed=`${userId}-${todayStr()}`; return HAFEZ_DATA[simpleHash(seed)%HAFEZ_DATA.length];}
function getGhazalById(id){return HAFEZ_DATA.find(g=>g.id===id)||null;}
function getRandomMunajat(){return MUNAJAT_DATA[Math.floor(Math.random()*MUNAJAT_DATA.length)];}
function shuffleArray(arr){const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;}
function getTodayElham(){
  const key='elham_state'; const stored=JSON.parse(localStorage.getItem(key)||'null'); const today=todayStr();
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
const ZAMANBANDI_SAMPLES=[
  {time:"11:08 صبح", quote:"به خدا اعتماد داشته باش، همه چی به موقعش درست می‌شه."},
  {time:"9:42 شب", quote:"خدا هیچ‌وقت دیر نمی‌کنه، ماییم که صبر نداریم."},
  {time:"4:45 صبح", quote:"اگه نمی‌دونی چطوری باید یه چیزی رو پشت سر بذاری، خدا می‌دونه؛ بهش اعتماد کن."},
];
const ZAMANBANDI_LINK="https://taaghche.com/book/232958/به-زمان-بندی-خدا-اعتماد-کن";
function getSampleZamanbandi(){return ZAMANBANDI_SAMPLES[Math.floor(Math.random()*ZAMANBANDI_SAMPLES.length)];}
