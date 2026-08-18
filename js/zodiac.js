function simpleHash(str){let hash=0; for(let i=0;i<str.length;i++){hash=(Math.imul(31,hash)+str.charCodeAt(i))|0;} return Math.abs(hash);}
function todayStr(){const d=new Date(); return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;}
function getZodiacSign(jalaliMonth){return ZODIAC_DATA[String(jalaliMonth)];}
function getDailyForecast(jalaliMonth){const seed=`${jalaliMonth}-${todayStr()}`; return ZODIAC_FORECASTS[simpleHash(seed)%ZODIAC_FORECASTS.length];}
function getDailyLuckyColor(jalaliMonth){const sign=getZodiacSign(jalaliMonth); const seed=`color-${jalaliMonth}-${todayStr()}`; return sign.colors[simpleHash(seed)%sign.colors.length];}
const ELEMENT_COMPAT={
"آتش,آتش":[9,"دو نفر پرانرژی که هم‌دیگه رو کاملاً درک می‌کنن، ولی ممکنه رقابت هم پیش بیاد."],
"آتش,هوا":[9,"ترکیب کلاسیک و بسیار سازگار — هوا آتش رو شعله‌ورتر می‌کنه."],
"هوا,آتش":[9,"ترکیب کلاسیک و بسیار سازگار — هوا آتش رو شعله‌ورتر می‌کنه."],
"خاک,آب":[9,"ترکیب کلاسیک و بسیار سازگار — آب به خاک حاصلخیزی می‌ده."],
"آب,خاک":[9,"ترکیب کلاسیک و بسیار سازگار — آب به خاک حاصلخیزی می‌ده."],
"خاک,خاک":[8,"دو نفر عملگرا و باثبات، رابطه‌ای مطمئن ولی نیازمند کمی هیجان بیشتر."],
"آب,آب":[8,"همخونی احساسی عمیق، ولی مراقب غرق‌شدن در حساسیت‌های مشترک باشید."],
"هوا,هوا":[7,"ارتباط ذهنی عالی و گفت‌وگوهای جذاب، ولی نیاز به پایه‌ی عملی‌تر داره."],
"آتش,خاک":[5,"یکی سریع و پرشور، اون‌یکی آروم و محتاط — با صبر می‌تونه جواب بده."],
"خاک,آتش":[5,"یکی سریع و پرشور، اون‌یکی آروم و محتاط — با صبر می‌تونه جواب بده."],
"آتش,آب":[5,"احساسات آب می‌تونه شعله‌ی آتش رو خاموش یا کنترل کنه — نیاز به درک متقابل."],
"آب,آتش":[5,"احساسات آب می‌تونه شعله‌ی آتش رو خاموش یا کنترل کنه — نیاز به درک متقابل."],
"هوا,خاک":[5,"هوا دنبال تغییره، خاک دنبال ثبات — تفاوت دیدگاه نیاز به تفاهم داره."],
"خاک,هوا":[5,"هوا دنبال تغییره، خاک دنبال ثبات — تفاوت دیدگاه نیاز به تفاهم داره."],
"هوا,آب":[6,"هوا منطقی‌ست و آب احساسی — می‌تونن مکمل خوبی برای هم باشن اگه بفهمن زبان هم رو."],
"آب,هوا":[6,"هوا منطقی‌ست و آب احساسی — می‌تونن مکمل خوبی برای هم باشن اگه بفهمن زبان هم رو."]};
function formatHoroscope(jalaliMonth){
  const sign=getZodiacSign(jalaliMonth), forecast=getDailyForecast(jalaliMonth), color=getDailyLuckyColor(jalaliMonth);
  let extra="";
  if(sign.strengths){extra=`\n💪 نقاط قوت: ${sign.strengths}\n⚠️ نقاط ضعف: ${sign.weaknesses}\n✅ عامل مثبت: ${sign.positive_factor}\n❌ عامل منفی: ${sign.negative_factor}\n🔑 کلید شادی: ${sign.happiness_key}\n🌱 درس معنوی: ${sign.spiritual_lesson}\n`;}
  return `${sign.emoji} طالع‌بینی امروز — برج ${sign.name}\n\n${sign.trait}\n\n🔥 عنصر: ${sign.element} — 🪐 سیاره‌ی حاکم: ${sign.ruling_planet}\n💎 سنگ برج: ${sign.stone} — 🎨 رنگ خوش‌یمن امروز: ${color}\n${extra}\n💞 عشق و رابطه: ${forecast.love}\n\n💼 کار و تلاش: ${forecast.work}\n\n🌿 سلامتی: ${forecast.health}\n\n✨ نکته‌ی امروز: ${forecast.tip}`;
}
function zodiacCompatibility(month1,month2){
  const s1=getZodiacSign(month1), s2=getZodiacSign(month2);
  const [score,desc]=ELEMENT_COMPAT[`${s1.element},${s2.element}`]||[6,"ترکیبی متعادل با فراز و نشیب‌های معمول."];
  return `💫 هم‌خونی ${s1.emoji} ${s1.name} و ${s2.emoji} ${s2.name}\n\nعنصر ${s1.name}: ${s1.element} | عنصر ${s2.name}: ${s2.element}\n\nامتیاز هم‌خونی: ${score}/۱۰\n\n${desc}`;
}
