// =====================================
// Mode Toggle: Code (dark) / Villa (light)
// =====================================
(function() {
  var html = document.documentElement;
  var STORAGE_KEY = 'enabler_mode';

  function applyMode(mode) {
    html.setAttribute('data-mode', mode);
    var codeEl  = document.getElementById('modeLabelCode');
    var villaEl = document.getElementById('modeLabelVilla');
    if (!codeEl || !villaEl) return;
    if (mode === 'villa') {
      codeEl.style.opacity  = '0.4';
      villaEl.style.opacity = '1';
    } else {
      codeEl.style.opacity  = '1';
      villaEl.style.opacity = '0.4';
    }
    try { localStorage.setItem(STORAGE_KEY, mode); } catch(e) {}
  }

  // restore saved mode
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'villa' || saved === 'code') applyMode(saved);
    else applyMode('code');
  } catch(e) { applyMode('code'); }

  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('modeToggle');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var current = html.getAttribute('data-mode');
      applyMode(current === 'villa' ? 'code' : 'villa');
    });
    // init label opacity
    applyMode(html.getAttribute('data-mode') || 'code');
  });
})();

// =====================================
// Scroll Log (git log style)
// =====================================
(function() {
  var SECTIONS = [
    { id: 'about',      hash: '2c8b371', label: 'mission'    },
    { id: 'philosophy', hash: 'e5d1a89', label: 'philosophy' },
    { id: 'products',   hash: 'f1a0944', label: 'products'   },
    { id: 'join',       hash: '9b2d05c', label: 'join'       },
    { id: 'property',   hash: '4a7d0b5', label: 'property'   },
    { id: 'story',      hash: '91c3f82', label: 'story'      },
    { id: 'message',    hash: 'a3f92b1', label: 'message'    },
  ];

  var logEl, hideTimer, currentId;

  function buildLog() {
    logEl = document.getElementById('scrollLog');
    if (!logEl) return;

    // build items (reversed: message at top = HEAD)
    var items = SECTIONS.slice().reverse();
    var html = '';
    items.forEach(function(s, i) {
      html += '<div class="slog-item" id="slog-' + s.id + '">'
            + '<span class="slog-hash">' + s.hash + '</span>'
            + '<span class="slog-label">' + s.label + '</span>'
            + '<span class="slog-dot"></span>'
            + '</div>';
      if (i < items.length - 1) {
        html += '<div class="slog-line"></div>';
      }
    });
    logEl.innerHTML = html;
  }

  function getCurrentSection() {
    var scrollY = window.scrollY + window.innerHeight * 0.4;
    var best = null;
    SECTIONS.forEach(function(s) {
      var el = document.getElementById(s.id);
      if (!el) return;
      if (el.offsetTop <= scrollY) best = s.id;
    });
    return best;
  }

  function updateLog() {
    if (!logEl) return;
    var id = getCurrentSection();
    if (id === currentId) return;
    currentId = id;
    SECTIONS.forEach(function(s) {
      var item = document.getElementById('slog-' + s.id);
      if (!item) return;
      item.classList.toggle('current', s.id === id);
    });
  }

  function showLog() {
    if (!logEl) return;
    logEl.classList.add('visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function() {
      logEl.classList.remove('visible');
    }, 1800);
  }

  document.addEventListener('DOMContentLoaded', function() {
    buildLog();
    updateLog();
  });

  window.addEventListener('scroll', function() {
    updateLog();
    showLog();
  }, { passive: true });
})();

// =====================================
// Join flow: chatweb.ai connect → API key → generate command
// =====================================

// Step 1: when "open chatweb.ai" is clicked, reveal the API key input
document.addEventListener('DOMContentLoaded', function() {
  var openBtn = document.getElementById('chatweb-open-btn');
  if (!openBtn) return;
  openBtn.addEventListener('click', function() {
    setTimeout(function() {
      var p1 = document.getElementById('jPhase1');
      var p2 = document.getElementById('jPhase2');
      if (p1 && p2) {
        p1.classList.add('join-phase-hidden');
        p2.classList.remove('join-phase-hidden');
        var inp = document.getElementById('apiKeyInput');
        if (inp) inp.focus();
      }
    }, 400);
  });
});

