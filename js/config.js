// 1. What does the browser actually have loaded?
console.log('years =', window.PORTFOLIO_DATA?.stats?.[0]?.value);
console.log('experience =', window.PORTFOLIO_DATA?.experience?.length);
console.log('projects =', window.PORTFOLIO_DATA?.projects?.length);
console.log('interests =', window.PORTFOLIO_DATA?.interests);

// 2. What does the server actually serve for data.js?
fetch('js/data.js?cachebust=' + Date.now())
  .then(r => r.text())
  .then(t => {
    console.log('data.js has 4+ years:', t.includes('4+ years'));
    console.log('data.js has Library project:', t.includes('Library Management'));
    console.log('data.js has empty interests:', t.includes('"interests": []'));
  });
