// console.log("lets play");
let currentSong=new Audio(); 
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds){

    if(isNaN(seconds)|| seconds<0){
        return "00:00";
    }

    const minutes= Math.floor(seconds/60);
    const remainingSeconds=Math.floor(seconds%60);

    const formattedMinutes=String(minutes).padStart(2,'0');
    const formattedSeconds=String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`https://github.com/Adarsh5415/spotify-clone/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    // console.log("Links found:", as);

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // console.log("Processing link:", element.href);

        if (element.href.endsWith(".mp3")) {
            let songName = element.href.split(`${folder}/`)[1];
            // console.log("Extracted song name:", songName);
            if (songName) { // Ensure songName is not undefined
                songs.push(songName);
            }
        }
    }

    //play the first song



    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    
    songul.innerHTML=" ";
    
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ",)}</div>
                                <div>Author</div>
                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="img/play.svg">
                            </div>
                         </li>`;
    }

    //Attach event listner to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{    
        
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());    
    });
    })
    return songs
    // console.log("Songs array:", songs);
}

const playMusic=(track,pause=false)=>{
    currentSong.src=`/${currFolder}/`+track
    if(!pause){
    currentSong.play()
    play.src="img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function displayAlbums(){

    let a = await fetch(`https://github.com/Adarsh5415/spotify-clone/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a");
    let cardContainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        

    if (e.href.includes("/songs")) {
        let folder = e.href.split("/").slice(-2)[0]
        //Get the meta dta of the folder
        let a = await fetch(`https://github.com/Adarsh5415/spotify-clone/songs/${folder}/info.json`);
        let response = await a.json();
        console.log(response);
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"  class="card">
                        <div  class="play">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#000" xmlns="http:// www.w3.org/2000/svg">
                                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                        </div>
                        <img  src="/songs/${folder}/cover.jpg" alt="">
                        <h2> ${response.title} </h2>
                        <p> ${response.description}</p>
                    </div>`
    }

}

        //load the plasylist when card is clicked

        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click",async item=>{
                songs= await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                playMusic(songs[0])
            })
        })
    }

async function mian() {
    await getSongs("songs")
    playMusic(songs[0],true)

    //display all the albums on th page

    displayAlbums()


    //atttach and event listner to play next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="img/play.svg"
        }

    })

    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}
        /${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/ currentSong.duration)*100+"%";
    })

    //Add event lister to seek bar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width) *100;
        document.querySelector(".circle").style.left = percent +"%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100;
    })

    //Event of hamburger

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    //Previous and next button functionality

    previous.addEventListener("click",()=>{
        // currentSong.pause()
        console.log("previous Clicked")
        // console.log(currentSong)
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs,index)
        if((index-1)>=0){
            playMusic(songs[index-1])

        }
    })

    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("next Clicked")
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs,index)
        if((index+1)< songs.length ){
            playMusic(songs[index+1])

        }

    })

    //Adding volume control

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        // console.log("setting volume to", e.target.value)
        currentSong.volume=parseInt(e.target.value)/100
        if (currentSong.volume>0){
            document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
    })

    //Add event Listner to mute the track

    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src= e.target.src.replace=("volume.svg" ,"mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src=e.target.src.replace=( "mute.svg","volume.svg")
            currentSong.volume=.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })





}

mian()

