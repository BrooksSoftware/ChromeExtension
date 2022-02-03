
let btnYbr = document.createElement('button');
let img = document.createElement('img');
btnYbr.innerText = "Add to YBR";
btnYbr.id = "btnYbr";
img.src = chrome.extension.getURL('YBR-Logo.png');
img.id = "ybrImg";
img.style.width = "90px";

let child = $('#auctionData').children('h1');
child.after(img);
$('#ybrImg').after(btnYbr);


