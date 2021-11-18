const intro = document.getElementById('intro');
const ads = document.getElementById('ads');
const auto = document.getElementById('auto');

window.onclick = (event) => {
  const target = event.target;

  if (target.id === 'intro') {
    if (intro.checked) {
      sendActiveTab('intro', 'true');
      chrome.storage.sync.set({intro: 'true'});
    } else {
      sendActiveTab('intro', 'false');
      chrome.storage.sync.set({intro: 'false'});
    }
  }

  if (target.id === 'ads') {
    if (ads.checked) {
      chrome.storage.sync.set({ads: 'true'});
      sendActiveTab('ads', 'true');
    } else {
      chrome.storage.sync.set({ads: 'false'});
      sendActiveTab('ads', 'false');
    }
  }

  if (target.id === 'auto') {
    if (auto.checked) {
      chrome.storage.sync.set({auto: 'true'});
      sendActiveTab('auto', 'true');
    } else {
      chrome.storage.sync.set({auto: 'false'});
      sendActiveTab('auto', 'false');
    }
  }
};

chrome.storage.sync.get(['intro'], (result) => {
  intro.checked = result.intro === 'true' ? true : false;
});

chrome.storage.sync.get(['ads'], (result) => {
  ads.checked = result.ads === 'true' ? true : false;
});

chrome.storage.sync.get(['auto'], (result) => {
  auto.checked = result.auto === 'true' ? true : false;
});

function sendActiveTab(key, value) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    // Sadly {key: value} seems not to work here?
    chrome.tabs.sendMessage(tabs[0].id, {[key]: value});
  });
}
