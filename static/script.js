document.addEventListener("DOMContentLoaded", () => {

let step = 0
let typing = false

const scenes = [

`Some stories don't start loudly.<br><br>They start quietly.`,

`Two people.<br>Some distance.<br>A strange moment in time.`,

`I didn't expect to meet someone like you.<br><br>
A tattoo artist.<br>
A guitarist.<br>
Someone who listens to Radiohead.`,

`You once said you like stories<br>
where something honest begins.`,

`No pretending.<br>No games.<br>Just something real.`,

`So I want to ask you something.`,

`Would you start this story with me?`

]

const text = document.getElementById("text")
const next = document.getElementById("next")
const music = document.getElementById("music")

function showScene(){

  text.classList.remove("show")
  text.innerHTML = ""  // очищаем текст

  // заставляем браузер пересчитать
  text.offsetHeight

  // небольшой таймаут, чтобы класс добавился корректно
  setTimeout(()=>{
      text.classList.add("show")
      typeText(scenes[step], text)
  }, 50)  // 50мс — достаточно
}

function typeText(html, element, speed = 35){

  let i = 0
  typing = true
  element.innerHTML = ""  // очистка текста

  const cursor = `<span class="cursor">|</span>`

  function typingLoop(){

    if(i >= html.length){
      typing = false
      element.innerHTML = element.innerHTML.replace(cursor,"") + cursor
      return
    }

    if(html.substring(i,i+4) === "<br>"){
      element.innerHTML = element.innerHTML.replace(cursor,"") + "<br>" + cursor
      i += 4
    }else{
      element.innerHTML = element.innerHTML.replace(cursor,"") + html[i] + cursor
      i++
    }

    setTimeout(typingLoop,speed)
  }

  element.innerHTML = cursor
  typingLoop()
}

showScene()

next.onclick = () => {

if(typing) return

if(step === 0){

music.volume = 0.6
music.play().catch(()=>{})

}

step++

if(step < scenes.length){

showScene()

}else{

next.style.display="none"

const choice = document.getElementById("choice")

choice.style.display="block"

setTimeout(()=>{
choice.style.opacity=1
},50)

}

}

window.yes = function() {
  console.log("yes() called");

  const fadeDuration = 3000; // 3 секунды для кроссфейда
  const fadeInterval = 50;    // интервал обновления громкости
  const maxVolume = 0.6;

  const oldTrack = document.getElementById("music");

  // создаём новый трек как отдельный объект, чтобы поток был чистый
  const newTrack = new Audio("/sound/breakdown.mp3");
  newTrack.volume = 0;
  newTrack.currentTime = 0;

  // запускаем новый трек сразу
  newTrack.play().then(() => console.log("Breakdown started")).catch(console.error);

  // рассчитываем шаги fade
  const steps = fadeDuration / fadeInterval;
  const fadeOutStep = oldTrack.volume / steps;
  const fadeInStep = maxVolume / steps;

  // кроссфейд
  const crossfade = setInterval(() => {
    oldTrack.volume = Math.max(0, oldTrack.volume - fadeOutStep);
    newTrack.volume = Math.min(maxVolume, newTrack.volume + fadeInStep);

    // когда старый трек полностью затух и новый достиг максимума
    if (oldTrack.volume === 0 && newTrack.volume >= maxVolume) {
      clearInterval(crossfade);
      oldTrack.pause();
      oldTrack.currentTime = 0;
      console.log("Crossfade complete");
    }
  }, fadeInterval);

  // плавный переход текста
  const container = document.getElementById("container");
  container.style.transition = "3s";
  container.style.opacity = "0";

  setTimeout(() => {
    container.innerHTML = `
      <div style="text-align:center;color:#e8e8e8;font-family:Cormorant,serif">
        <h1 style="font-size:42px">Then today becomes the beginning</h1>
        <p style="font-size:26px;margin-top:20px">March 8</p>
        <p style="margin-top:20px;font-size:22px">Welcome to us</p>
      </div>
    `;
    container.style.opacity = "1";
  }, fadeDuration);
}

window.no = function(){

document.body.innerHTML = `

<div style="text-align:center;color:#e8e8e8;font-family:Cormorant,serif">

<p style="font-size:28px">That's okay.</p>

<p style="margin-top:20px">The story was still worth telling.</p>

</div>

`

}

/* частицы мыши */

document.addEventListener("mousemove", e => {

const dot = document.createElement("div")

dot.style.position="fixed"
dot.style.left=e.clientX+"px"
dot.style.top=e.clientY+"px"

dot.style.width="2px"
dot.style.height="2px"

dot.style.background="#7a0000"

dot.style.opacity="0.6"

dot.style.pointerEvents="none"

document.body.appendChild(dot)

setTimeout(()=>{
dot.remove()
},500)

})

})