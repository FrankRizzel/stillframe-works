const menu=document.querySelector('.menu');
const nav=document.querySelector('#nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));document.querySelector('#year').textContent=new Date().getFullYear();document.querySelector('#contactForm').addEventListener('submit',e=>{e.preventDefault();
const data=new FormData(e.currentTarget);
const subject=encodeURIComponent('Free discovery call request: '+data.get('name'));
const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\nWhat I have:\n${data.get('details')}\n\nI confirm I own or am authorized to manage these items.`);window.location.href=`mailto:hello@stillframe.works?subject=${subject}&body=${body}`});

const archiveCard=document.querySelector('#archiveGame');
const archiveQuiz=document.querySelector('#archiveQuiz');
const quizContent=archiveQuiz?.querySelector('.quiz-content');
const quizCount=archiveQuiz?.querySelector('.quiz-count');
const quizProgress=archiveQuiz?.querySelector('.quiz-progress i');
const backButton=archiveQuiz?.querySelector('.quiz-back');
const nextButton=archiveQuiz?.querySelector('.quiz-next');
let quizIndex=0;
const archiveAnswers={};
const archiveQuestions=[
  {key:'materials',title:'What would you like to preserve?',help:'Choose everything that applies.',multi:true,options:['Photos or slides','VHS, camcorder tapes or DVDs','Vinyl records','Audio cassette tapes','Phones or tablets','Computers','Hard drives, USB drives or memory cards','Documents','Other']},
  {key:'devices',title:'About how many digital devices or drives?',help:'A rough count is perfect.',options:['None','1 to 10 items','11 to 30 items','31 to 75 items','More than 75']},
  {key:'media',title:'How much physical media do you have?',help:'Think tapes, discs, records, printed photos and slides.',options:['None','1 to 10 items','11 to 30 items','31 to 75 items','More than 75']},
  {key:'goal',title:'What result would help most?',help:'We can refine the plan together later.',options:['One organized backup','Transfer everything to digital','Organize and create a backup','I’m not sure yet']},
  {key:'delivery',title:'How would you like the finished archive?',help:'We will confirm capacity before purchasing any storage.',options:['USB flash drive','Portable USB hard drive','Use storage I already own','Recommend the best option']},
  {key:'contact',title:'Where should we send your quote?',help:'We’ll review your answers and reply personally.',contact:true}
];
function openArchiveQuiz(){archiveCard?.classList.add('is-playing');archiveQuiz?.setAttribute('aria-hidden','false');archiveQuiz.querySelector('.quiz-actions').style.display='flex';quizIndex=0;renderArchiveQuestion();setTimeout(()=>archiveQuiz?.querySelector('button,input')?.focus(),80)}
function closeArchiveQuiz(){archiveCard?.classList.remove('is-playing');archiveQuiz?.setAttribute('aria-hidden','true')}
function selectedValues(){return [...quizContent.querySelectorAll('.quiz-option.selected')].map(el=>el.dataset.value)}
function renderArchiveQuestion(){
  const q=archiveQuestions[quizIndex];quizCount.textContent=`${quizIndex+1} / ${archiveQuestions.length}`;quizProgress.style.width=`${((quizIndex+1)/archiveQuestions.length)*100}%`;backButton.disabled=quizIndex===0;nextButton.textContent=quizIndex===archiveQuestions.length-1?'Build my estimate':'Continue';
  if(q.contact){quizContent.innerHTML=`<h2>${q.title}</h2><p>${q.help}</p><div class="quiz-fields"><label>Name<input id="quoteName" autocomplete="name" value="${archiveAnswers.name||''}" required></label><label>Email<input id="quoteEmail" type="email" autocomplete="email" value="${archiveAnswers.email||''}" required></label></div><p class="quiz-consent">By requesting a quote, you agree that Stillframe Works may contact you about this project. No files are uploaded.</p><p class="quiz-error" hidden>Please enter your name and a valid email.</p>`;return}
  const chosen=Array.isArray(archiveAnswers[q.key])?archiveAnswers[q.key]:[archiveAnswers[q.key]];quizContent.innerHTML=`<h2>${q.title}</h2><p>${q.help}</p><div class="quiz-options">${q.options.map(option=>`<button type="button" class="quiz-option ${chosen.includes(option)?'selected':''}" data-value="${option}" aria-pressed="${chosen.includes(option)}">${option}</button>`).join('')}</div>${q.key==='materials'?`<label class="quiz-other" ${chosen.includes('Other')?'':'hidden'}>What else do you have?<input id="materialsOther" value="${archiveAnswers.materialsOther||''}" placeholder="For example: reel-to-reel tape"></label><p class="quiz-error quiz-other-error" hidden>Please describe the other item.</p>`:''}`;
  const syncOther=()=>{const field=quizContent.querySelector('.quiz-other');if(field)field.hidden=!selectedValues().includes('Other')};
  quizContent.querySelectorAll('.quiz-option').forEach(option=>option.addEventListener('click',()=>{if(!q.multi)quizContent.querySelectorAll('.quiz-option').forEach(item=>{item.classList.remove('selected');item.setAttribute('aria-pressed','false')});option.classList.toggle('selected');option.setAttribute('aria-pressed',String(option.classList.contains('selected')));syncOther()}));
}
function showArchiveResult(){quizCount.textContent='READY';quizProgress.style.width='100%';archiveQuiz.querySelector('.quiz-actions').style.display='none';const recommendation=archiveAnswers.delivery==='USB flash drive'?'USB flash drive':'portable USB hard drive';quizContent.innerHTML=`<div class="quiz-result"><div class="quiz-result-copy"><span class="result-label">YOUR PROJECT SNAPSHOT</span><h2>Your memories are ready for a clear home.</h2><p>Based on your answers, we’ll review the collection and confirm whether a ${recommendation} or another storage option makes the most sense.</p><button type="button" id="sendArchiveLead">Send my quote request</button><p class="quiz-consent">Your email app will open with your project summary ready to send.</p></div></div>`;quizContent.querySelector('#sendArchiveLead').addEventListener('click',sendArchiveLead)}
function sendArchiveLead(){const other=archiveAnswers.materialsOther?` (${archiveAnswers.materialsOther})`:'';const lines=[`Name: ${archiveAnswers.name}`,`Email: ${archiveAnswers.email}`,'',`Materials: ${archiveAnswers.materials.join(', ')}${other}`,`Digital devices/drives: ${archiveAnswers.devices}`,`Physical media: ${archiveAnswers.media}`,`Primary goal: ${archiveAnswers.goal}`,`Preferred delivery: ${archiveAnswers.delivery}`,'','Lead source: Website archive estimator'];window.location.href=`mailto:hello@stillframe.works?subject=${encodeURIComponent('New archive estimate request: '+archiveAnswers.name)}&body=${encodeURIComponent(lines.join('\n'))}`}
document.querySelector('#startArchiveGame')?.addEventListener('click',openArchiveQuiz);
archiveCard?.querySelector('.archive-visual')?.addEventListener('click',openArchiveQuiz);
archiveCard?.querySelector('.archive-visual')?.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openArchiveQuiz()}});
archiveQuiz?.querySelector('.quiz-close')?.addEventListener('click',closeArchiveQuiz);
backButton?.addEventListener('click',()=>{if(quizIndex>0){quizIndex--;renderArchiveQuestion()}});
nextButton?.addEventListener('click',()=>{const q=archiveQuestions[quizIndex];if(q.contact){const name=quizContent.querySelector('#quoteName').value.trim();const email=quizContent.querySelector('#quoteEmail').value.trim();if(!name||!/^\S+@\S+\.\S+$/.test(email)){quizContent.querySelector('.quiz-error').hidden=false;return}archiveAnswers.name=name;archiveAnswers.email=email;showArchiveResult();return}const values=selectedValues();if(!values.length)return;if(q.key==='materials'){if(values.includes('Other')){const other=quizContent.querySelector('#materialsOther').value.trim();if(!other){quizContent.querySelector('.quiz-other-error').hidden=false;return}archiveAnswers.materialsOther=other}else delete archiveAnswers.materialsOther}archiveAnswers[q.key]=q.multi?values:values[0];quizIndex++;renderArchiveQuestion()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&archiveCard?.classList.contains('is-playing'))closeArchiveQuiz()});
