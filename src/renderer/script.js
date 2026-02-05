// =================================================================================================================
//
// Under testting, this file is not fully optimized for production and may contain some temporary code or comments.
//
// =================================================================================================================

const urlInput = document.getElementById('url');
const goBtn = document.getElementById('go');
const tabsContainer = document.getElementById('tabs');
const newTabBtn = document.getElementById('new-tab');

function setupEventListeners() {
  goBtn.addEventListener('click', navigateToUrl);
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') navigateToUrl();
  });

  newTabBtn.addEventListener('click', () => {
    window.electronAPI.send('new-tab');
  });

  document.getElementById('close').addEventListener('click', () => 
    window.electronAPI.send('close-app'));
  
  document.getElementById('minimize').addEventListener('click', () => 
    window.electronAPI.send('minimize-app'));
  
  document.getElementById('maximize').addEventListener('click', () => 
    window.electronAPI.send('maximize-app'));

  document.getElementById('bookmark-btn')?.addEventListener('click', () => {
    window.electronAPI.send('toggle-bookmark');
  });

  document.getElementById('history-btn')?.addEventListener('click', () => {
    window.electronAPI.send('open-history');
  });

  document.getElementById('menu-btn')?.addEventListener('click', () => {
    window.electronAPI.send('open-menu');
  });
}

function navigateToUrl() {
  let url = urlInput.value.trim();
  
  if (!url) {
    window.electronAPI.send('navigate', '');
    return;
  }
  
  window.electronAPI.send('navigate', url);
}

function updateUrl(url) {
  if (url && url !== 'file://' && !url.includes('home.html')) {
    urlInput.value = url;
  } else {
    urlInput.value = '';
  }
}

function updateTabs(tabsData) {
  tabsContainer.innerHTML = '';
  
  tabsData.forEach((tab, index) => {
    const tabEl = document.createElement('div');
    tabEl.className = 'tab';
    tabEl.setAttribute('data-index', index);
    
    const faviconUrl = tab.favicon || 
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzQzNjFlZSI+PHBhdGggZD0iTTggMWE3IDcgMCAxIDAgMCAxNCA3IDcgMCAwIDAgMC0xNHptMCAxYTQgNCAwIDAgMSA0IDQgNCA0IDAgMCAxLTggMCA0IDQgMCAwIDEgNC00eiIvPjwvc3ZnPgo=';
    
    tabEl.innerHTML = `
      <img src="${faviconUrl}" class="tab-favicon" alt="">
      <span class="tab-title">${tab.title || 'Nouvel onglet'}</span>
      <button class="tab-close">×</button>
    `;
    
    tabEl.addEventListener('click', (e) => {
      if (!e.target.classList.contains('tab-close')) {
        window.electronAPI.send('switch-tab', index);
      }
    });
    
    const closeBtn = tabEl.querySelector('.tab-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.electronAPI.send('close-tab', index);
    });
    
    tabsContainer.appendChild(tabEl);
  });
  
  const allTabs = document.querySelectorAll('.tab');
  if (allTabs.length > 0) {
    allTabs[allTabs.length - 1].classList.add('active');
  }
}

function showVerifiedBadge(hostname) {
  const badge = document.getElementById('verified-badge');
  if (badge) {
    badge.classList.remove('hidden');
    const span = badge.querySelector('span');
    if (span) {
      span.textContent = hostname ? `Sécurisé • ${hostname}` : 'Sécurisé';
    }
  }
}

function hideVerifiedBadge() {
  const badge = document.getElementById('verified-badge');
  if (badge) {
    badge.classList.add('hidden');
  }
}

function init() {
  setupEventListeners();
  
  window.electronAPI.receive('tabs-updated', (tabsData) => {
    updateTabs(tabsData);
  });
  
  window.electronAPI.receive('site-verified', (hostname) => {
    showVerifiedBadge(hostname);
  });
  
  window.electronAPI.receive('site-unverified', () => {
    hideVerifiedBadge();
  });
  
  window.electronAPI.receive('url-changed', (url) => {
    updateUrl(url);
  });
  
  window.electronAPI.receive('title-changed', (title) => {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
      const titleSpan = activeTab.querySelector('.tab-title');
      if (titleSpan && title) {
        titleSpan.textContent = title;
      }
    }
  });
  
  window.electronAPI.send('get-initial-state');
}

document.addEventListener('DOMContentLoaded', init);