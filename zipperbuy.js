
let btnYbr = document.createElement('button');
let img = document.createElement('img');
btnYbr.innerText = "Add to YBR";
btnYbr.id = "btnYbr";
img.src = chrome.extension.getURL('YBR-Logo.png');
img.style.width = "90px";

let child = document.querySelector('div.item-description')
child.parentNode.prepend(btnYbr);
child.parentNode.prepend(img);

