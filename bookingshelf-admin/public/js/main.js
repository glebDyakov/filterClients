$(document).ready(function() {
  const top = 1;
  $(window).scroll(function() {
    const y = $(this).scrollTop();
    if (y >= top) {
      $('header').addClass('header_fixed');
    } else {
      $('header').removeClass('header_fixed');
    }
  });

  $('.bxslider').bxSlider({
    minSlides: '1',
    nextText: '',
    prevText: '',
    maxSlides: '3',
    slideWidth: '290',
    moveSlides: '1',
    //    auto: true,
    speed: 200,
    infiniteLoop: true,
  });
  $('.bxslider2').bxSlider({
    minSlides: '1',
    nextText: '',
    prevText: '',
    maxSlides: '3',
    slideWidth: '300',
    moveSlides: '1',
    slideMargin: 15,
    //    auto: true,
    speed: 200,
    infiniteLoop: true,
  });


  $('.burger').click(function() {
    $('header > div > div').fadeIn(300);
  });
  $('header > div > div .close').click(function(e) {
    $('header > div > div').fadeOut(300);
    e.stopPropagation();
  });

  $('.details_list').click(function() {
    $(this).parent('li').hasClass('active');
    $(this).parent('li').children('ul').slideDown(300);
    $(this).parent('li').addClass('active');
  });

  $('.reg').click(function() {
    $('.modal').fadeIn(300);
  });

  $('.log_in').click(function() {
    $('.modal').fadeIn(300);
    $('.tab_reg').fadeOut(0);
    $('.tab_sign_in').fadeIn(300);
    $('.tab_sign_in').addClass('active');
    $('.sign_in_modal').addClass('active');
    $('.registry').removeClass('active');
    $('.tab_reg').removeClass('active');
  });

  $('.modal .closer').click(function(e) {
    $('.modal').fadeOut(300);
    e.stopPropagation();
  });

  $('.modal .bg-modal').click(function(e) {
    $('.modal').fadeOut(300);
    e.stopPropagation();
  });

  $('.registry').click(function() {
    $('.tab_sign_in').fadeOut(0);
    $('.tab_reg').fadeIn(300);
    $('.tab_reg').addClass('active');
    $('.registry').addClass('active');
    $('.sign_in_modal').removeClass('active');
    $('.tab_sign_in').removeClass('active');
  });

  $('.sign_in_modal').click(function() {
    $('.tab_reg').fadeOut(0);
    $('.tab_sign_in').fadeIn(300);
    $('.tab_sign_in').addClass('active');
    $('.sign_in_modal').addClass('active');
    $('.registry').removeClass('active');
    $('.tab_reg').removeClass('active');
  });

  $('.popup_forgot').click(function(e) {
    $('.modal2').fadeIn(300);
    e.stopPropagation();
    $('.modal').fadeOut(0);
  });

  $('.modal2 .closer').click(function(e) {
    $('.modal2').fadeOut(0);
    e.stopPropagation();
  });

  $('.modal2 .bg-modal').click(function(e) {
    $('.modal2').fadeOut(0);
    e.stopPropagation();
  });

  const $page = $('html, body');
  $('a[href*="#"]').click(function() {
    $page.animate({
      scrollTop: $($.attr(this, 'href')).offset().top - 100, // �������� -100
    }, 1500);
    return false;
  });
});

let x; let i; let j; let l; let ll; let selElmnt; let a; let b; let c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName('custom-select');
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName('select')[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement('DIV');
  a.setAttribute('class', 'select-selected');
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement('DIV');
  b.setAttribute('class', 'select-items select-hide');
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
        create a new DIV that will act as an option item: */
    c = document.createElement('DIV');
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener('click', function(e) {
      /* When an item is clicked, update the original select box,
            and the selected item: */
      let y; let i; let k; let s; let h; let sl; let yl;
      s = this.parentNode.parentNode.getElementsByTagName('select')[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName('same-as-selected');
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute('class');
          }
          this.setAttribute('class', 'same-as-selected');
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener('click', function(e) {
    /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle('select-hide');
    this.classList.toggle('select-arrow-active');
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
    except the current select box: */
  let x; let y; let i; let xl; let yl; const arrNo = [];
  x = document.getElementsByClassName('select-items');
  y = document.getElementsByClassName('select-selected');
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove('select-arrow-active');
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add('select-hide');
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener('click', closeAllSelect);

