document.addEventListener("DOMContentLoaded", () => {
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function createAudio(src, volume = 0.6) {
  const track = new Audio(`${src}?cb=${Date.now()}`); // cachebuster
  track.volume = volume;
  
  // подключение к AudioContext
  const source = audioCtx.createMediaElementSource(track);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  track.play().catch(err => console.warn("Audio play failed:", err));

  return { track, analyser };
}
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

let activeAnalyser;
let musicTrack;

next.onclick = () => {
  if(typing) return;

  if(step === 0){
    if(audioCtx.state === 'suspended') audioCtx.resume(); // автозапуск в браузерах
    const { track, analyser } = createAudio("/sound/all_i_need_instrumental.mp3", 0.6);
    musicTrack = track;
    activeAnalyser = analyser;  // <- подключаем анализатор здесь
  }

  step++;

  if(step < scenes.length){
    showScene();
  } else {
    next.style.display="none";
    const choice = document.getElementById("choice");
    choice.style.display="block";
    setTimeout(()=>{choice.style.opacity=1},50);
  }
}

window.yes = function() {
  console.log("yes() called");

  const fadeDuration = 3000; // 3 секунды
  const fadeInterval = 50;
  const maxVolume = 0.6;

  if(!musicTrack) return;

  // создаём новый трек
  const { track: newTrack, analyser: newAnalyser } = createAudio("/sound/breakdown.mp3", 0);
  activeAnalyser = newAnalyser;

  const steps = fadeDuration / fadeInterval;
  const fadeOutStep = musicTrack.volume / steps;
  const fadeInStep = maxVolume / steps;

  const crossfade = setInterval(() => {
    musicTrack.volume = Math.max(0, musicTrack.volume - fadeOutStep);
    newTrack.volume = Math.min(maxVolume, newTrack.volume + fadeInStep);

    if (musicTrack.volume === 0 && newTrack.volume >= maxVolume) {
      clearInterval(crossfade);
      musicTrack.pause();
      musicTrack.currentTime = 0;
      musicTrack = newTrack; // новый трек становится активным
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

const canvases = [
  document.getElementById("leftViz"),
  document.getElementById("rightViz")
];

const ctxs = canvases.map(c => {
  c.width = 250;
  c.height = window.innerHeight;
  return c.getContext("2d");
});


function connectAudio(audioElement) {
  const source = audioCtx.createMediaElementSource(audioElement);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  return analyser;
}

function draw() {
  requestAnimationFrame(draw);
  const dataArray = new Uint8Array(activeAnalyser.frequencyBinCount);
  activeAnalyser.getByteFrequencyData(dataArray);

  ctxs.forEach((ctx, idx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      const barHeight = (value / 255) * (ctx.canvas.height / 2);
      const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0, "#ff5555");
      gradient.addColorStop(1, "#7a0000");
      ctx.fillStyle = gradient;

      const barWidth = ctx.canvas.width / dataArray.length;

      if (idx === 0) {
        // Левый canvas: растём к центру
        ctx.fillRect(i * barWidth, ctx.canvas.height/2 - barHeight, barWidth*0.8, barHeight); // вверх
        ctx.fillRect(i * barWidth, ctx.canvas.height/2, barWidth*0.8, barHeight); // вниз
      } else {
        // Правый canvas: зеркально
        ctx.fillRect(ctx.canvas.width - i * barWidth - barWidth*0.8, ctx.canvas.height/2 - barHeight, barWidth*0.8, barHeight); // вверх
        ctx.fillRect(ctx.canvas.width - i * barWidth - barWidth*0.8, ctx.canvas.height/2, barWidth*0.8, barHeight); // вниз
      }
    }
  });
}

draw();

})