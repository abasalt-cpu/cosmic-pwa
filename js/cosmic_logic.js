// ===== cosmic_logic.js =====
const ABJAD = {"ا":1,"آ":1,"ب":2,"پ":4000,"ج":3,"چ":3000,"د":4,"ه":5,"ة":5,"و":6,"ز":7,"ژ":5000,"ح":8,"ط":9,"ی":10,"ي":10,"ک":20,"گ":2000,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,"ق":100,"ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000};
const INCOME_TEXT = {"1":"معیشت پرنوسان، نیاز به مدیریت دقیق هزینه‌ها.","2":"معیشت متوسط رو به بالا، با تلاش قابل بهبود است.","0":"معیشت نسبتاً پایدار و بخت باز شدن درهای مالی را دارد."};
const STATUS_TEXT = {"1":"نزولی","2":"صعودی","3":"راکد","0":"راکد"};
function digitSum(n){return String(Math.abs(Math.trunc(n))).split('').reduce((a,d)=>a+parseInt(d,10),0);}
function reduceFull(n){n=Math.abs(Math.trunc(n));while(n>9)n=digitSum(n);return n===0?9:n;}
function reduceV10(n){const ds=digitSum(n);if(ds===10)return 1;if(n===11||n===22)return n;return ds;}
function reduceMasterOnly(n){if(n===11||n===22)return n;return digitSum(n);}
function firstDigit(n){return String(Math.abs(Math.trunc(n)))[0];}
function jalaliToGregorian(jy,jm,jd){
  jy+=1595;
  let days=-355668+365*jy+Math.floor(jy/33)*8+Math.floor(((jy%33)+3)/4)+jd+(jm<7?(jm-1)*31:((jm-7)*30+186));
  let gy=400*Math.floor(days/146097); days%=146097;
  if(days>36524){days-=1;gy+=100*Math.floor(days/36524);days%=36524;if(days>=365)days+=1;}
  gy+=4*Math.floor(days/1461); days%=1461;
  if(days>365){gy+=Math.floor((days-1)/365); days=(days-1)%365;}
  let gd=days+1;
  const leap=(gy%4===0&&(gy%100!==0||gy%400===0));
  const gDaysInMonth=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
  let gm=0;
  for(let i=0;i<12;i++){if(gd<=gDaysInMonth[i]){gm=i+1;break;} gd-=gDaysInMonth[i];}
  return [gy,gm,gd];
}
function gregorianToJalali(gy,gm,gd){
  const gDaysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];
  if((gy%4===0&&gy%100!==0)||gy%400===0)gDaysInMonth[1]=29;
  const gy2=gy-1600,gm2=gm-1,gd2=gd-1;
  let gDayNo=365*gy2+Math.floor((gy2+3)/4)-Math.floor((gy2+99)/100)+Math.floor((gy2+399)/400);
  for(let i=0;i<gm2;i++)gDayNo+=gDaysInMonth[i];
  gDayNo+=gd2;
  let jDayNo=gDayNo-79;
  const jNp=Math.floor(jDayNo/12053); jDayNo%=12053;
  let jy=979+33*jNp+4*Math.floor(jDayNo/1461); jDayNo%=1461;
  if(jDayNo>=366){jy+=Math.floor((jDayNo-1)/365); jDayNo=(jDayNo-1)%365;}
  const jDaysInMonth=[31,31,31,31,31,31,30,30,30,30,30,29];
  let i=0; while(i<11&&jDayNo>=jDaysInMonth[i]){jDayNo-=jDaysInMonth[i];i++;}
  return [jy,i+1,jDayNo+1];
}
function abjadKabir(text){
  text=(text||'').replace(/[\u200c\s]+/g,'');
  let sum=0; for(const ch of text) sum+=(ABJAD[ch]||0);
  return sum;
}
function calculateTaghdir(jm){return reduceV10(0+jm);}
function calculateSarnevesht(gy,gm,gd){
  const ad18=reduceMasterOnly(gd), ad16=digitSum(gm), ad14=reduceV10(digitSum(gy));
  const bs33=ad18+ad16+ad14, br33=reduceMasterOnly(bs33);
  return reduceV10(br33);
}
function calculateErteash(jd,jm){
  const bs18=jd*jm, br18=365-bs18, bn18=digitSum(br18), bm18=digitSum(bn18);
  return bm18<9?(9-bm18):bm18;
}
function calculateCosmicCode(firstName,familyName,jm,gy,gm,gd){
  const dsGy=digitSum(gy),dsGm=digitSum(gm),dsGd=digitSum(gd);
  const stage1=dsGy+dsGm+dsGd, stage2=digitSum(stage1);
  const stage3=stage1-(parseInt(firstDigit(gd),10)*2);
  const stage4=digitSum(Math.abs(stage3));
  const poolNumbers=[stage1,stage2,stage3,stage4,gy,gm,gd];
  const digitsPool=[];
  for(const num of poolNumbers){for(const ch of String(Math.abs(num))){if(ch!=='0')digitsPool.push(parseInt(ch,10));}}
  const groups=[];
  for(let d=1;d<=9;d++){const c=digitsPool.filter(x=>x===d).length; if(c>0)groups.push(String(d).repeat(c));}
  const segment1=groups.length?(groups.join('-')+'-'):'';
  const kabirFamily=abjadKabir(familyName), kabirFirst=abjadKabir(firstName);
  const bn39=kabirFamily+kabirFirst;
  const partA=reduceV10(digitSum(bn39));
  const partB=parseInt(firstDigit(jm),10);
  const dsGm2=digitSum(gm);
  const partC=parseInt(firstDigit(dsGm2),10);
  const bo42=jm+dsGm2;
  const partD=parseInt(firstDigit(reduceV10(bo42)),10);
  return segment1 + `${partA}-${partB}-${partC}-${partD}`;
}
function calculateCosmicReport(firstName,familyName,motherName,jy,jm,jd){
  const [gy,gm,gd]=jalaliToGregorian(jy,jm,jd);
  const destinyNum=calculateSarnevesht(gy,gm,gd);
  const fateNum=calculateTaghdir(jm);
  const vibrationNum=calculateErteash(jd,jm);
  const solarNum=jm;
  const cosmicCode=calculateCosmicCode(firstName,familyName,jm,gy,gm,gd);
  const batenNum=reduceFull(abjadKabir(firstName));
  let statusText=null;
  if(motherName){const aVal=abjadKabir(firstName)+abjadKabir(motherName); statusText=STATUS_TEXT[String(aVal%4)]||"راکد";}
  const bVal=abjadKabir(familyName)+abjadKabir(firstName);
  const incomeText=INCOME_TEXT[String(bVal%3)]||INCOME_TEXT["0"];
  return {cosmicCode, gregorianDate:`${gy}-${String(gm).padStart(2,'0')}-${String(gd).padStart(2,'0')}`,
    solarNum, vibrationNum, fateNum, destinyNum,
    vibrationText:(ERTEASH_TABLE[String(vibrationNum)]||''),
    fateText:(TAGHDIR_TABLE[String(fateNum)]||''),
    destinyText:(SARNEVESHT_TABLE[String(destinyNum)]||''),
    incomeText, statusText, batenNum, jy,jm,jd,gy,gm,gd};
}
