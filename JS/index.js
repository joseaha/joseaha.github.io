
const checkMenu = document.querySelector('#check');

function handleCheckBoxChange() {
    if (checkMenu.checked) {
        const navItems = document.querySelectorAll('.nav_item');
        navItems.forEach((item) => {
            item.classList.add('animate__bounceInRight');
        });
    } else {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item) => {
            item.classList.remove('animate__bounceInRight');
        });
    }
}
``
function handleClickNavItem() {
    const checkNavbar = document.querySelector('#check');
    checkNavbar.checked = !checkNavbar.checked;
}

var anchoVentana = window.innerWidth;

window.onresize = function () {
    anchoVentana = window.innerWidth;
    console.log(anchoVentana);
    ajustarClasesContenedorFoto();
};

function ajustarClasesContenedorFoto() {
    const contenedor_foto = document.querySelector('#contenedor_foto_perfil');

    if (anchoVentana < 986) {
        contenedor_foto.classList.remove('align-self-end', 'justify-content-end', 'me-5', 'm-5');
        contenedor_foto.classList.add('align-self-center', 'justify-content-center', 'mb-5');
    }
    else if (anchoVentana > 986) {
        contenedor_foto.classList.remove('align-self-center', 'justify-content-center', 'mb-5');
        contenedor_foto.classList.add('align-self-end', 'justify-content-end', 'me-5');
    }
}

ajustarClasesContenedorFoto();

let slider = document.querySelector(".slider")
let currentSlide = 0;
let totalSlides = slider.querySelectorAll(".wrapper .left > div").length - 1;

slider.querySelector('.controls .up').addEventListener('click', function () {
    if (currentSlide == 0) {
        return;
    }
    currentSlide--;
    slider.querySelector(".wrapper .left div").style.marginTop = `${currentSlide * -70}vh`;
    slider.querySelector(".wrapper .right div").style.marginTop = `${(totalSlides - currentSlide) * -70}vh`;

})

slider.querySelector('.controls .down').addEventListener('click', function () {
    if (currentSlide == totalSlides) {
        return;
    }
    currentSlide++;
    slider.querySelector(".wrapper .left div").style.marginTop = `${currentSlide * -70}vh`;
    slider.querySelector(".wrapper .right div").style.marginTop = `${(totalSlides - currentSlide) * -70}vh`;
})


function showCarousel() {
    const contenedorCarousel = document.getElementById('contenedor_carousel_mobile');
    contenedorCarousel.style.display = 'block';
}

if (window.innerWidth < 820) {
    showCarousel();
}

window.addEventListener('resize', function () {
    if (window.innerWidth < 820) {
        showCarousel();
    } else {
        const contenedorCarousel = document.getElementById('contenedor_carousel_mobile');
        contenedorCarousel.style.display = 'none';
    }
});

