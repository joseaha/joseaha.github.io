
const checkMenu = document.querySelector('#check');

function handleCheckBoxChange() {
    if (checkMenu.checked) {
        const navItems = document.querySelectorAll('.nav_item');
        navItems.forEach((item) => {
            item.classList.add('animate__bounceInRight');
        });
    } else {
        const navItems = document.querySelectorAll('.nav_item');
        navItems.forEach((item) => {
            item.classList.remove('animate__bounceInRight');
        });
    }
}

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


var section_three = document.querySelector('#about_me');

function applyAnimationsSectionThree(entries, observer_section_three) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Obtén los elementos por su ID o cualquier otro método de selección
            const line_up_Skill = document.getElementById('line_up');
            const line_down_Skill = document.getElementById('line_down');
            // Agrega la clase deseada a los elementos
            line_up_Skill.classList.add('animate__fadeInLeft');
            line_down_Skill.classList.add('animate__fadeInRight');
        }
    });
}

// Crear el observer para observar la sección three
const observer_section_three = new IntersectionObserver(applyAnimationsSectionThree, { threshold: 0.25 });
// Observar la sección three
observer_section_three.observe(section_three);

let toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
        toTop.classList.add("active");
    } else {
        toTop.classList.remove("active");
    }
});

window.addEventListener('load', function () {
    console.log('La página ha terminado de cargarse!!');

    // Obtener la referencia a la sección "home" mediante su id.
    var homeSection = document.querySelector('header');

        homeSection.scrollIntoView();
});