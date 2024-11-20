document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.dropzone');
    const deck = document.querySelector('.deck');
    const hand = document.querySelector('.hand');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain',e.target.id);
        });

        draggable.addEventListener('touchstart', (e) => {
            const touch = e.targetTouches[0]; 
            e.target.dataset.touchId = touch.identifier; 
            e.target.style.position = 'absolute'; 
            e.target.style.left = `${touch.clientX - e.target.offsetWidth / 2 - e.target.offsetParent.offsetLeft + window.pageXOffset}px`;
            e.target.style.top = `${touch.clientY - e.target.offsetHeight / 2 - e.target.offsetParent.offsetTop + window.pageYOffset}px`; 
        });

        draggable.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = Array.from(e.changedTouches).find(t => t.identifier == e.target.dataset.touchId);
            if (touch) {
                e.target.style.left = `${touch.clientX - e.target.offsetWidth / 2 - e.target.offsetParent.offsetLeft + window.pageXOffset}px`; 
                e.target.style.top = `${touch.clientY - e.target.offsetHeight / 2 - e.target.offsetParent.offsetTop + window.pageYOffset}px`; 
            }
        });

        draggable.addEventListener('touchend', (e) => {
            const touch = Array.from(e.changedTouches).find(t => t.identifier == e.target.dataset.touchId);
            const tg = e.target
            if (touch) { 
                tg.style.visibility = 'hidden'; 
                const dropzone = document.elementFromPoint(touch.clientX, touch.clientY).closest('.dropzone'); 
                tg.style.visibility = ''; 
                if (dropzone) { 
                    dropzone.appendChild(e.target);
                } 
                tg.style.left=''; 
                tg.style.top=''; 
            } 
            delete e.target.dataset.touchId;
        });
    });

    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover',(e) =>{
            e.preventDefault();
        })

        dropzone.addEventListener('drop',(e)=>{
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const item = document.getElementById(id);

            dropzone.appendChild(item);
        })
    })

    const cards = document.querySelectorAll('.card');
    const conr = document.querySelector('.container');
    const cardWidth = conr.clientWidth * 0.12;
    const cardHeight = cardWidth * 1.4;
    cards.forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
    })

    deck.addEventListener('click',(e)=>{
        if(deck.firstElementChild){
            hand.appendChild(deck.firstElementChild);
        }
    });
});


