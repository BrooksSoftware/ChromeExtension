/*document.body.style.backgroundColor = "yellow";
var button = document.createElement("button");
document.getElementById("stopwatch").appendChild(button);
console.log("console"+document.getElementById('stopwatch').innerHTML);*/


//list of products
/*parent = document.querySelector('.s-main-slot');
children = document.querySelectorAll('.s-main-slot .s-result-item');
//console.log("children"+JSON.stringify(children[0].innerHTML));
console.log("children1"+JSON.stringify(children[1].innerHTML));
var name = children[0].getElementsByTagName('h2').item(0);
console.log("name"+name);*/

add_save_to_ybr_button();
//product page
function add_save_to_ybr_button(){
//get product title
productTitle = document.getElementById('productTitle');
console.log("title"+productTitle.innerHTML);
//get product price
price_parent = document.getElementById('corePrice_desktop');
var price = price_parent.querySelector('.a-offscreen');
console.log("a-offscreen123"+price.innerHTML);

//add button 
button_add = document.getElementById('titleSection');
var button = document.createElement("button");
button.id = "btnYbr";
button.innerHTML = "Add to YBR";
button.addEventListener('click', function() {
    alert("boss aljon");
	var settings = {
	  "url": "https://mvptestjrb.bubbleapps.io/version-test/api/1.1/obj/YBR/bulk",
	  "method": "POST",
	  "timeout": 0,
	  "headers": {
		"content-type": "text/plain"
	  },
	  "data": '{"title":"'+productTitle.innerHTML+'","price":"'+price.innerHTML+'"}',
	};

	$.ajax(settings).done(function (response) {
	  console.log("responsejrb"+response);
	});
}, false);
button_add.appendChild(button);
}


/*
$("div.s-result-item").each(function() {
  var divId = $(this).find('div').data('asin');
  console.log(divId);
});*/