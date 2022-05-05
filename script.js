let main = document.querySelector(".main");

let rows = Array(10).fill(0);
let field = Array(20).fill(rows);

function draw() {
    let fieldHTML = '';
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            if (field[y][x] === 1) {
                fieldHTML += '<div class="cell movingCell"></div>'
            } else if (field[y][x] === 2) {
                fieldHTML += '<div class="cell fixedCell"></div>'
            } else fieldHTML += '<div class="cell"></div>';
        }
    }
    main.innerHTML = fieldHTML;
}
draw();