import 'ejs';

async function init() {
    const menuResponse = await fetch('/templates/menu.ejs');
    const menuTemplate = await menuResponse.text();
    document.getElementById('menu').innerHTML = menuTemplate;
}

init();
