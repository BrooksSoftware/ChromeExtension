let btnYbr = document.createElement('button');
btnYbr.innerText = "Add to YBR";
btnYbr.id = "btnYbr";

let child = document.querySelector('div.item-description')
child.parentNode.prepend(btnYbr);