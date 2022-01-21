'use strict';

window.onload = load_iframe();

function load_iframe()
{
    var iframe = document.createElement('iframe');
    iframe.id = "ybr-iframe";
    iframe.src = "https://ybr.app/version-test/ce_login";
    iframe.frameBorder= 0; 
    iframe.scrolling= "no";
    iframe.style.cssText = 'width:300px;height:600px;';
    document.body.appendChild(iframe);
}