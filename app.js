var pallets = [];

async function api_call(colors) {
    const url = "http://colormind.io/api/";
    const data = {
        model : "default",
        input : colors
    }
    
    const http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            const result = JSON.parse(http.responseText).result;  
            pallets.push(result)
            change_color(result)
            console.log(result[0])
            
        }
    }
    
    http.open("POST", url, true);
    http.send(JSON.stringify(data));
}


function change_color(colors) {
    for(let i = 0; i < 5; i++) {
        $(":root").css("--primary-color-" + (i + 1), `rgb(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`);
    }
}
for (let i = 0; i < 5; i++) {
    api_call([[44,43,44],[90,83,82],"N","N","N"])
}
console.log("hello")


