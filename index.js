document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.dropzone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain',e.target.id);
        });

        draggable.addEventListener('touchstart', (e) => {
            const touch = e.targetTouches[0];
            e.target.dataset.touchId = touch.identifier;
            e.target.style.position = 'absolute';
            e.target.style.left = `${touch.clientX - e.target.offsetWidth / 2}px`;
            e.target.style.top = `${touch.clientY - e.target.offsetHeight / 2}px`;
        });

        draggable.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = Array.from(e.changedTouches).find(t => t.identifier == e.target.dataset.touchId);
            if (touch) {
                e.target.style.left = `${touch.clientX - e.target.offsetWidth / 2}px`;
                e.target.style.top = `${touch.clientY - e.target.offsetHeight / 2}px`;
            }
        });

        draggable.addEventListener('touchend', (e) => {
            const touch = Array.from(e.changedTouches).find(t => t.identifier == e.target.dataset.touchId);
            if (touch) {
                const dropzone = document.elementFromPoint(touch.clientX, touch.clientY).closest('.dropzone');
                if (dropzone) {
                    dropzone.appendChild(e.target);
                }
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
});
