function initializeJs() {
  $('.tabs-scroll').scroll(function() {
    $('.left-fixed-tab').scrollTop($('.tabs-scroll').scrollTop());
  });


  $('body').click(function() {
    $('.analytics_container .present-dropdown').fadeOut(0);
  });
  $('.analytics_container .present-calendar-date').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
  $('.analytics_container .present-calendar-date p').click(function() {
    $(this).parent('.present-calendar-date').children('.present-dropdown').slideDown(0);
  });
  $('.analytics_container .present-calendar-date .present-dropdown li').click(function() {
    const present = $(this).html();
    $(this).parent('.present-dropdown').parent('.present-calendar-date').children('p').html(present);
    $(this).parent('.present-dropdown').slideUp(0);
  });
  $('input[type=text], input[type=password], input[type=tel], input[type=email], textarea').each(function() {
    const default_placeholder = this.placeholder;
    $(this).focus(function() {
      if (this.placeholder === default_placeholder) {
        this.placeholder = '';
      }
    });
    $(this).blur(function() {
      if (this.placeholder === '') {
        this.placeholder = default_placeholder;
      }
    });
  });

  $('.collapse').collapse();

  $('.arrow_collapse').click(function(e) {
    // e.preventDefault();
    // e.stopPropagation();
    $('.arrow_collapse.sidebar_list_collapse').fadeOut(0);
    $('.arrow_collapse.sidebar_list_collapse-out').fadeIn(0);

    $(this).parent('ul').addClass('sidebar_collapse').animate({

    }, 200);

    $('.content-wrapper, .no-scroll, .no-scroll2').addClass('content-collapse').animate({

    }, 200);
  });

  $('.arrow_collapse.sidebar_list_collapse-out').click(function(e) {
    // e.preventDefault();
    // e.stopPropagation();
    $('.arrow_collapse.sidebar_list_collapse-out').fadeOut(0);
    $('.arrow_collapse.sidebar_list_collapse').fadeIn(0);

    $(this).parent('ul').removeClass('sidebar_collapse').animate({

    }, 200);

    $('.content-wrapper, .no-scroll, .no-scroll2').removeClass('content-collapse').animate({

    }, 200);
  });

  $('body').click(function(e) {
    if ($(window).width() < 961) {
      if (e.target.className !=='sidebar-notification') {
        $('.sidebar').slideUp(200);
      }
    }
  });
  $('.sidebar .mob-menu-closer').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('.sidebar').slideUp(200);
  });

  // $('.sidebar').click(function (e) {
  //     e.stopPropagation();
  // });
  $('.setting_mob .setting').click(function() {
    $('.modal_user_setting').modal('show');
  });

  // $('.holiday-list .delete-tab').click(function () {
  //     $(this).parents('.holiday-list').toggleClass('hide', 300);
  // });
  $('.templates-list .delete-tab').click(function() {
    $(this).parents('.templates-list').toggleClass('hide', 300);
  });
  $('.sms-table td.delete .delete-tab').click(function() {
    $(this).parents('tr').toggleClass('hide', 300);
  });

  // $('.delete-tab').click(function () {
  //     $(this).parents('.services_items').toggleClass('hide', 300);
  // });


  const $dropzone = $('.image_picker');
  const $droptarget = $('.drop_target');
  const $dropinput = $('.inputFile');
  const $dropimg = $('.image_preview');

  $dropzone.on('dragover', function() {
    $droptarget.addClass('dropping');
    return false;
  });

  $dropzone.on('dragend dragleave', function() {
    $droptarget.removeClass('dropping');
    return false;
  });

  $dropzone.on('drop', function(e) {
    $droptarget.removeClass('dropping');
    $droptarget.addClass('dropped');
    e.preventDefault();

    const file = e.originalEvent.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      $dropimg.css('background-image', 'url(' + event.target.result + ')');
    };

    reader.readAsDataURL(file);

    return false;
  });

  $dropinput.change(function(e) {
    $droptarget.addClass('dropped');
    $('.image_title input').val('');

    const file = $dropinput.get(0).files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      $dropimg.css('background-image', 'url(' + event.target.result + ')');
    };

    reader.readAsDataURL(file);
  });

  $('.new-holiday').click(function() {
    $('.addHoliday-wrapper').fadeIn(300);
  });


  $('.close-holiday, .close-modal-add-holiday-js').click(function() {
    $('.addHoliday-wrapper').fadeOut(300);
  });

  $('.new-templates.new-email-templates').click(function() {
    $('.add-templates.email-templates').fadeIn(300);
  });
  $('.new-templates-button').click(function() {
    $('.add-templates-new').fadeIn(300);
  });
  $('.new-templates-sms').click(function() {
    $('.add-templates.sms-templates').fadeIn(300);
  });

  $('#download-client').click(function() {
    $('.download-buttons').toggleClass('active');
  });

  $('.table-style button.delete-tab').click(function() {
    $(this).parents('tr').addClass('hide', 300);
  });

  // $('.tab-content-list .delete-tab').click(function () {
  //     $(this).parents('.tab-content-list').addClass('hide', 300);
  // });

  $('.select-color .dropdown-menu li a').click(function() {
    const selText = $(this).html();
    $(this).parents('.select-color').find('.dropdown-toggle').html(selText);
  });

  $('.datepicker-buttons-inline').datepicker({
    inline: true,
  });

  $('.datepicker-here').datepicker();
  setTimeout(function() {
    const d = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'long' };
    $('.datepicker-here').val(d.toLocaleDateString('ru-RU', options));
    $('.datepicker-buttons-inline').val(d.toLocaleDateString('ru-RU', options));
  }, 0);

  // $('.notes-container').resizer();
  $('.tabs-scroll .tab-content-list .col-tab').mousedown(function() {
    $('div').removeClass('pressedTime');
    $(this).addClass('pressedTime');
    $('.col-tab').on('mouseenter', function() {
      $(this).addClass('pressedTime');
    });
  }).mouseup(function() {
    $('div').off('mouseenter');
    if ($('.pressedTime').length > 1) {
      $('.modal_calendar').modal('show');
    } else {
      $('.new_appointment').modal('show');
    }
    $('div').removeClass('pressedTime');
  });
  $('.select_add_new_hours').change(function() {
    const selnum = $('option:selected', this).val();
    const selectadd = $(this).parent('div').parent('.selects-block').children('.add-block').html();
    $(this).parent('div').parent('.selects-block').children('.add-block + .add-block').remove();
    let newselectadd = '';
    for (let i = 1; i < selnum; i++) {
      newselectadd += '<div class="add-block">' + selectadd + '</div>';
    }
    $(this).parent('div').parent('.selects-block').children('.add-block').after(newselectadd);
  });
  $('.new_appointment .select-color .dropdown-menu a').click(function() {
    $('.new_appointment .hide').fadeIn(100);
  });

  $('.new_appointment .list-block-right .add-person').click(function() {
    $(this).parents('.list-block-right').fadeOut(0);
    $('.client-info').fadeIn(100);
  });

  $('.client-info .closer').click(function() {
    $(this).parent('.client-info').fadeOut(0);
    $('.new_appointment .list-block-right').fadeIn(100);
  });
  $('[data-attr="show-password"]').password({
    placement: 'before',
    eyeClass: 'material-icons',
    eyeOpenClass: 'visibility',
    eyeCloseClass: 'visibility_off',
    eyeClassPositionInside: true,
  });

  $('.chose_button .button-color').click(function() {
    $('.chose_button .button-color').removeClass('active');
    $(this).addClass('active');

    const cbutton = $('span', this).css('background-color');
    $('.buttons-container-color-form button').css({ 'background-color': cbutton, 'border-color': cbutton });
  });

  $('.form-button .buttons button').click(function() {
    $('.form-button .buttons button').removeClass('active');
    $(this).addClass('active');

    const fbutton = $(this).attr('class');
    $('.buttons-container-color-form button').removeClass();
    $('.buttons-container-color-form button').addClass(fbutton);
  });

  // добавлен скрипт
  $('.sign_in_open').click(function() {
    $('.sign_up').fadeOut(0);
    $('.sign_in').fadeIn(200);
  });
  $('.sign_up_open').click(function() {
    $('.sign_in').fadeOut(0);
    $('.sign_up').fadeIn(200);
  });
  // конец добавленого скрипта
  $('.a-client-info').click(function(e) {
    e.preventDefault();

    e.stopPropagation();
  });
};
$(function() {
  const d = [[1196463600000, 0], [1196550000000, 0], [1196636400000, 0], [1196722800000, 77], [1196809200000, 3636], [1196895600000, 3575], [1196982000000, 2736], [1197068400000, 1086], [1197154800000, 676], [1197241200000, 1205], [1197327600000, 906], [1197414000000, 710], [1197500400000, 639], [1197586800000, 540], [1197673200000, 435], [1197759600000, 301], [1197846000000, 575], [1197932400000, 481], [1198018800000, 591], [1198105200000, 608], [1198191600000, 459], [1198278000000, 234], [1198364400000, 1352], [1198450800000, 686], [1198537200000, 279], [1198623600000, 449], [1198710000000, 468], [1198796400000, 392], [1198882800000, 282], [1198969200000, 208], [1199055600000, 229], [1199142000000, 177], [1199228400000, 374], [1199314800000, 436], [1199401200000, 404], [1199487600000, 253], [1199574000000, 218], [1199660400000, 476], [1199746800000, 462], [1199833200000, 448], [1199919600000, 442], [1200006000000, 403], [1200092400000, 204], [1200178800000, 194], [1200265200000, 327], [1200351600000, 374], [1200438000000, 507], [1200524400000, 546], [1200610800000, 482], [1200697200000, 283], [1200783600000, 221], [1200870000000, 483], [1200956400000, 523], [1201042800000, 528], [1201129200000, 483], [1201215600000, 452], [1201302000000, 270], [1201388400000, 222], [1201474800000, 439], [1201561200000, 559], [1201647600000, 521], [1201734000000, 477], [1201820400000, 442], [1201906800000, 252], [1201993200000, 236], [1202079600000, 525], [1202166000000, 477], [1202252400000, 386], [1202338800000, 409], [1202425200000, 408], [1202511600000, 237], [1202598000000, 193], [1202684400000, 357], [1202770800000, 414], [1202857200000, 393], [1202943600000, 353], [1203030000000, 364], [1203116400000, 215], [1203202800000, 214], [1203289200000, 356], [1203375600000, 399], [1203462000000, 334], [1203548400000, 348], [1203634800000, 243], [1203721200000, 126], [1203807600000, 157], [1203894000000, 288]];
  for (let i = 0; i < d.length; ++i) {
    d[i][0] += 60 * 60 * 1000;
  }
  function days(axes) {
    const markings = [];
    const d = new Date(axes.xaxis.min);

    // go to the first Saturday

    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
    d.setUTCSeconds(0);
    d.setUTCMinutes(0);
    d.setUTCHours(0);

    let i = d.getTime();
    do {
      markings.push({ xaxis: { from: i, to: i + 1 * 24 * 60 * 60 * 1000 } });
      i += 1 * 24 * 60 * 60 * 1000;
    } while (i < axes.xaxis.max);

    return markings;
  }

  const options = {

    xaxis: {
      mode: 'time',
      tickLength: 0,
      ticks: 7,
      timeformat: '%d %b',

    },
    grid: {
      markings: days,
      borderWidth: 0,
      hoverable: true,
      labelMargin: 20,
      clickable: true,
    },
    yaxis: {
      mode: null,
      min: 0,
      ticks: 4,
      max: 40,
    },
    series: {
      lines: { show: true, color: 'rgba(0, 191, 165, 1)' },
      points: { show: true, color: 'rgba(0, 191, 165, 1)' },
    },

  };

  if (typeof $.plot === 'function') {
    var plot = $.plot('#container-chart', [d], options);
    var plot = $.plot('#container-chart2', [d], options);
  }
});
// jQuery.fn.resizer = function () {
//     // выполняем плагин для каждого объекта
//     return this.each(function () {
//         // определяем объект
//         var me = jQuery(this);
//         // вставляем в после объекта...
//         me.after(
//                 // в нашем случае это наш "ресайзер" и производим обработку события mousedown
//                 jQuery('<span class="resizehandle"></span>').bind('mousedown', function (e) {
//             // определяем высоту textarea
//             var h = me.height();
//             // определяем кординаты указателя мыши по высоте
//             var y = e.clientY;
//             // фнкция преобразовывает размеры textarea
//             var moveHandler = function (e) {
//                 me.height(Math.max(20, e.clientY + h - y));
//             };
//             // функци прекращает обработку событий
//             var upHandler = function (e) {
//                 jQuery('html').unbind('mousemove', moveHandler).unbind('mouseup', upHandler);
//             };
//             // своего рода, инициализация, выше приведённых, функций
//             jQuery('html').bind('mousemove', moveHandler).bind('mouseup', upHandler);
//         })
//                 );
//     });
// };
function clock() {
  const d = new Date();
  const month_num = d.getMonth();
  let day = d.getDate();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();

  month = new Array('января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря');

  if (day <= 9) {
    day = '0' + day;
  }
  if (hours <= 9) {
    hours = '0' + hours;
  }
  if (minutes <= 9) {
    minutes = '0' + minutes;
  }
  if (seconds <= 9) {
    seconds = '0' + seconds;
  }

  date_time = hours + ':' + minutes;
  if (document.layers) {
    document.layers.doc_time.document.write(date_time);
    document.layers.doc_time.document.close();
  } else
  // document.getElementById("doc_time").innerHTML = date_time;
  {
    setTimeout('clock()', 1000);
  }
}
clock();

