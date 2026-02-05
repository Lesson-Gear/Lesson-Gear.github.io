if (!localStorage.getItem('bannerDismissed')) {
    document.getElementById('banner').style.display = 'block'; 
} else {
    document.getElementById('banner').style.display = 'none'; 
}

document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('banner').style.display = 'none'; 
    localStorage.setItem('bannerDismissed', 'true');
});
