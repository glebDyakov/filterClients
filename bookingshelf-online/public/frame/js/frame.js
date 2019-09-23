if (document.getElementById('bb'))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    var link2  = document.createElement('link');
    var buttonName=document.getElementById('bb').getAttribute('class').split(' ')[0];
    var my_elem = document.getElementById('bb');
    var iframe  = document.createElement('iframe');
    var span = document.createElement('span');
    var closer = document.createElement('span');
    var hostUrl = location.host.includes('staging') ? 'https://staging.online-zapis.com' : 'https://online-zapis.com';

    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = hostUrl+'/bb/'+buttonName+'.css';
    link.media = 'all';

    link2.rel  = 'stylesheet';
    link2.type = 'text/css';
    link2.href = hostUrl+'/bb/button.css';
    link2.media = 'all';

    head.appendChild(link2);
    head.appendChild(link);

    iframe.src = hostUrl+"/online/"+document.getElementById('bb').getAttribute('code');
    iframe.id = 'online-booking';
    iframe.style.visibility = 'hidden';

    span.className = 'popup-shadow';
    span.id = 'popup-shadow';
    span.addEventListener("click", function(){
        closeFrame();
    });

    closer.className = 'closer-modal';
    closer.id = 'closer-modal';
    closer.innerHTML = '&Cross;';
    closer.addEventListener("click", function(){
        closeFrame();
    });

    my_elem.parentNode.insertBefore(iframe, my_elem);
    my_elem.parentNode.insertBefore(span, my_elem);
    my_elem.parentNode.insertBefore(closer, my_elem);

    setTimeout(function () {
        document.getElementById('bb').style.visibility = 'visible';
    }, 1000)

}

function displayFrame() {
    document.getElementById("online-booking").style.visibility = 'visible';
    document.getElementById("online-booking").style.width = "100%";
    document.getElementById("popup-shadow").style.display = "block";
    document.getElementById("closer-modal").style.display = "block";
}

function closeFrame() {
    document.getElementById("online-booking").style.width = "0";
    document.getElementById("popup-shadow").style.display = "none";
    document.getElementById("closer-modal").style.display = "none";
}
