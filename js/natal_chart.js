// ===== natal_chart.js =====
const IRAN_UTC_OFFSET = 3.5;
const SIGN_NAMES = ["حمل","ثور","جوزا","سرطان","اسد","سنبله","میزان","عقرب","قوس","جدی","دلو","حوت"];
function signFromLongitude(lon){lon=((lon%360)+360)%360; return SIGN_NAMES[Math.floor(lon/30)];}
function julianDay(gy,gm,gd,hour){
  if(gm<=2){gy-=1;gm+=12;}
  const a=Math.floor(gy/100), b=2-a+Math.floor(a/4);
  return Math.floor(365.25*(gy+4716))+Math.floor(30.6001*(gm+1))+gd+hour/24.0+b-1524.5;
}
function norm360(x){x=x%360; return x<0?x+360:x;}
const rad=(d)=>d*Math.PI/180, deg=(r)=>r*180/Math.PI;
function solarLongitude(jd){
  const t=(jd-2451545.0)/36525.0;
  const l0=norm360(280.46646+36000.76983*t+0.0003032*t*t);
  const m=norm360(357.52911+35999.05029*t-0.0001537*t*t);
  const mRad=rad(m);
  const c=(1.914602-0.004817*t-0.000014*t*t)*Math.sin(mRad)+(0.019993-0.000101*t)*Math.sin(2*mRad)+0.000289*Math.sin(3*mRad);
  return norm360(l0+c);
}
function lunarLongitude(jd){
  const t=(jd-2451545.0)/36525.0;
  const lp=norm360(218.3164477+481267.88123421*t);
  let d=norm360(297.8501921+445267.1114034*t);
  let m=norm360(357.5291092+35999.0502909*t);
  let mp=norm360(134.9633964+477198.8675055*t);
  let f=norm360(93.2720950+483202.0175233*t);
  d=rad(d);m=rad(m);mp=rad(mp);f=rad(f);
  let dl=0;
  dl+=6.288774*Math.sin(mp); dl+=1.274027*Math.sin(2*d-mp); dl+=0.658314*Math.sin(2*d);
  dl+=0.213618*Math.sin(2*mp); dl-=0.185116*Math.sin(m); dl-=0.114332*Math.sin(2*f);
  dl+=0.058793*Math.sin(2*d-2*mp); dl+=0.057066*Math.sin(2*d-m-mp); dl+=0.053322*Math.sin(2*d+mp);
  dl+=0.045758*Math.sin(2*d-m); dl-=0.040923*Math.sin(m-mp); dl-=0.034720*Math.sin(d); dl-=0.030383*Math.sin(m+mp);
  return norm360(lp+dl);
}
function obliquityOfEcliptic(jd){const t=(jd-2451545.0)/36525.0; return 23.439291-0.0130042*t;}
function gmstDegrees(jd){
  const t=(jd-2451545.0)/36525.0;
  const gmst=280.46061837+360.98564736629*(jd-2451545.0)+0.000387933*t*t-(t**3)/38710000.0;
  return norm360(gmst);
}
function ascendant(jdUt,latitude,longitudeEast){
  const gmst=gmstDegrees(jdUt), lst=norm360(gmst+longitudeEast);
  const eps=rad(obliquityOfEcliptic(jdUt)), lat=rad(latitude), lstRad=rad(lst);
  const y=-Math.cos(lstRad);
  const x=Math.sin(eps)*Math.tan(lat)+Math.cos(eps)*Math.sin(lstRad);
  return norm360(deg(Math.atan2(y,x)));
}
function calculateNatal(gy,gm,gd,hour,minute,cityKey){
  const city=IRAN_CITIES[cityKey];
  const localHour=hour+minute/60.0, utcHour=localHour-IRAN_UTC_OFFSET;
  const jd=julianDay(gy,gm,gd,utcHour);
  const sunLon=solarLongitude(jd), moonLon=lunarLongitude(jd), ascLon=ascendant(jd,city.lat,city.lon);
  return {sunSign:signFromLongitude(sunLon), moonSign:signFromLongitude(moonLon), ascSign:signFromLongitude(ascLon), city:city.display_name};
}
function formatNatal(result){
  const sunText=NATAL_INTERP.sun[result.sunSign], moonText=NATAL_INTERP.moon[result.moonSign], ascText=NATAL_INTERP.asc[result.ascSign];
  return `🌌 زایچه‌ی تقریبی شما\n\n☀️ برج خورشید (آفتاب): ${result.sunSign}\n${sunText}\n\n🌙 برج ماه: ${result.moonSign}\n${moonText}\n\n⬆️ طالع (صعودی): ${result.ascSign}\n${ascText}\n\n📍 محل تولد: ${result.city}`;
}
