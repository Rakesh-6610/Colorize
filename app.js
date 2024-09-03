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
            write_code(i, colors[i]);
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
            $(".prev").css("opacity", "0.5");
        }
        change_color(pallets[rendered_pallets_index]);
    }
}


function render_next() {

    $(".prev").css("opacity", "1");
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


function write_code(index, color_list) {
    const red = Number(color_list[0]);
    const green = Number(color_list[1]);
    const blue = Number(color_list[2]);
    const hex = rgbToHex(red, green, blue);
    const is_bright =  (Math.round(Number(red)*0.2126) + Math.round(Number(green)*0.7152) + Math.round(Number(blue)*0.0722)) >= 128;

    const ele_text_block = document.querySelectorAll(".hex_value_main")[index];
    ele_text_block.innerText = hex.toUpperCase();
    if (is_bright) {
        ele_text_block.style.color = "rgba(0, 0, 0, 0.78)";
    }
    else {
        ele_text_block.style.color = "rgba(255, 255, 255, 0.78)";
    }

}


function rgbToHex(r, g, b) {
    const toHex = (color) => {
        const hex = color.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return "#" + toHex(r) + toHex(g) + toHex(b);
}





$(".generate").click(() => {
    $(".prev").css("opacity", "1");
    $(".next").css("opacity", "0.5");
    render_pallet();
})

$(".prev").click(() => {
    render_previous();
})

$(".next").click(() => {
    render_next();
})



function lock_color_btn(ind) {
    is_locked_color = true;
    let index = String(ind);
    let ele_locked = document.querySelectorAll(".color div")[Number(index)];
    console.log(ele_locked);
    if (locked_colors_indexes.includes(index)) {
    locked_colors_indexes.pop(index);
    locked_colors[Number(index)] = "N";
    ele_locked.classList.remove("locked");
    ele_locked.classList.add("unlocked");
    }
    else {
    locked_colors_indexes.push(index);
    locked_colors[Number(index)] = rendered_pallets[rendered_pallets_index][Number(index)];
    ele_locked.classList.remove("unlocked");
    ele_locked.classList.add("locked");
    console.log(ele_locked.classList);
    }
}
















document.addEventListener("keydown", (e) => {
    if (e.key === "y" && e.ctrlKey) {
        render_next();
    }
    if (e.ctrlKey && e.key === "z") {
        render_previous();
    }

    if (e.key === " ") {
        $(".prev").css("opacity", "1");
        $(".next").css("opacity", "0.5");
        render_pallet();
    }
})

















document.addEventListener("DOMContentLoaded", () => {
    generate_pallets();

    $(".prev").css("opacity", "0.5");
    $(".next").css("opacity", "0.5");
})

