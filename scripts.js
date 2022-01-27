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
// console.log("title"+productTitle.innerHTML);
//get product price
price_parent = document.getElementById('corePrice_desktop');
var price = price_parent.querySelector('.a-offscreen');
console.log("a-offscreen123"+price.innerHTML);



//Show Modal
function showModal(contentHtml, buttons) {
	const modal = document.createElement("div");
  
	modal.classList.add("modal");
	modal.innerHTML = `
		  <div class="modal__inner">
			  <div class="modal__top">
				  <div class="modal__title">Save Product</div>
				  <button class="modal__close" type="button">
					  <span class="material-icons">X</span>
				  </button>
			  </div>
			  <div class="modal__content">
			  <select name="ybr" id="ybr" style="width: 230px;">
			  $('#ybr').append("<option value='ybr'>Choose a List</option>");
			</select>
			  </div>
			  <div id="btnSave" class="modal__bottom"></div>
		  </div>
	  `;


  
	for (const button of buttons) {
	  const element = document.createElement("button");
  
	  element.setAttribute("type", "button");
	  element.classList.add("modal__button");
	  element.textContent = button.label;
	  element.addEventListener("click", () => {
		if (button.triggerClose) {
		  document.body.removeChild(modal);
		}
  
		button.onClick(modal);
	  });
  
	  modal.querySelector(".modal__bottom").appendChild(element);
	}
  
	modal.querySelector(".modal__close").addEventListener("click", () => {
	  document.body.removeChild(modal);
	});
  
	document.body.appendChild(modal);
  }


//add button 
button_add = document.getElementById('titleSection');
var button = document.createElement("button");
button.id = "btnYbr";
button.innerHTML = "Add to YBR";
button.addEventListener('click', function() {
    showModal("", [
		{
		  label: "Save",
		  onClick: (modal) => {
			  
				var lot = $("#ybr option:selected").attr("value");
				// var description = $('#feature-bullets').children('ul').children('li').children('span').text();

				var settings = {
				  "url": "https://ybr.app/version-test/api/1.1/obj/products_uniques/bulk",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"content-type": "text/plain"
				  },
				  "data": '{"Title":"'+productTitle.innerHTML+'", "Lot":"'+lot+'"}',
				  success: function(response){
						console.log(JSON.parse(response));
				  }
				};
			
				$.ajax(settings).done(function (response) {
					// let selected = $("#ybr option:selected").attr("prod")
					// // console.log(selected.split(','));

					// fetch("https://ybr.app/version-test/api/1.1/obj/test/1643259862393x416304162185907600", {
					// method: "PATCH",
					// body: JSON.stringify({
					// prod: selected.split(',')
					// prod: 
					// }),
					// headers: {
					// "Content-type": "application/json; charset=UTF-8"
					// }
					// }).then(response => response.json())
					// .then(json => {console.log(json)})
				//   console.log("responsejrb"+ response.id);
				//   console.log("responsejrb"+ JSON.stringify(response));
				}).done(json => {console.log(json.id)});
		  },
		  triggerClose: false
		}
	  ]);

	  var getJSON = function(url, callback) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'json';
			xhr.onload = function() {
			var status = xhr.status;
			if (status === 200) {
				callback(null, xhr.response);
			} else {
				callback(status, xhr.response);
			}
			};
			xhr.send();
		};

		getJSON('https://ybr.app/version-test/api/1.1/obj/product_list',
		function(err, data) {
		if (err !== null) {
			alert('Something went wrong: ' + err);
		} else {
			let res = data.response.results;
			console.log(res)
			for(var i = 0; i < res.length; i++){
				var option = document.createElement("option");
				option.text = res[i]["List Name"];
				option.value = res[i]["_id"];
				option.setAttribute("prod", res[i]["Products"]);
				document.getElementById('ybr').appendChild(option);
			}
		}
		});
	
	// var settings = {
	//   "url": "https://mvptestjrb.bubbleapps.io/version-test/api/1.1/obj/YBR/bulk",
	//   "method": "POST",
	//   "timeout": 0,
	//   "headers": {
	// 	"content-type": "text/plain"
	//   },
	//   "data": '{"title":"'+productTitle.innerHTML+'","price":"'+price.innerHTML+'"}',
	// };

	// $.ajax(settings).done(function (response) {
	// 	alert();
	//   console.log("responsejrb"+response);
	// });
}, false);
button_add.appendChild(button);
}


// $.getJSON('ybr.app/version-test/api/1.1/obj/product_list', function(data) {
        
// 	var items = [];
// 	  $.each( data, function( key, val ) {
// 		items.push( "<li id='" + key + "'>" + val + "</li>" );
// 	  });
	 
// 	  $( "<ul/>", {
// 		"class": "my-new-list",
// 		html: items.join( "" )
// 	  }).appendTo( "ybr" );
// 	console.log(data)
// 	alert();
// });

// $(document).ready(function(){

	// $('#dis').on('change',function() {
		
	//   var str='';
	//   var s1ar=document.getElementById('dis');
	//   for (i=0;i< s1ar.length;i++) { 
	// 	if(s1ar[i].selected) {
	// 	  str += s1ar[i].value + ','; 
	// 	}
	//   }
	  

	//   $.ajax({
	// 	type: "GET",
	// 	url: "https://ybr.app/version-test/api/1.1/obj/product_list",
	// 	dataType: "json",
	// 	success: function(data) {
	// 	  $('#ybr').empty();
	// 	  $('#ybr').append("<option value='ybr'>Choose a List</option>");
	// 	  $.each(data, function(i,item){
	// 		var selecting=''; 
	// 		if ($('#dis').val().findIndex(x => x==data[i].id)>=0) {
	// 		  selecting = ' selected="selected"'; 
	// 		} else {
	// 		  selecting = '';
	// 		}
	// 		$('#ybr').append('<option '+selecting+' value="'+uniqueid[i].id+'">'+List_name[i].name+'</optoin>');
	// 	  });
	// 	}, 
	// 	complete: function() {}
	//   }); 
// 	});
// });

/*
$("div.s-result-item").each(function() {
  var divId = $(this).find('div').data('asin');
  console.log(divId);
});*/

//delete product floating btn
var deleteFloatingBtn = document.createElement( 'button' );

document.body.appendChild( deleteFloatingBtn );

deleteFloatingBtn.id = 'deleteFloatingBtn';
deleteFloatingBtn.innerHTML = "Delete from YBR";


//upload product floating btn
var uploadFloatingBtn = document.createElement( 'button' );

document.body.appendChild( uploadFloatingBtn );

uploadFloatingBtn.id = 'uploadFloatingBtn';
uploadFloatingBtn.innerHTML = "Upload Products";

//export product floating btn
var exportFloatingBtn = document.createElement( 'button' );

document.body.appendChild( exportFloatingBtn );

exportFloatingBtn.id = 'exportFloatingBtn';
exportFloatingBtn.innerHTML = "Export Product";