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

//get current user id
chrome.runtime.sendMessage({getUser: "cuid"}, function(response) {
	localStorage.setItem("cuid", response.currentUser);
});
var created_by = localStorage.getItem("cuid");

//get webpage products
var products = [];
var prodAsin;//current page product asin
var prodUqId;//current page product ID

var productUrls = document.querySelectorAll('.a-link-normal');
for (var i=0; i<productUrls.length; i++){
	var cleanlink = productUrls[i].href;
	var regex = RegExp("https://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
	m = cleanlink.match(regex);
	if (m) {
		products.push([m.toString().split(',')[0]]);
	}
};

var uniqueUrl = Array.from(new Set(products.map(JSON.stringify))).map(JSON.parse);

function ExtractASIN(url){
	var ASINreg = new RegExp(/(?:\/)([A-Z0-9]{10})(?:$|\/|\?)/);
	var cMatch = url.match(ASINreg);
	if(cMatch == null){
	return null;
	}
	return cMatch[1];
}
var asin = ExtractASIN(window.location.href);

var imgg = $.map($('.imgTagWrapper img'), function(el){
	return $(el).data();
});
var listImages = [];
for(var i = 0; i < imgg.length; i++){
	listImages.push(imgg[i].oldHires)
}
var images = JSON.stringify(listImages)
  var link = window.location.href;

var lot = $("#ybr option:selected").val();
var description = $('#feature-bullets').children('ul').children('li').eq(1).children('span').text();
if($('#feature-bullets').children('ul').children('li').attr('id') === 'replacementPartsFitmentBullet'){
	description = $('#feature-bullets').children('ul').children('li').eq(1).children('span').text();
}else{
	description = $('#feature-bullets').children('ul').children('li').children('span').first().text();
}

add_save_to_ybr_button();
//product page
function add_save_to_ybr_button(){
//get product title
var productTitle = document.getElementById('productTitle');
// console.log("title"+productTitle.innerHTML);
//get product price
price_parent = document.getElementById('corePrice_desktop');
var price = price_parent.querySelector('.a-offscreen');
var savePrice = price == null ? 0.00 : price.innerHTML.replace('$','');
// console.log("a-offscreen123"+price.innerHTML);

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
var addToYbrBtn = document.createElement("button");
addToYbrBtn.id = "btnYbr";
addToYbrBtn.innerHTML = "Add to YBR";
addToYbrBtn.addEventListener('click', function() {
	$('.imageThumbnail .a-button-inner').click();

    showModal("", [
		{
		  label: "Save",
		  onClick: (modal) => {
				var data = '{"Title":"'+productTitle.innerHTML+'", "COGS":"'+savePrice+'", "Images":'+images+', "description":"'+description+'", "Listing URL":"'+link+'", "asin":"'+asin+'", "cuid":"'+created_by+'"}';
				
				var settings = {
				  "url": "https://ybr.app/version-test/api/1.1/obj/products_uniques/bulk",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"Content-Type": "text/plain"
				  },
				  "data": data,
				  success:function(res){
					  console.log(description);
				  }
				};
			
				$.ajax(settings).done(function (response) {
					let list = $("#ybr option:selected").val();
					let res = JSON.parse(response)
					let selected = $("#ybr option:selected").attr("prod");
					let prod = selected.concat(',', res.id);
					let prodList = [];

					if(selected === 'undefined'){
					prodList.push(res.id)
					}
					else{ prodList = prod.split(',') }
					console.log(res.id);
					prodUqId = res.id;
					fetch("https://ybr.app/version-test/api/1.1/obj/productlist/"+list+"", {
					method: "PATCH",
					body: JSON.stringify({
						Products: prodList
					}),
					headers: {
						"Content-type": "application/json; charset=UTF-8"
					}
					}).then((response) =>{
						alert('Successfully added to list');
						$('.modal__close').click();
						button_add.removeChild(addToYbrBtn);
						button_add.appendChild(deleteFromYbrBtn);
					}).catch((err) => {
						alert('Failed adding to list');
					});
					
				}).then((responseJson) => {
					alert('Successfully saved.');
				}).catch((err) =>{
					console.log(err);
					alert('Something went wrong');
				});
		  },
		  
		  triggerClose: false
		}
	  ]);
		
		console.log(created_by);
		var dynamic_url = 'https://ybr.app/version-test/api/1.1/obj/productlist?constraints=[{"key":"created by","constraint_type":"equals","value":"'+created_by+'"}]';
		getJSON(dynamic_url,
		function(err, data) {
		if (err !== null) {
			alert('Something went wrong: ' + err);
		} else {
			let res = data.response.results;
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
//delete from ybr
var deleteFromYbrBtn = document.createElement("button");
deleteFromYbrBtn.id = "deleteFloatingBtn";
deleteFromYbrBtn.innerHTML = "Delete Product";

var getProduct = 'https://ybr.app/version-test/api/1.1/obj/products_uniques?constraints=[{"key":"asin","constraint_type":"equals","value":"'+asin+'"}, {"key":"cuid","constraint_type":"equals","value":"'+created_by+'"}]';
getJSON(getProduct,
    function(err, data) {
		if (err !== null) {
			alert('Something went wrong: ' + err);
		} else {
			let res = data.response.results;
			for(var i = 0; i < res.length; i++){
				prodAsin = res[i]["asin"];
				prodUqId = res[i]["_id"];
			}
			
			if ( prodAsin === asin ) {
				button_add.appendChild(deleteFromYbrBtn)
			} else {
				button_add.appendChild(addToYbrBtn)
			}
		}
    }
);

deleteFromYbrBtn.addEventListener('click', function() {
	console.log(prodUqId);

	const deleteMethod = {
		method: 'DELETE',
		headers: {
		 'Content-type': 'application/json; charset=UTF-8'
		},
	}

	fetch("https://ybr.app/version-test/api/1.1/obj/products_uniques/"+prodUqId+"", deleteMethod)
	.then(data => console.log(data))
	.catch(err => console.log(err))
	
	button_add.removeChild(deleteFromYbrBtn);
	alert("Successfully removed from list")
	button_add.appendChild(addToYbrBtn);

}, false);



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


//Show Modal
function showModal2(contentHtml, buttons) {
	const modal = document.createElement("div");
  
	modal.classList.add("modal");
	modal.innerHTML = `
		  <div class="modal__inner">
			  <div class="modal__top">
				  <div class="modal__title">Upload Bulk Product</div>
				  <button class="modal__close" type="button">
					  <span class="material-icons">X</span>
				  </button>
			  </div>
			  <div class="modal__content">
			  <select name="ybr2" id="ybr2" style="width: 230px;">
			  $('#ybr2').append("<option value='ybr2'>Choose a List</option>");
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



//upload product floating btn
var uploadFloatingBtn = document.createElement( 'button' );

document.body.appendChild( uploadFloatingBtn );

uploadFloatingBtn.id = 'uploadFloatingBtn';
uploadFloatingBtn.innerHTML = "Upload "+uniqueUrl.length+" Products";

uploadFloatingBtn.addEventListener('click', function() {

	$('.imageThumbnail .a-button-inner').click();

    showModal2("", [
		{
		  label: "Upload",
		  onClick: (modal2) => {
			  var imgg = $.map($('.imgTagWrapper img'), function(el){
				return $(el).data();
			});
			var listImages = [];
			for(var i = 0; i < imgg.length; i++){
				listImages.push(imgg[i].oldHires)
			}
			var images = JSON.stringify(listImages)
			  	var link = window.location.href;
			  	// var img = $('#imgTagWrapperId:first').children('img');
				// var imgList = [];
				// imgList.push(img[0].src);
				// var imgres = JSON.stringify(imgList);

				var lot = $("#ybr2 option:selected").val();
				var description = $('#feature-bullets').children('ul').children('li').eq(1).children('span').text();
				if($('#feature-bullets').children('ul').children('li').attr('id') === 'replacementPartsFitmentBullet'){
					description = $('#feature-bullets').children('ul').children('li').eq(1).children('span').text();
				}else{
					description = $('#feature-bullets').children('ul').children('li').children('span').first().text();
				}
				var data = '{"Title":"'+productTitle.innerHTML+'", "COGS":"'+price.innerHTML.replace('$','')+'", "Images":'+images+', "description":"'+description+'", "Listing URL":"'+link+'"}';
				
				var settings = {
				  "url": "https://ybr.app/version-test/api/1.1/obj/products_uniques/bulk",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"Content-Type": "text/plain"
				  },
				  "data": data,
				  success:function(res){
					  console.log(description);
				  }
				};
			
				$.ajax(settings).done(function (response) {
					let list = $("#ybr2 option:selected").val();
					let res = JSON.parse(response)
					let selected = $("#ybr2 option:selected").attr("prod");
					let prod = selected.concat(',', res.id);
					let prodList = [];

					if(selected === 'undefined'){
					prodList.push(res.id)
					}
					else{ prodList = prod.split(',') }
					console.log(res.id);
					fetch("https://ybr.app/version-test/api/1.1/obj/productlist/"+list+"", {
					method: "PATCH",
					body: JSON.stringify({
						Products: prodList
					}),
					headers: {
						"Content-type": "application/json; charset=UTF-8"
					}
					}).then((response) =>{
						alert('Successfully added to list');
						$('.modal__close').click();
					}).catch((err) => {
						alert('Failed adding to list');
					});
					
				}).then((responseJson) => {
					alert('Successfully saved.');
				}).catch((err) =>{
					console.log(err);
					alert('Something went wrong');
				});
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
			for(var i = 0; i < res.length; i++){
				var option = document.createElement("option");
				option.text = res[i]["List Name"];
				option.value = res[i]["_id"];
				option.setAttribute("prod", res[i]["Products"]);
				document.getElementById('ybr2').appendChild(option);
			}
		}
		});
	
	/*var settings = {
	   "url": "https://mvptestjrb.bubbleapps.io/version-test/api/1.1/obj/YBR/bulk",
	   "method": "POST",
	   "timeout": 0,
	   "headers": {
	 	"content-type": "text/plain"
	   },
	   "data": '{"title":"'+productTitle.innerHTML+'","price":"'+price.innerHTML+'"}',
	 };

	 $.ajax(settings).done(function (response) {
	 	alert();
	   console.log("responsejrb"+response);
	 });*/
	});

/*function UploadBulk(){
	
	$('body').on('click', '#uploadFloatingBtn', function(e){
        e.preventDefault();

        $.ajax({
            url: 'https://ybr.app/version-test/api/1.1/obj/products_uniques',
            type: 'POST',
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                return myXhr;
            },
            success: function (data) {
                alert("Data Uploaded!");
				var description = $('#feature-bullets').children('ul').children('li').children('span').first().text();
				var data = '{"Title":"'+productTitle.innerHTML+'"}';
				var settings = {
				  "url": "https://ybr.app/version-test/api/1.1/obj/products_uniques/bulk",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"Content-Type": "text/plain"
				  },
				  "data": data,
				  success:function(){
					  console.log(description);
				  },
				  error:function(err){
					  alert(img.attr('src'));
					  alert(err);
				  }
				};
			
				$.ajax(settings).done(function (response) {

					fetch("https://ybr.app/version-test/api/1.1/obj/productlist/"+list+"", {
					method: "PATCH",
					body: JSON.stringify({
						Products: prod.split(',')
					}),
					headers: {
						"Content-type": "application/json; charset=UTF-8"
					}
					}).then((response) =>{
						alert('Successfully added to list');
					}).catch((err) => {
						alert('Failed adding to list');
					});
					
				}).then((responseJson) => {
					// $('.modal').hide();
					alert('Successfully saved.');
				}).catch((err) =>{
					console.log("errrr" + JSON.stringify(err));
				});
            }
        });
        return false;
})
}
*/

// uploadFloatingBtn.addEventListener('click', function() {
// 	UploadBulk();
// }, false);




//export product floating btn
var exportFloatingBtn = document.createElement( 'button' );

document.body.appendChild( exportFloatingBtn );

exportFloatingBtn.id = 'exportFloatingBtn';
exportFloatingBtn.innerHTML = "Export "+uniqueUrl.length+" Products";

function exportToExcel(){
	var htmls = "";
	var uri = 'data:application/vnd.ms-excel;base64,';
	var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'; 
	var base64 = function(s) {
		return window.btoa(unescape(encodeURIComponent(s)))
	};

	var format = function(s, c) {
		return s.replace(/{(\w+)}/g, function(m, p) {
			return c[p];
		})
	};

	htmls = '<table><thead><th>Links</th></thead><tbody>';
	for (var i=0; i<uniqueUrl.length; i++) {
		htmls += '<tr><td>'+uniqueUrl[i][0]+'</td></tr>';
	};

	var ctx = {
		worksheet : 'Worksheet',
		table : htmls
	}


	var link = document.createElement("a");
	link.download = "export.xls";
	link.href = uri + base64(format(template, ctx));
	link.click();
}

exportFloatingBtn.addEventListener('click', function() {
	exportToExcel();
}, false);