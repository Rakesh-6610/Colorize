let pallets = [];
let rendered_pallets = [];
let rendered_pallets_index = -1;
let locked_colors = ["N","N","N","N","N"];
let locked_colors_indexes = [];
let is_locked_color = false

async function api_call(colors) {
    const url = "http://colormind.io/api/";
    const data = {
        model : "default",
        input : colors
    };
    
    const http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            const result = JSON.parse(http.responseText).result;  

            pallets.push(result);

            if (pallets.length === 1) {render_pallet()}       
            
        }
    }
    
    http.open("POST", url, true);
    http.send(JSON.stringify(data));
}


async function generate_pallets() {
    for (let i = 0; i < 10; i++) {
        api_call(locked_colors);
    }
}



function change_color(colors) {
    for(let i = 0; i < 5; i++) {
        if (locked_colors_indexes.includes(String(i))) {
            continue;
        }
        else {
            $(":root").css("--primary-color-" + (i + 1), `rgb(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`);
        }
    }
}





function render_pallet() {
    rendered_pallets_index = rendered_pallets.length;



    if (rendered_pallets_index % 5 == 0 && rendered_pallets_index != 0) {
        generate_pallets();
    }
    rendered_pallets.push(pallets[rendered_pallets_index]);
    change_color(pallets[rendered_pallets_index]);

}



function render_previous() {

    $(".next").css("opacity", "1");
    if (rendered_pallets_index <= 0) {
        return;
    }
    else {
        rendered_pallets_index -= 1;
        if (rendered_pallets_index === 0) {
            $(".undo").css("opacity", "0.5");
        }
        change_color(pallets[rendered_pallets_index]);
    }
}


function render_next() {

    $(".undo").css("opacity", "1");
    if (rendered_pallets_index >= rendered_pallets.length - 1) {
        return;
    }
    else {
        rendered_pallets_index += 1;
        if (rendered_pallets_index === rendered_pallets.length - 1) {
            $(".next").css("opacity", "0.5");
        }
        change_color(pallets[rendered_pallets_index]);
    }
}




$(".generate").click(() => {
    $(".undo").css("opacity", "1");
    $(".next").css("opacity", "0.5");
    render_pallet();
})

$(".undo").click(() => {
    render_previous();
})

$(".next").click(() => {
    render_next();
})
$(".color").click((e) => {
    is_locked_color = true;
    let index = String(e.target.getAttribute("index_value"));
    if (locked_colors_indexes.includes(index)) {
        locked_colors_indexes.pop(index);
        locked_colors[Number(index)] = "N";
    }
    else {
        locked_colors_indexes.push(index);
        locked_colors[Number(index)] = rendered_pallets[rendered_pallets_index][Number(index)];
    }
    
})


document.addEventListener("keydown", (e) => {
    if (e.key === "y" && e.ctrlKey) {
        render_next();
    }
    if (e.ctrlKey && e.key === "z") {
        render_previous();
    }

    if (e.key === " ") {
        $(".undo").css("opacity", "1");
        $(".next").css("opacity", "0.5");
        render_pallet();
    }
})

















document.addEventListener("DOMContentLoaded", () => {
    generate_pallets();

    $(".undo").css("opacity", "0.5");
    $(".next").css("opacity", "0.5");
})