// Step 2: validate API key and show generated command
function generateCommand() {
  var key = (document.getElementById('apiKeyInput').value || '').trim();
  var msg = document.getElementById('joinMsg');

  if (!key || key.length < 8) {
    msg.textContent = '// APIキーを入力してください（chatweb.ai → Settings → API Keys）';
    msg.className = 'join-note err';
    return;
  }
  msg.textContent = '';
  msg.className = 'join-note';

  // build personalized install command
  var cmd = 'CHATWEB_API_KEY=' + key + ' \\\n'
          + '  curl -fsSL https://enablerdao.com/install.sh | bash';

  document.getElementById('generatedCmd').textContent = cmd;

  var p2 = document.getElementById('jPhase2');
  var p3 = document.getElementById('jPhase3');
  if (p2 && p3) {
    p2.classList.add('join-phase-hidden');
    p3.classList.remove('join-phase-hidden');
  }
}

// also trigger on Enter key in API key input
document.addEventListener('DOMContentLoaded', function() {
  var inp = document.getElementById('apiKeyInput');
  if (!inp) return;
  inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') generateCommand();
  });
});

// Step 3: copy generated command
function copyGenCmd(btn) {
  var text = document.getElementById('generatedCmd').textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'copied!';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = 'copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// --- Products ---
var PRODUCT_COLORS = ['c-orange', 'c-cyan', 'c-green', 'c-purple'];

function renderProducts(projects) {
  var grid = document.getElementById('productGrid');
  if (!grid) return;

  var html = projects.map(function(p, i) {
    var color = PRODUCT_COLORS[i % PRODUCT_COLORS.length];
    var issuesUrl = 'https://github.com/' + p.repo + '/issues';
    var repoUrl   = 'https://github.com/' + p.repo;

    var serviceBtn = p.service_url
      ? '<a class="productCard-btn productCard-btn-primary" href="' + p.service_url + '" target="_blank">&gt; サービスを使う</a>'
      : '';

    return [
      '<div class="productCard ' + color + '">',
      '  <div class="productCard-head">',
      '    <span class="productCard-name">' + p.name + '</span>',
      '    <span class="productCard-lang">' + p.language + '</span>',
      '  </div>',
      '  <p class="productCard-desc">' + p.description + '</p>',
      '  <div class="productCard-stats">',
      '    <span>★ ' + p.stars + '</span>',
      '    <span>⑂ ' + p.forks + '</span>',
      '    <span>⚠ ' + p.issues + '</span>',
      '  </div>',
      '  <div class="productCard-reward">reward: ' + p.reward + '</div>',
      '  <div class="productCard-actions">',
      '    ' + serviceBtn,
      '    <a class="productCard-btn productCard-btn-secondary" href="' + repoUrl + '" target="_blank">&gt; コードを書く</a>',
      '    <a class="productCard-btn productCard-btn-secondary" href="' + issuesUrl + '" target="_blank">&gt; バグを見つける</a>',
      '  </div>',
      '</div>',
    ].join('\n');
  }).join('\n');

  grid.innerHTML = html;
}

function showProductLoading() {
  var grid = document.getElementById('productGrid');
  if (grid) grid.innerHTML = '<p class="productGrid-status">// loading projects...</p>';
}

function showProductError() {
  var grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="productGrid-status">'
    + '<p>// failed to load projects</p>'
    + '<button onclick="loadProducts()" class="productGrid-retry">&gt; retry</button>'
    + '</div>';
}

function loadProducts() {
  showProductLoading();
  fetch('/api/projects')
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(renderProducts)
    .catch(showProductError);
}

loadProducts();

// --- Availability Calendar ---
(function() {
  var MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var DOW = ['日','月','火','水','木','金','土'];

  function isBooked(dateStr, bookedRanges) {
    for (var i = 0; i < bookedRanges.length; i++) {
      if (dateStr >= bookedRanges[i].start && dateStr < bookedRanges[i].end) return true;
    }
    return false;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function renderMonth(year, month, bookedRanges) {
    var today = new Date();
    var todayStr = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = '<div class="avail-month">';
    html += '<div class="avail-month-name">' + year + '年 ' + MONTH_NAMES[month] + '</div>';
    html += '<div class="avail-grid">';

    // Day of week headers
    for (var d = 0; d < 7; d++) {
      html += '<div class="avail-dow">' + DOW[d] + '</div>';
    }

    // Empty cells before first day
    for (var e = 0; e < firstDay; e++) {
      html += '<div class="avail-day empty"></div>';
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = year + '-' + pad(month + 1) + '-' + pad(day);
      var cls = 'avail-day';
      var dateObj = new Date(year, month, day);

      if (dateStr === todayStr) cls += ' today';
      else if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())) cls += ' past';
      else if (isBooked(dateStr, bookedRanges)) cls += ' booked';

      html += '<div class="' + cls + '">' + day + '</div>';
    }

    html += '</div></div>';
    return html;
  }

  function renderCalendar(container, bookedRanges) {
    var now = new Date();
    var html = '<div class="avail-title">// 空き状況</div>';
    html += '<div class="avail-months">';

    // Show 3 months
    for (var i = 0; i < 3; i++) {
      var m = now.getMonth() + i;
      var y = now.getFullYear();
      if (m >= 12) { m -= 12; y++; }
      html += renderMonth(y, m, bookedRanges);
    }

    html += '</div>';
    html += '<div class="avail-legend">';
    html += '<span class="leg-avail">空き</span>';
    html += '<span class="leg-booked">予約済</span>';
    html += '</div>';

    container.innerHTML = html;
  }

  function loadAvailability() {
    fetch('/api/availability')
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) {
        data.forEach(function(prop) {
          var containers = document.querySelectorAll('#' + prop.property_id + ' .availability-cal');
          containers.forEach(function(el) {
            renderCalendar(el, prop.booked_ranges);
          });
        });
      })
      .catch(function() {
        // Silently fail — calendar is not critical
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAvailability);
  } else {
    loadAvailability();
  }
})();

