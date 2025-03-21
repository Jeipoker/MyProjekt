let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/wiki1.png') {
        myImage.setAttribute ('src','images/wiki2.png');
    } else {
        myImage.setAttribute ('src','images/wiki1.png');
    }
}