const url = document.location.toString();
if (url.match('#')) {
  $('.nav-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
}

$('.nav-tabs a').on('.tab', function(e) {
  window.location.hash = e.target.hash;
});
$(document).ready(function() {
  if ($('.editor') && typeof $('.editor').cleditor === 'function') {
    $('.editor').cleditor({
      width: 500, // width not including margins, borders or padding
      height: 250, // height not including margins, borders or padding
      controls: // controls to add to the toolbar
                'bold italic underline strikethrough subscript superscript | font size ' +
                'style | color highlight removeformat | bullets numbering | outdent ' +
                'indent | alignleft center alignright justify | undo redo | ' +
                'rule image link unlink | cut copy paste pastetext | print source',
      colors: // colors in the color popup
                'FFF FCC FC9 FF9 FFC 9F9 9FF CFF CCF FCF ' +
                'CCC F66 F96 FF6 FF3 6F9 3FF 6FF 99F F9F ' +
                'BBB F00 F90 FC6 FF0 3F3 6CC 3CF 66C C6C ' +
                '999 C00 F60 FC3 FC0 3C0 0CC 36F 63F C3C ' +
                '666 900 C60 C93 990 090 399 33F 60C 939 ' +
                '333 600 930 963 660 060 366 009 339 636 ' +
                '000 300 630 633 330 030 033 006 309 303',
      fonts: // font names in the font popup
                'Arial,Arial Black,Comic Sans MS,Courier New,Narrow,Garamond,' +
                'Georgia,Impact,Sans Serif,Serif,Tahoma,Trebuchet MS,Verdana',
      sizes: // sizes in the font size popup
                '1,2,3,4,5,6,7',
      styles: // styles in the style popup
                [['Paragraph', '<p>'], ['Header 1', '<h1>'], ['Header 2', '<h2>'],
                  ['Header 3', '<h3>'], ['Header 4', '<h4>'], ['Header 5', '<h5>'],
                  ['Header 6', '<h6>']],
      useCSS: false, // use CSS to style HTML when possible (not supported in ie)
      docType: // Document type contained within the editor
                '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
      docCSSFile: // CSS file used to style the document contained within the editor
                '',
      bodyStyle: // style to assign to document body contained within the editor
                'margin:4px; font:10pt Arial,Verdana; cursor:text',
    });
  }
});


