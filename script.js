const grid_row=6
const grid_column=5
const cell_size=9
const cell_gap=1
const game_board=document.querySelector(".game-board")
const animate_shake=0.4
var cell_array=[]
var current_words_array=[]
var current_word=[]
var ourwordobj={}
var fake_word_array=['beast', 'being', 'bible', 'brute', 'cards', 'chess', 'coach', 'craps', 'crime', 'dance', 'drama', 'fable', 'faith', 'farsi', 'fauna', 'flick', 'flora', 'fungi', 'genre', 'haiti', 'hoops', 'human', 'humor', 'islam', 'latin', 'logic', 'mafia', 'maths', 'movie', 'music', 'ocean', 'order', 'paxto', 'plane', 'plant', 'poesy', 'poker', 'radio', 'rhyme', 'river', 'rugby', 'sight', 'sport', 'stock', 'trade', 'train', 'verse', 'video', 'virus', 'works']
var ourword=fake_word_array[Math.floor(Math.random()*50)].toUpperCase()
var clone_ourword=[...ourword]
var current_wordobj={}
var colorarr=[]
var isFinished=false
var isLettersEnough=true
fake_word_array=fake_word_array.map(el=>el.toUpperCase())
function getCellColor(letter,index){
    if(ourword[index]===current_word[index]){
        ourwordobj[letter]--
        current_wordobj[letter]--
        return "green"
    }
    else if((ourwordobj[letter]>1 && current_wordobj[letter]>1)){
        ourwordobj[letter]--
        current_wordobj[letter]--
        return "orange"
    }
    else{
        return ""
    }
}
function shakeCurrentRow(k){
    cell_array[k].forEach(cell=>cell.classList.add("toggle-shake"))
    setTimeout(function(){
        cell_array[k].forEach(cell=>cell.classList.remove("toggle-shake"))
    },400)
}
function checkAlpha(char){
    if((char.length===1 || char=="Enter" || char=="Backspace") && char.match(/[a-z]/i)){
        return char
    }
}
function setupGameboard(){
    game_board.style.setProperty("--grid-row",grid_row)
    game_board.style.setProperty("--grid-column",grid_column)
    game_board.style.setProperty("--cell-gap",`${cell_gap}vmin`)
    game_board.style.setProperty("--cell-size",`${cell_size}vmin`)
}
function setupCells(){
    for(let i=0;i<grid_row;i++){
        cell_array[i]=[]
        for(let j=0;j<grid_column;j++){
            const cell_div=document.createElement("div")
            cell_div.classList.add("cell")
            game_board.appendChild(cell_div)
            cell_array[i].push(cell_div)
        }
    }
    guessTheWord(cell_array)
}
function guessTheWord(cell_array){
    var k=0,l=0
    window.addEventListener("keydown",function(e){
        if(k>=grid_row){
            return
        }
        else if(checkAlpha(e.key)=="Enter"){
            colorarr=[]
            if(current_word.length==grid_column){
                var delay_letter=-.4
                if(fake_word_array.includes(current_word.join(""))){
                    for(const el of clone_ourword){
                        ourwordobj[el]=0
                    }
                    for(const el of clone_ourword){
                        ourwordobj[el]++
                    }
                    current_wordobj={}
                    for(const el of current_word){
                        current_wordobj[el]=0
                    }
                    for(const el of current_word){
                        current_wordobj[el]++
                    }
                    // green
                    for(i=0;i<current_word.length;i++){
                        if(current_word[i]===ourword[i]){
                            colorarr[i]="green"
                            current_wordobj[current_word[i]]--
                            ourwordobj[current_word[i]]--
                        }
                    }
                    // orange
                    for(let i=0;i<current_word.length;i++){
                        if(colorarr[i]=="green"){
                            continue
                        }
                        else if(ourwordobj[current_word[i]]>0 && current_wordobj[current_word[i]]>0){
                            colorarr[i]="orange"
                            current_wordobj[current_word[i]]--
                            ourwordobj[current_word[i]]--
                        }
                        else{
                            colorarr[i]="red"
                        }
                    }
                    current_word.forEach((item,i,arr)=>{
                        delay_letter+=.4
                        gsap.to(cell_array[k][i],{rotateX: 360,delay:delay_letter,backgroundColor:colorarr[i],color: "white"})
                    })
                    if(current_word.join("")==ourword){
                        isFinished=true
                        return
                    }
                    l=0
                    k++
                    current_words_array.push(current_word)
                    current_word=[]
                    // add dying function
                }
                else{
                    // warning div appears
                    shakeCurrentRow(k)
                }
            }
            else{
                // warning div appears
                shakeCurrentRow(k)
                return
            }
        }
        else if(checkAlpha(e.key)=="Backspace" && isFinished==false){
            if(l!=0){
                l--
                cell_array[k][l].innerText=""
                current_word.pop()
            }
        }
        else if(current_word.length<grid_column){
            if(checkAlpha(e.key)!=undefined){
                const span=this.document.createElement("span")
                cell_array[k][l].appendChild(span)
                span.innerText=checkAlpha(e.key.toUpperCase())
                span.style.animation="letterAppear .1s linear"
                current_word.push(e.key.toUpperCase())
                span.style.border="1px solid black"
                l++
            }
        }
    })
}
setupGameboard()
setupCells()