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

  // expose for splash
  window._enablerApplyMode = applyMode;

  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('modeToggle');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var current = html.getAttribute('data-mode');
      applyMode(current === 'villa' ? 'code' : 'villa');
    });
    // init label opacity
    applyMode(html.getAttribute('data-mode') || 'code');

    // ── Mode Splash (first visit) ──
    var SPLASH_KEY = 'enabler_splash_seen';
    var splashSeen = false;
    try { splashSeen = localStorage.getItem(SPLASH_KEY) === '1'; } catch(e) {}
    if (!splashSeen) {
      var splash = document.getElementById('modeSplash');
      if (splash) {
        splash.style.display = 'flex';
        function closeSplash(mode) {
          if (mode) applyMode(mode);
          splash.style.opacity = '0';
          splash.style.transition = 'opacity 0.3s ease';
          setTimeout(function() { splash.style.display = 'none'; }, 300);
          try { localStorage.setItem(SPLASH_KEY, '1'); } catch(e) {}
        }
        splash.querySelectorAll('.splash-btn').forEach(function(b) {
          b.addEventListener('click', function() {
            closeSplash(b.getAttribute('data-mode'));
          });
        });
        var skipBtn = document.getElementById('splashSkip');
        if (skipBtn) skipBtn.addEventListener('click', function() { closeSplash(null); });
      }
    }
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
    { id: 'numbers',    hash: 'd7b3e21', label: 'numbers'    },
    { id: 'explainer',  hash: 'c4e2f17', label: 'explainer'  },
    { id: 'join',       hash: '9b2d05c', label: 'join'       },
    { id: 'property',   hash: '4a7d0b5', label: 'property'   },
    { id: 'members',    hash: 'b8c1d3e', label: 'members'    },
    { id: 'story',      hash: '91c3f82', label: 'story'      },
    { id: 'message',    hash: 'a3f92b1', label: 'message'    },
    { id: 'availability-summary', hash: 'e4a1c09', label: 'availability' },
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

    // Show 6 months
    for (var i = 0; i < 6; i++) {
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

// =====================================
// Wallet Connect & Members Section
// =====================================
(function() {
  var MONTH_NAMES_M = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var DOW_M = ['日','月','火','水','木','金','土'];

  function padM(n) { return n < 10 ? '0' + n : '' + n; }

  function isBookedM(dateStr, bookedRanges) {
    for (var i = 0; i < bookedRanges.length; i++) {
      if (dateStr >= bookedRanges[i].start && dateStr < bookedRanges[i].end) return true;
    }
    return false;
  }

  // Build a lookup map from days array: { "YYYY-MM-DD": { vacant, price_type } }
  function buildDaysMap(days) {
    var map = {};
    if (!days) return map;
    for (var i = 0; i < days.length; i++) {
      map[days[i].date] = { vacant: days[i].vacant, price_type: days[i].price_type || 'standard' };
    }
    return map;
  }

  function renderMonthM(year, month, bookedRanges, daysMap) {
    var today = new Date();
    var todayStr = today.getFullYear() + '-' + padM(today.getMonth() + 1) + '-' + padM(today.getDate());
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = '<div class="avail-month members-month">';
    html += '<div class="avail-month-name">' + year + '年 ' + MONTH_NAMES_M[month] + '</div>';
    html += '<div class="avail-grid">';
    for (var d = 0; d < 7; d++) html += '<div class="avail-dow">' + DOW_M[d] + '</div>';
    for (var e = 0; e < firstDay; e++) html += '<div class="avail-day empty"></div>';
    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = year + '-' + padM(month + 1) + '-' + padM(day);
      var cls = 'avail-day';
      var dateObj = new Date(year, month, day);
      var dayInfo = daysMap ? daysMap[dateStr] : null;

      if (dateStr === todayStr) cls += ' today';
      else if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())) cls += ' past';
      else if (dayInfo) {
        if (!dayInfo.vacant) cls += ' booked';
        if (dayInfo.price_type === 'high') cls += ' day-high-season';
      } else if (isBookedM(dateStr, bookedRanges)) cls += ' booked';

      html += '<div class="' + cls + '">' + day + '</div>';
    }
    html += '</div></div>';
    return html;
  }

  // Store current member data for filtering
  var _memberData = [];
  var _memberToken = null;

  function renderMemberCard(prop) {
    var now = new Date();
    var daysMap = buildDaysMap(prop.days);
    var hasVacancy = false;
    // Check if any future day is vacant
    var todayStr = now.getFullYear() + '-' + padM(now.getMonth() + 1) + '-' + padM(now.getDate());
    if (prop.days && prop.days.length > 0) {
      for (var i = 0; i < prop.days.length; i++) {
        if (prop.days[i].date >= todayStr && prop.days[i].vacant) { hasVacancy = true; break; }
      }
    } else {
      // Fallback: check booked_ranges
      hasVacancy = true; // assume vacancy if no day data
    }

    var propType = prop.property_type || 'villa';
    var badgeClass = propType === 'club_house' ? 'badge-club-house' : 'badge-villa';
    var badgeLabel = propType === 'club_house' ? 'Club House' : 'Villa';

    var html = '<div class="member-card" data-type="' + propType + '" data-has-vacancy="' + hasVacancy + '" data-property-id="' + prop.property_id + '">';
    html += '<div class="member-card-header">';
    html += '<div>';
    html += '<div class="member-card-name">' + escapeHtml(prop.property_name) + '</div>';
    if (prop.location) html += '<div class="member-card-location">' + escapeHtml(prop.location) + '</div>';
    html += '</div>';
    html += '<span class="card-type-badge ' + badgeClass + '">' + badgeLabel + '</span>';
    html += '</div>';

    // Calendar (12 months)
    html += '<div class="avail-months">';
    for (var i = 0; i < 12; i++) {
      var m = now.getMonth() + i;
      var y = now.getFullYear();
      if (m >= 12) { m -= 12; y++; }
      html += renderMonthM(y, m, prop.booked_ranges, daysMap);
    }
    html += '</div>';

    html += '<div class="avail-legend">';
    html += '<span class="leg-avail">空き</span>';
    html += '<span class="leg-booked">予約済</span>';
    if (prop.days && prop.days.some(function(d) { return d.price_type === 'high'; })) {
      html += '<span class="leg-high">ハイシーズン</span>';
    }
    html += '</div>';

    // Action buttons
    html += '<div class="card-actions">';
    html += '<button class="btn-inquiry" data-prop-id="' + escapeHtml(prop.property_id) + '" data-prop-name="' + escapeHtml(prop.property_name) + '" data-house-group="' + escapeHtml(prop.house_group_id || '') + '">問い合わせ</button>';
    if (prop.house_group_id) {
      html += '<a class="btn-book" href="https://app.notahotel.com/dao/house-groups/' + encodeURIComponent(prop.house_group_id) + '/vacancy-calendar" target="_blank">予約する →</a>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function renderFilterBar() {
    var filterEl = document.getElementById('membersFilter');
    if (!filterEl) return;

    var now = new Date();
    var monthOptions = '<option value="all">全月</option>';
    for (var i = 0; i < 6; i++) {
      var m = now.getMonth() + i;
      var y = now.getFullYear();
      if (m >= 12) { m -= 12; y++; }
      monthOptions += '<option value="' + y + '-' + padM(m + 1) + '">' + y + '年 ' + MONTH_NAMES_M[m] + '</option>';
    }

    filterEl.innerHTML =
      '<label>月 <select id="filterMonth">' + monthOptions + '</select></label>' +
      '<label>タイプ <select id="filterType"><option value="all">全て</option><option value="villa">Villa</option><option value="club_house">Club House</option></select></label>' +
      '<label><input type="checkbox" id="filterVacantOnly"> 空きのみ</label>';

    filterEl.style.display = '';

    document.getElementById('filterMonth').addEventListener('change', filterMemberCards);
    document.getElementById('filterType').addEventListener('change', filterMemberCards);
    document.getElementById('filterVacantOnly').addEventListener('change', filterMemberCards);
  }

  function filterMemberCards() {
    var monthVal = document.getElementById('filterMonth').value;
    var typeVal = document.getElementById('filterType').value;
    var vacantOnly = document.getElementById('filterVacantOnly').checked;

    var cards = document.querySelectorAll('#membersGrid .member-card');
    cards.forEach(function(card) {
      var show = true;

      // Type filter
      if (typeVal !== 'all' && card.getAttribute('data-type') !== typeVal) {
        show = false;
      }

      // Vacancy filter
      if (vacantOnly && card.getAttribute('data-has-vacancy') !== 'true') {
        show = false;
      }

      // Month filter - check if the property has vacancy in the specified month
      if (show && monthVal !== 'all') {
        var propId = card.getAttribute('data-property-id');
        var prop = _memberData.find(function(p) { return p.property_id === propId; });
        if (prop && prop.days && prop.days.length > 0) {
          var hasVacantInMonth = prop.days.some(function(d) {
            return d.date.startsWith(monthVal) && d.vacant;
          });
          if (!hasVacantInMonth) show = false;
        }
      }

      card.style.display = show ? '' : 'none';
    });
  }

  function showInquiryModal(propId, propName, houseGroupId) {
    var modal = document.getElementById('inquiryModal');
    if (!modal) return;
    document.getElementById('inquiryPropName').textContent = propName;
    document.getElementById('inquiryPropId').value = propId;
    document.getElementById('inquiryHouseGroupId').value = houseGroupId || '';
    document.getElementById('inquiryCheckIn').value = '';
    document.getElementById('inquiryCheckOut').value = '';
    document.getElementById('inquiryGuests').value = '2';
    document.getElementById('inquiryMessage').value = '';
    document.getElementById('inquiryStatus').textContent = '';
    document.getElementById('inquiryStatus').className = 'inquiry-status';
    modal.style.display = '';
  }

  function hideInquiryModal() {
    var modal = document.getElementById('inquiryModal');
    if (modal) modal.style.display = 'none';
  }

  // Bind modal events
  document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.querySelector('.inquiry-modal-overlay');
    var closeBtn = document.querySelector('.inquiry-modal-close');
    if (overlay) overlay.addEventListener('click', hideInquiryModal);
    if (closeBtn) closeBtn.addEventListener('click', hideInquiryModal);

    var form = document.getElementById('inquiryForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var token = _memberToken || sessionStorage.getItem('ebr_token');
        if (!token) {
          var st = document.getElementById('inquiryStatus');
          st.textContent = '// ウォレット認証が必要です';
          st.className = 'inquiry-status err';
          return;
        }

        var propId = document.getElementById('inquiryPropId').value;
        var propName = document.getElementById('inquiryPropName').textContent;
        var checkIn = document.getElementById('inquiryCheckIn').value;
        var checkOut = document.getElementById('inquiryCheckOut').value;
        var guests = parseInt(document.getElementById('inquiryGuests').value) || 2;
        var message = document.getElementById('inquiryMessage').value;

        var st = document.getElementById('inquiryStatus');
        var btn = form.querySelector('.inquiry-submit');
        btn.disabled = true;
        st.textContent = '// 送信中...';
        st.className = 'inquiry-status';

        fetch('/api/members/inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            property_id: propId,
            property_name: propName,
            check_in: checkIn,
            check_out: checkOut,
            guests: guests,
            message: message
          })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          btn.disabled = false;
          if (data.ok) {
            st.textContent = '// 送信完了しました。担当者より連絡いたします。';
            st.className = 'inquiry-status ok';
          } else {
            st.textContent = '// エラー: ' + (data.error || '送信に失敗しました');
            st.className = 'inquiry-status err';
          }
        })
        .catch(function() {
          btn.disabled = false;
          st.textContent = '// ネットワークエラーが発生しました';
          st.className = 'inquiry-status err';
        });
      });
    }

    // Delegate click for inquiry buttons
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.btn-inquiry');
      if (btn) {
        showInquiryModal(
          btn.getAttribute('data-prop-id'),
          btn.getAttribute('data-prop-name'),
          btn.getAttribute('data-house-group')
        );
      }
    });
  });

  function showMembersSection(token, walletAddr) {
    var section = document.getElementById('members');
    var nav = document.getElementById('navMembers');
    var addrEl = document.getElementById('membersWalletAddr');
    var enablerGrid = document.getElementById('membersEnablerGrid');
    var nahGrid = document.getElementById('membersGrid');
    if (!section || !nahGrid) return;

    _memberToken = token;

    if (walletAddr) {
      addrEl.textContent = walletAddr.slice(0, 4) + '...' + walletAddr.slice(-4);
    } else {
      addrEl.textContent = 'guest';
    }
    if (enablerGrid) enablerGrid.innerHTML = '<p class="members-loading">// loading enabler properties...</p>';
    nahGrid.innerHTML = '<p class="members-loading">// loading NOT A HOTEL availability...</p>';
    section.style.display = '';
    if (nav) nav.style.display = '';

    // Fetch Enabler properties (public)
    fetch('/api/availability')
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      if (enablerGrid) {
        enablerGrid.innerHTML = '';
        data.forEach(function(prop) {
          enablerGrid.innerHTML += renderMemberCard(prop);
        });
      }
    })
    .catch(function() {
      if (enablerGrid) enablerGrid.innerHTML = '<p class="members-loading">// failed to load enabler properties</p>';
    });

    // Fetch NOT A HOTEL properties (authenticated)
    var fetchOpts = token ? { headers: { 'Authorization': 'Bearer ' + token } } : {};
    fetch('/api/members/availability', fetchOpts)
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      _memberData = data;
      nahGrid.innerHTML = '';
      data.forEach(function(prop) {
        nahGrid.innerHTML += renderMemberCard(prop);
      });
      renderFilterBar();
    })
    .catch(function() {
      nahGrid.innerHTML = '<p class="members-loading">// failed to load NOT A HOTEL availability</p>';
    });
  }

  function showMembersSectionPublic() {
    var section = document.getElementById('members');
    var nav = document.getElementById('navMembers');
    var addrEl = document.getElementById('membersWalletAddr');
    var enablerGrid = document.getElementById('membersEnablerGrid');
    var nahGrid = document.getElementById('membersGrid');
    if (!section) return;

    addrEl.textContent = 'guest';
    if (enablerGrid) enablerGrid.innerHTML = '<p class="members-loading">// loading enabler properties...</p>';
    if (nahGrid) nahGrid.innerHTML = '<p class="members-loading nah-locked">// NOT A HOTEL — ウォレット接続で表示</p>';
    section.style.display = '';
    if (nav) nav.style.display = '';

    fetch('/api/availability')
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      _memberData = data;
      if (enablerGrid) {
        enablerGrid.innerHTML = '';
        data.forEach(function(prop) {
          enablerGrid.innerHTML += renderMemberCard(prop);
        });
      }
      renderFilterBar();
    })
    .catch(function() {
      if (enablerGrid) enablerGrid.innerHTML = '<p class="members-loading">// failed to load availability</p>';
    });
  }

  function getProvider() {
    if (window.solana && window.solana.isPhantom) return window.solana;
    if (window.solflare && window.solflare.isSolflare) return window.solflare;
    return null;
  }

  function connectWallet() {
    var provider = getProvider();
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    var btn = document.getElementById('walletBtn');
    btn.textContent = 'Connecting...';
    btn.disabled = true;

    provider.connect()
      .then(function() {
        var pubkey = provider.publicKey.toString();
        var ts = Math.floor(Date.now() / 1000);
        var message = 'enablerdao-auth:' + ts;
        var encoded = new TextEncoder().encode(message);

        return provider.signMessage(encoded, 'utf8').then(function(result) {
          var sigBytes = result.signature || result;
          // Convert Uint8Array to base64
          var binary = '';
          for (var i = 0; i < sigBytes.length; i++) binary += String.fromCharCode(sigBytes[i]);
          var sigBase64 = btoa(binary);

          return fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wallet_address: pubkey,
              signature: sigBase64,
              message: message
            })
          });
        });
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.ok && data.token) {
          var pubkey = provider.publicKey.toString();
          sessionStorage.setItem('ebr_token', data.token);
          sessionStorage.setItem('ebr_wallet', pubkey);
          btn.textContent = pubkey.slice(0, 4) + '...' + pubkey.slice(-4);
          btn.classList.add('wallet-connected');
          btn.disabled = false;
          showMembersSection(data.token, pubkey);
        } else {
          btn.textContent = 'Connect Wallet';
          btn.disabled = false;
          alert(data.error || 'Authentication failed');
        }
      })
      .catch(function(e) {
        btn.textContent = 'Connect Wallet';
        btn.disabled = false;
        if (e.message && e.message !== 'User rejected the request.') {
          console.error('Wallet auth error:', e);
        }
      });
  }

  // Restore session on page load
  function restoreSession() {
    var token = sessionStorage.getItem('ebr_token');
    var wallet = sessionStorage.getItem('ebr_wallet');
    if (token && wallet) {
      var btn = document.getElementById('walletBtn');
      if (btn) {
        btn.textContent = wallet.slice(0, 4) + '...' + wallet.slice(-4);
        btn.classList.add('wallet-connected');
      }
      showMembersSection(token, wallet);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('walletBtn');
    if (btn) {
      btn.addEventListener('click', function() {
        if (sessionStorage.getItem('ebr_token')) {
          // Already connected: disconnect
          sessionStorage.removeItem('ebr_token');
          sessionStorage.removeItem('ebr_wallet');
          btn.textContent = 'Connect Wallet';
          btn.classList.remove('wallet-connected');
          var section = document.getElementById('members');
          var nav = document.getElementById('navMembers');
          if (section) section.style.display = 'none';
          if (nav) nav.style.display = 'none';
        } else {
          connectWallet();
        }
      });
    }
    var peekLink = document.getElementById('peekMembersLink');
    if (peekLink) {
      peekLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMembersSectionPublic();
        document.getElementById('members').scrollIntoView({ behavior: 'smooth' });
      });
    }

    restoreSession();
  });
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

  // Start typewriter after opening animation (mode-aware)
  setTimeout(function() {
    var el = document.getElementById('typewriter-main');
    if (el && !typewriterStarted) {
      typewriterStarted = true;
      var mode = document.documentElement.getAttribute('data-mode') || 'code';
      var text = mode === 'villa'
        ? '極上を、おすそわけ。'
        : 'share the best, build the rest.';
      typewriter(el, text, 120);
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

// =====================================
// Availability Summary (bottom of page)
// =====================================
(function() {
  var PROP_META = {
    property01: { name: 'ホワイトハウス 熱海', location: '静岡県熱海市', airbnb: 'https://www.airbnb.jp/rooms/53223988' },
    property02: { name: 'ザ・ロッジ 弟子屈', location: '北海道弟子屈町', airbnb: 'https://www.airbnb.jp/rooms/597239384272621732' },
    property03: { name: 'ザ・ネスト 弟子屈', location: '北海道弟子屈町', airbnb: 'https://www.airbnb.jp/rooms/911857804615412559' },
    property04: { name: 'ビーチハウス ホノルル', location: 'Hawaii, USA', airbnb: 'https://www.airbnb.jp/rooms/1226550388535476490' },
    property05: { name: 'ガレージハウス ホノルル', location: 'Hawaii, USA', airbnb: 'https://www.airbnb.jp/rooms/936009273046846679' }
  };

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function toDateStr(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function addDays(dateStr, n) {
    var d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return toDateStr(d);
  }

  function daysBetween(a, b) {
    var da = new Date(a + 'T00:00:00');
    var db = new Date(b + 'T00:00:00');
    return Math.round((db - da) / 86400000);
  }

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    return parseInt(parts[1]) + '/' + parseInt(parts[2]);
  }

  // Compute free windows from booked_ranges within a date range
  function computeFreeWindows(bookedRanges, startStr, endStr) {
    // Sort booked ranges
    var sorted = bookedRanges.slice().sort(function(a, b) {
      return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
    });

    var windows = [];
    var cursor = startStr;

    for (var i = 0; i < sorted.length; i++) {
      var range = sorted[i];
      if (range.start > cursor && range.start <= endStr) {
        var winEnd = range.start < endStr ? range.start : endStr;
        var nights = daysBetween(cursor, winEnd);
        if (nights > 0) {
          windows.push({ start: cursor, end: winEnd, nights: nights });
        }
      }
      if (range.end > cursor) cursor = range.end;
    }

    // Remaining free window after last booking
    if (cursor < endStr) {
      var nights = daysBetween(cursor, endStr);
      if (nights > 0) {
        windows.push({ start: cursor, end: endStr, nights: nights });
      }
    }

    return windows;
  }

  function renderSummary(data) {
    var grid = document.getElementById('avsSummaryGrid');
    if (!grid) return;

    var today = new Date();
    var todayStr = toDateStr(today);
    // Look ahead 6 months
    var futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + 6);
    var endStr = toDateStr(futureDate);

    var html = '';

    data.forEach(function(prop) {
      var meta = PROP_META[prop.property_id] || { name: prop.property_id, location: '', airbnb: '#' };
      var freeWindows = computeFreeWindows(prop.booked_ranges || [], todayStr, endStr);

      // Total free nights
      var totalFree = 0;
      var maxConsecutive = 0;
      var bestWindow = null;
      freeWindows.forEach(function(w) {
        totalFree += w.nights;
        if (w.nights > maxConsecutive) {
          maxConsecutive = w.nights;
          bestWindow = w;
        }
      });

      // Show up to 3 upcoming windows
      var displayWindows = freeWindows.slice(0, 3);

      html += '<div class="avs-card">';
      html += '<div class="avs-card-name">' + meta.name + '</div>';
      html += '<div class="avs-card-location">' + meta.location + '</div>';

      html += '<div class="avs-stat-row">';
      html += '<div class="avs-stat"><span class="avs-stat-value">' + totalFree + '</span><span class="avs-stat-label">空き日数</span></div>';
      html += '<div class="avs-stat"><span class="avs-stat-value">' + maxConsecutive + '</span><span class="avs-stat-label">最大連泊</span></div>';
      html += '</div>';

      if (displayWindows.length > 0) {
        html += '<div class="avs-windows">';
        html += '<div class="avs-window-title">// 空き期間</div>';
        displayWindows.forEach(function(w) {
          var isBest = bestWindow && w.start === bestWindow.start && w.nights === maxConsecutive;
          html += '<div class="avs-window' + (isBest ? ' best' : '') + '">';
          html += '<span class="avs-window-dates">' + formatDate(w.start) + ' → ' + formatDate(w.end) + '</span>';
          html += '<span class="avs-window-nights">' + w.nights + '泊</span>';
          html += '</div>';
        });
        html += '</div>';
      }

      html += '<div style="display:flex;gap:8px;">';
      html += '<a class="avs-card-cta" style="flex:1;" href="' + meta.airbnb + '" target="_blank">Airbnb →</a>';
      html += '<button class="avs-card-cta avs-book-btn" style="flex:1;cursor:pointer;" data-prop-id="' + prop.property_id + '" data-prop-name="' + meta.name + '">直接予約 →</button>';
      html += '</div>';
      html += '</div>';
    });

    grid.innerHTML = html || '<p class="avs-loading">// 現在空き情報を取得できません</p>';
  }

  function loadAvailSummary() {
    fetch('/api/availability')
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(renderSummary)
      .catch(function() {
        var grid = document.getElementById('avsSummaryGrid');
        if (grid) grid.innerHTML = '<p class="avs-loading">// 空き情報を取得できませんでした</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAvailSummary);
  } else {
    loadAvailSummary();
  }
})();

// =====================================
// Booking Modal (Beds24)
// =====================================
(function() {
  function showBookModal(propId, propName) {
    var modal = document.getElementById('bookModal');
    if (!modal) return;
    document.getElementById('bookModalTitle').textContent = propName + ' — 予約リクエスト';
    document.getElementById('bookPropId').value = propId;
    document.getElementById('bookCheckIn').value = '';
    document.getElementById('bookCheckOut').value = '';
    document.getElementById('bookGuests').value = '2';
    document.getElementById('bookName').value = '';
    document.getElementById('bookEmail').value = '';
    document.getElementById('bookPhone').value = '';
    document.getElementById('bookMessage').value = '';
    document.getElementById('bookStatus').textContent = '';
    document.getElementById('bookStatus').className = 'book-status';
    modal.style.display = 'flex';
  }

  function hideBookModal() {
    var modal = document.getElementById('bookModal');
    if (modal) modal.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.querySelector('.book-modal-overlay');
    var closeBtn = document.querySelector('.book-modal-close');
    if (overlay) overlay.addEventListener('click', hideBookModal);
    if (closeBtn) closeBtn.addEventListener('click', hideBookModal);

    // Delegate click for book buttons
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.avs-book-btn');
      if (btn) {
        e.preventDefault();
        showBookModal(btn.getAttribute('data-prop-id'), btn.getAttribute('data-prop-name'));
      }
    });

    var form = document.getElementById('bookForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var st = document.getElementById('bookStatus');
        var submitBtn = form.querySelector('.book-submit');
        var nameVal = (document.getElementById('bookName').value || '').trim();
        var nameParts = nameVal.split(/\s+/);

        submitBtn.disabled = true;
        st.textContent = '// 送信中...';
        st.className = 'book-status';

        fetch('/api/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            property_id: document.getElementById('bookPropId').value,
            check_in: document.getElementById('bookCheckIn').value,
            check_out: document.getElementById('bookCheckOut').value,
            guests: parseInt(document.getElementById('bookGuests').value) || 2,
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email: document.getElementById('bookEmail').value,
            phone: document.getElementById('bookPhone').value,
            message: document.getElementById('bookMessage').value
          })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          submitBtn.disabled = false;
          if (data.ok) {
            st.textContent = '// 予約リクエストを送信しました。確認メールをお送りします。';
            st.className = 'book-status ok';
          } else {
            st.textContent = '// ' + (data.error || '送信に失敗しました');
            st.className = 'book-status err';
          }
        })
        .catch(function() {
          submitBtn.disabled = false;
          st.textContent = '// ネットワークエラーが発生しました';
          st.className = 'book-status err';
        });
      });
    }
  });
})();

