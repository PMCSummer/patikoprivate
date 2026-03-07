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

next.onclick = () => {

if(step === 0){
music.volume = 0.6
music.play()
}

text.classList.remove("show")

setTimeout(()=>{

text.innerHTML = scenes[step]

text.classList.add("show")

step++

if(step === scenes.length){

next.style.display="none"
document.getElementById("choice").style.display="block"

}

},800)

}

function yes(){

document.body.innerHTML = `

<div style="text-align:center">

<h1>Then today becomes the beginning.</h1>

<p>March 8</p>

<p>Welcome to us.</p>

</div>

`

}

function no(){

document.body.innerHTML = `

<div style="text-align:center">

<p>That's okay.</p>

<p>The story was still worth telling.</p>

</div>

`

}