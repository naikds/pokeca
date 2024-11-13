document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.dropzone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain',e.target.id);
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
