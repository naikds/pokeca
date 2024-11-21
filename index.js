const hand = document.querySelector('.hand');
const deck = document.querySelector('.deck');
const trash = document.querySelector('.trash');
//初期読み込みstart
document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.dropzone');
    const menuBtns = document.querySelectorAll('.menuBtn');


    //ドラッグ処理
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain',e.target.id);
        });

        draggable.addEventListener('touchstart', (e) => {
            const touch = e.targetTouches[0]; 
            e.target.dataset.touchId = touch.identifier; 
            document.getElementById('container').appendChild(e.target);
            e.target.style.position = 'absolute'; 
            e.target.style.left = `${touch.clientX - e.target.offsetWidth / 2 - e.target.offsetParent.offsetLeft + window.scrollX}px`;
            e.target.style.top = `${touch.clientY - e.target.offsetHeight / 2 - e.target.offsetParent.offsetTop + window.scrollY}px`;
            e.target.dataset.moto = e.target.offsetParent.id;
        });

        draggable.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = Array.from(e.changedTouches).find(t => t.identifier == e.target.dataset.touchId);
            if (touch) {
                e.target.style.left = `${touch.clientX - e.target.offsetWidth / 2 - e.target.offsetParent.offsetLeft + window.scrollX}px`; 
                e.target.style.top = `${touch.clientY - e.target.offsetHeight / 2 - e.target.offsetParent.offsetTop + window.scrollY}px`; 
            }
        });

        draggable.addEventListener('touchend', (e) => {
            const touch = Array.from(e.changedTouches).find(t => t.identifier == e.target.dataset.touchId);
            const tg = e.target
            document.getElementById(e.target.dataset.moto).appendChild(e.target);
            if (touch) { 
                tg.style.visibility = 'hidden'; 
                const dropzone = document.elementFromPoint(touch.clientX, touch.clientY).closest('.dropzone'); 
                tg.style.visibility = ''; 
                if (dropzone) { 
                    dropzone.appendChild(e.target);
                    if(dropzone.classList.contains('deck')){
                        dropzone.prepend(e.target);
                    }
                } 
                tg.style.left=''; 
                tg.style.top=''; 
            } 
            e.target.style.position = ''; 
            e.target.zIndex =e.target.dataset.zind;
            delete e.target.dataset.touchId;
            delete e.target.dataset.zind;
        });
    });

    //ドロップ処理
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

    //カードのサイズ変更処理
    const cards = document.querySelectorAll('.card');
    const conr = document.querySelector('.container');
    const cardWidth = conr.clientWidth * 0.12;
    const cardHeight = cardWidth * 1.4;
    cards.forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
    })

    //ボタンのメニュー設定
    menuBtns.forEach(menuBtn => {
        const contextMenu = document.getElementById(menuBtn.getAttribute('data-menu'));
        contextMenu.style.top = `${menuBtn.offsetTop}px`;

        menuBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${menuBtn.offsetLeft - contextMenu.offsetWidth}px`
        });
    
        menuBtn.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchY = e.changedTouches[0].clientY;
            const touchX = e.changedTouches[0].clientX;
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.style.backgroundColor = '';
                const rect = item.getBoundingClientRect();
                if (touchY >= rect.top && touchY <= rect.bottom && touchX >= rect.left && touchX <= rect.right) {
                    item.style.backgroundColor = '#0078d4';
                }
            });
        });
    
        menuBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchY = e.changedTouches[0].clientY;
            const touchX = e.changedTouches[0].clientX;
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                if (touchY >= rect.top && touchY <= rect.bottom && touchX >= rect.left && touchX <= rect.right) {
                    const action = item.getAttribute('data-action');
                    btnAct(action);
                }
            });
            contextMenu.style.display = 'none';
        });
    })

    // モーダルを開く
    document.querySelectorAll('button[id^="openModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.id.replace('open', '').toLowerCase();
            document.getElementById(modalId).style.display = "block";
        });
    });

    // モーダルを閉じる
    document.querySelectorAll('.close').forEach(span => {
        span.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).style.display = "none";
            document.getElementById(modalId).querySelector('.image-container').innerHTML='';
        });
    });

    // 選択した画像を移動する
    document.querySelectorAll('.move').forEach(button => {
        button.addEventListener('click', function() {
            const targetModal = this.getAttribute('data-target');
            const currentModal = this.closest('.modal');
            const srcModal = currentModal.getAttribute('data-src');
            const selectedImages = currentModal.querySelectorAll('.selected');
            const targetArea = document.querySelector(targetModal);
            const srcArea = document.querySelector(srcModal);
            selectedImages.forEach(img => {
                targetArea.appendChild(srcArea.querySelector('#' + img.id));
            });
            currentModal.style.display= "none";
            currentModal.querySelector('.image-container').innerHTML='';
        });
    });
});
//初期読み込みend

function btnAct(actionNm){
    const modal = document.getElementById('modal');
    const targetContainer = modal.querySelector('.image-container');
    switch(actionNm){
        case 'draw':
            if(deck.firstElementChild){
                hand.appendChild(deck.firstElementChild);
            }
            break;
        
        case 'deck_shufl':
            const items = Array.from(deck.children);
            const shuffledItems = shuffleArray(items);
    
            // コンテナをクリア
            deck.innerHTML = '';
    
            // シャッフルされた要素を再度追加
            shuffledItems.forEach(item => {
                deck.appendChild(item);
            });
            break;
        
        case 'deck_show':
            modal.setAttribute('data-src','.deck');

            const deckCopy = Array.from(deck.children).map(child => child.cloneNode(true));

            deckCopy.forEach(img => {
                // 画像の選択イベントを追加
                img.addEventListener('touchstart',(e) => {
                    e.target.classList.toggle('selected');
                });
                targetContainer.appendChild(img);
            });
            modal.style.display = "block";
            break;
        
        case 'trash_show':
            modal.setAttribute('data-src','.trash');

            const trashCopy = Array.from(trash.children).map(child => child.cloneNode(true));

            trashCopy.forEach(img => {
                // 画像の選択イベントを追加
                img.addEventListener('touchend',(e) => {
                    e.target.classList.toggle('selected');
                });
                targetContainer.appendChild(img);
            });
            modal.style.display = "block";
            break;
    }
}

function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}





