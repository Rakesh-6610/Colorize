let pallets = [];
let rendered_pallets = [];
let rendered_pallets_index = -1;

async function api_call(locked_colors) {
    const url = "http://colormind.io/api/";
    const data = {
        model : "default",
        input : locked_colors
    };
    
    const http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            const result = JSON.parse(http.responseText).result;  

            if (pallets.includes(result)) {
                api_call(colors);
            }
            else{
                pallets.push(result);

                if (pallets.length === 1) {render_pallet()}       
            }
        }
    }
    
    http.open("POST", url, true);
    http.send(JSON.stringify(data));
}


async function generate_pallets() {
    for (let i = 0; i < 10; i++) {
        api_call(["N","N","N","N","N"]);
    }
}



function change_color(colors) {
    for(let i = 0; i < 5; i++) {
        $(":root").css("--primary-color-" + (i + 1), `rgb(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`);
    }
}





function render_pallet() {
    rendered_pallets_index = rendered_pallets.length;

    if (rendered_pallets_index % 5 == 0 && rendered_pallets_index != 0) {
        generate_pallets();
    }
    rendered_pallets.push(pallets[rendered_pallets_index]);
    change_color(pallets[rendered_pallets_index]);

    console.log(rendered_pallets_index);
}

function render_previous() {
    if (rendered_pallets_index <= 0) {
        $("undo").css("opacity", "0.5");
        return;
    }
    else {
        rendered_pallets_index -= 1;
        change_color(pallets[rendered_pallets_index]);
    }

    console.log(rendered_pallets_index);
}






$(".generate").click(() => {
    render_pallet();
})

$(".undo").click(() => {
    render_previous();
})

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        render_previous();
    }

    if (e.key === " ") {
        render_pallet();
    }
})

















document.addEventListener("DOMContentLoaded", () => {
    generate_pallets();
})