// =====================================
// Chat Concierge (AI + Stripe Checkout)
// =====================================
(function() {
  var chatHistory = [];
  var chatPropertyId = 'property05';
  var chatSending = false;

  function createTypingIndicator() {
    var el = document.createElement('div');
    el.className = 'chat-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    return el;
  }

  function addBubble(container, text, role) {
    var el = document.createElement('div');
    el.className = 'chat-bubble ' + role;
    el.textContent = text;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function addBookingCard(container, action) {
    var card = document.createElement('div');
    card.className = 'chat-booking-card';
    card.innerHTML = '<div class="booking-title">予約確認</div>'
      + '<div class="booking-detail">チェックイン: ' + action.check_in + '</div>'
      + '<div class="booking-detail">チェックアウト: ' + action.check_out + '</div>'
      + '<div class="booking-detail">宿泊人数: ' + action.guests + '名</div>'
      + '<div class="booking-amount">合計: ¥' + action.amount.toLocaleString() + '</div>';
    var btn = document.createElement('button');
    btn.className = 'chat-checkout-btn';
    btn.textContent = '決済に進む';
    btn.addEventListener('click', function() { handleCheckout(action); });
    card.appendChild(btn);
    container.appendChild(card);
    container.scrollTop = container.scrollHeight;
  }

  function sendChatMessage(input, messagesEl) {
    var text = input.value.trim();
    if (!text || chatSending) return;

    // Add user message
    addBubble(messagesEl, text, 'user');
    chatHistory.push({ role: 'user', content: text });
    input.value = '';
    chatSending = true;

    // Show typing
    var typing = createTypingIndicator();
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Disable send buttons during request
    setSendDisabled(true);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: chatHistory,
        property_id: chatPropertyId
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      chatSending = false;
      setSendDisabled(false);

      var msg = data.message || 'エラーが発生しました。';
      addBubble(messagesEl, msg, 'ai');
      chatHistory.push({ role: 'assistant', content: msg });

      if (data.action && data.action.action_type === 'checkout') {
        addBookingCard(messagesEl, data.action);
      }

      // Sync modal and inline chat
      syncMessages(messagesEl);
    })
    .catch(function(e) {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      chatSending = false;
      setSendDisabled(false);
      addBubble(messagesEl, '通信エラーが発生しました。もう一度お試しください。', 'ai');
      console.error('Chat error:', e);
    });
  }

  function handleCheckout(action) {
    var body = {
      property_id: chatPropertyId,
      check_in: action.check_in,
      check_out: action.check_out,
      guests: action.guests,
      amount: action.amount
    };

    fetch('/api/chat/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || '決済セッションの作成に失敗しました。');
      }
    })
    .catch(function(e) {
      console.error('Checkout error:', e);
      alert('通信エラーが発生しました。');
    });
  }

  function setSendDisabled(disabled) {
    var btns = [
      document.getElementById('chatSend'),
      document.getElementById('chatModalSend')
    ];
    btns.forEach(function(b) { if (b) b.disabled = disabled; });
  }

  // Sync messages between inline and modal chat
  function syncMessages(source) {
    var inlineEl = document.getElementById('chatMessages');
    var modalEl = document.getElementById('chatModalMessages');
    if (!inlineEl || !modalEl) return;
    var target = source === inlineEl ? modalEl : inlineEl;
    target.innerHTML = source.innerHTML;
    target.scrollTop = target.scrollHeight;
  }

  function setupChat(inputId, sendId, messagesId) {
    var input = document.getElementById(inputId);
    var sendBtn = document.getElementById(sendId);
    var messages = document.getElementById(messagesId);
    if (!input || !sendBtn || !messages) return;

    sendBtn.addEventListener('click', function() {
      sendChatMessage(input, messages);
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage(input, messages);
      }
    });
  }

  // Show/hide floating chat button based on property05 visibility
  function updateFabVisibility() {
    var fab = document.getElementById('chatFab');
    var prop = document.getElementById('property05Chat');
    if (!fab) return;
    if (!prop) { fab.style.display = 'flex'; return; }
    var rect = prop.getBoundingClientRect();
    var visible = rect.top < window.innerHeight && rect.bottom > 0;
    fab.style.display = visible ? 'none' : 'flex';
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Setup inline chat
    setupChat('chatInput', 'chatSend', 'chatMessages');

    // Setup modal chat
    setupChat('chatModalInput', 'chatModalSend', 'chatModalMessages');

    // Floating button
    var fab = document.getElementById('chatFab');
    var modal = document.getElementById('chatModal');
    var closeBtn = document.getElementById('chatModalClose');

    if (fab && modal) {
      fab.addEventListener('click', function() {
        var isOpen = modal.style.display !== 'none';
        modal.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
          // Sync messages from inline to modal
          var inlineEl = document.getElementById('chatMessages');
          var modalEl = document.getElementById('chatModalMessages');
          if (inlineEl && modalEl) {
            modalEl.innerHTML = inlineEl.innerHTML;
            modalEl.scrollTop = modalEl.scrollHeight;
          }
          var modalInput = document.getElementById('chatModalInput');
          if (modalInput) modalInput.focus();
        }
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }

    // Update fab visibility on scroll
    updateFabVisibility();
    window.addEventListener('scroll', updateFabVisibility, { passive: true });

    // Check URL for booking result
    var params = new URLSearchParams(window.location.search);
    if (params.get('booking') === 'success') {
      var messagesEl = document.getElementById('chatMessages');
      if (messagesEl) {
        addBubble(messagesEl, 'ご予約ありがとうございます！確認メールをお送りいたします。ご不明な点がございましたらお気軽にお問い合わせください。', 'ai');
      }
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('booking') === 'cancel') {
      var messagesEl2 = document.getElementById('chatMessages');
      if (messagesEl2) {
        addBubble(messagesEl2, '決済がキャンセルされました。ご質問がございましたらお気軽にどうぞ。', 'ai');
      }
      window.history.replaceState({}, '', window.location.pathname);
    }
  });
})();