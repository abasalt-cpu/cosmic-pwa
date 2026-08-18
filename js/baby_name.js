function harmonyScore(name,familyName){
  let score=0;
  if(name[0]===familyName[0])score-=2.0;
  if(name[name.length-1]===familyName[0])score-=1.5;
  const lengthDiff=Math.abs(name.length-familyName.length);
  score+=Math.max(0.0,2.0-lengthDiff*0.4);
  if(name.length<=2)score-=1.0;
  return score;
}
function namePool(gender){return gender==='boy'?NAMES_BOY:NAMES_GIRL;}
function evaluateName(nameEntry,familyName,motherName){
  const name=nameEntry.name, kabirName=abjadKabir(name);
  const aVal=kabirName+abjadKabir(motherName), bVal=abjadKabir(familyName)+kabirName;
  const statusKey=String(aVal%4), incomeKey=String(bVal%3), baten=reduceFull(kabirName);
  return {name, meaning:nameEntry.meaning||'', statusKey, statusText:STATUS_TEXT[statusKey], incomeKey, incomeText:INCOME_TEXT[incomeKey], baten};
}
function getAllMatches(gender,familyName,motherName,desiredStatus,desiredIncome){
  const matches=[];
  for(const nameEntry of namePool(gender)){
    const info=evaluateName(nameEntry,familyName,motherName);
    const statusOk=(desiredStatus===null)||(info.statusKey===desiredStatus);
    const incomeOk=(desiredIncome===null)||(info.incomeKey===desiredIncome);
    if(statusOk&&incomeOk){info.harmony=harmonyScore(info.name,familyName); matches.push(info);}
  }
  if(matches.length===0)return {top3:[],rest:[],total:0};
  const ranked=matches.sort((a,b)=>b.harmony-a.harmony);
  return {top3:ranked.slice(0,3), rest:ranked.slice(3), total:ranked.length};
}
function formatBabyNamePage(gender,result,page,pageSize){
  pageSize=pageSize||10;
  const genderLabel=gender==='boy'?'پسر':'دختر';
  if(result.total===0)return {text:"❌ با این ترکیب دقیق، اسمی توی فهرست فعلی پیدا نشد.\nیکی از فیلترها رو «فرقی نداره» بذار تا گزینه‌های بیشتری ببینی.", hasMore:false};
  const rest=result.rest, start=page*pageSize, end=start+pageSize, chunk=rest.slice(start,end), hasMore=end<rest.length;
  const lines=[];
  if(page===0){
    lines.push(`👶 پیشنهاد اسم ${genderLabel} (از ${result.total} گزینه‌ی مطابق)\n`);
    lines.push('✨ سه گزینه‌ی برتر (هم‌آواترین با فامیلی):');
    for(const r of result.top3)lines.push(`• ${r.name} — ${r.meaning}`);
    if(chunk.length)lines.push('\n📋 گزینه‌های بیشتر:');
  } else { lines.push(`📋 ادامه‌ی گزینه‌ها (صفحه ${page+1}):`); }
  for(const r of chunk)lines.push(`• ${r.name} — ${r.meaning}`);
  return {text:lines.join('\n'), hasMore};
}
