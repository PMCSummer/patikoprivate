let step = 0

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

setTimeout(()=>{

typeText(scenes[step], text)
text.classList.add("show")

},400)

}

showScene()

next.onclick = () => {

if(step === 0){

music.volume = 0.6
music.play()

}

step++

if(step < scenes.length){

showScene()

}else{

next.style.display="none"
document.getElementById("choice").style.display="block"

setTimeout(()=>{
document.getElementById("choice").style.opacity=1
},50)

}

}

function yes(){

document.body.style.transition="3s"
document.body.style.opacity="0"

setTimeout(()=>{

document.body.innerHTML = `
<div style="text-align:center;color:#e8e8e8;font-family:Cormorant,serif">

<h1 style="font-size:42px">Then today becomes the beginning</h1>

<p style="font-size:26px;margin-top:20px">March 8</p>

<p style="margin-top:20px;font-size:22px">Welcome to us</p>

</div>
`

document.body.style.opacity="1"

},3000)

}

function typeText(html, element, speed = 35){

let i = 0
element.innerHTML = ""

function typing(){

if(i >= html.length) return

if(html.substring(i, i+4) === "<br>"){
element.innerHTML += "<br>"
i += 4
}else{
element.innerHTML += html[i]
i++
}

setTimeout(typing, speed)

}

typing()

}

function no(){

document.body.innerHTML = `

<div style="text-align:center;color:#e8e8e8;font-family:Cormorant,serif">

<p style="font-size:28px">That's okay.</p>

<p style="margin-top:20px">The story was still worth telling.</p>

</div>

`

}

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