$(function(){

	$("#op").delay(4500).fadeOut(100);

	$("#menuButton, #globalNav a").click( function(e){
    e.stopPropagation();
		$("#globalNav").fadeToggle(300);
		$("#menuButton").toggleClass("active");
		var expanded = $("#menuButton").hasClass("active");
		$("#menuButton").attr("aria-expanded", expanded);
	});

  $(document).on('click', function (e) {
    if (!$('#globalNav').is(e.target) && $('#globalNav').has(e.target).length === 0 && !$('#menuButton').is(e.target)) {
      $('#globalNav').fadeOut(300);
      $("#menuButton").removeClass("active").attr("aria-expanded", "false");
    }
  });

  // --- Typewriter ---
  var typewriterStarted = false;
  function typewriter(el, text, speed) {
    var i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // Start typewriter after opening animation
  setTimeout(function() {
    var el = document.getElementById('typewriter-main');
    if (el && !typewriterStarted) {
      typewriterStarted = true;
      typewriter(el, '極上を、おすそわけ。', 120);
    }
  }, 5600);

  // --- Terminal line-by-line reveal ---
  function revealTerminalLines(terminal) {
    var lines = terminal.querySelectorAll('.code-key, .code-string, .code-comment');
    lines.forEach(function(line, i) {
      line.style.opacity = '0';
      line.style.transform = 'translateY(8px)';
      line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      line.style.transitionDelay = (i * 80) + 'ms';
    });
    // Trigger after a tick
    setTimeout(function() {
      lines.forEach(function(line) {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      });
    }, 100);
  }

  $(window).scroll(function (){
		$(".anim").each(function(){
			var imgPos = $(this).offset().top;
			var scroll = $(window).scrollTop();
			var windowHeight = $(window).height();
      var scrollHeight = windowHeight/5;

			if (scroll > imgPos - windowHeight + scrollHeight){
        if (!$(this).hasClass("on")) {
          $(this).addClass("on");
          // Terminal line reveal
          if ($(this).hasClass("terminal")) {
            revealTerminalLines(this);
          }
        }
			} else {
				$(this).removeClass("on");
			}
		});

		$(".pageTop").each(function(){
			var imgPos = $(this).offset().top;
			var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      var scrollHeight = windowHeight/5;

			if (scroll > scrollHeight) {
				$(this).fadeIn(600);
			} else {
				$(this).fadeOut(600);
			}

			var mainHeight = $("main").innerHeight();
			var storyHeight = $("#story").innerHeight();
			var messageHeight = $("#message").innerHeight();

			if (imgPos >  mainHeight - storyHeight - messageHeight) {
				$(this).addClass("on");
			} else {
				$(this).removeClass("on");
			}

		});
	});

});