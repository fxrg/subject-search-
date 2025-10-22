'use strict';
(function(){
  const ICONS = {
    success: '\u2714', // ✓
    error: '\u26A0',   // ⚠
    info: '\u2139',    // ℹ
    warning: '\u26A0'  // ⚠
  };

  let container;
  function ensureContainer(position){
    if(!container){
      container = document.createElement('div');
      container.className = 'notify-container';
      container.setAttribute('aria-live','polite');
      container.dir = 'rtl';
      document.body.appendChild(container);
    }
    container.classList.remove('bottom','right','left');
    if(position === 'top-right'){ container.classList.add('right'); }
    else if(position === 'top-left'){ container.classList.add('left'); }
    else if(position === 'bottom-center'){ container.classList.add('bottom'); }
    else if(position === 'bottom-right'){ container.classList.add('bottom','right'); }
    else if(position === 'bottom-left'){ container.classList.add('bottom','left'); }
    return container;
  }

  function createBar(duration){
    const bar = document.createElement('div');
    bar.className = 'bar';
    if(duration>0){
      // animate width from 100% to 0 using CSS transform
      const anim = bar.animate([
        { transform:'scaleX(1)' },
        { transform:'scaleX(0)' }
      ], { duration, easing:'linear' });
      anim.pause();
      // start after frame to guarantee attachment
      requestAnimationFrame(()=>anim.play());
    }
    return bar;
  }

  function notify(opts){
    const {
      title = '',
      message = '',
      type = 'success',
      duration = 3000,
      position = 'top-center',
      closeable = true
    } = opts || {};

    const host = ensureContainer(position);

    const el = document.createElement('div');
    el.className = `notify ${type}`;
    el.setAttribute('role', type==='error'?'alert':'status');

    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.textContent = ICONS[type] || ICONS.info;

    const content = document.createElement('div');
    content.className = 'content';
    if(title){
      const t = document.createElement('div');
      t.className = 'title';
      t.textContent = title;
      content.appendChild(t);
    }
    const m = document.createElement('div');
    m.className = 'message';
    m.textContent = message;
    content.appendChild(m);

    const close = document.createElement('button');
    close.className = 'close';
    close.setAttribute('aria-label','اغلاق');
    close.innerHTML = '&times;';
    if(closeable){
      close.addEventListener('click', ()=>hide());
    }else{
      close.style.display='none';
    }

    const bar = createBar(duration);

    el.append(icon, content, close, bar);
    host.appendChild(el);

    // auto-dismiss
    let timer;
    function startTimer(){ if(duration>0){ timer = setTimeout(hide, duration+50); } }
    function clearTimer(){ if(timer){ clearTimeout(timer); timer=undefined; } }

    function hide(){
      clearTimer();
      el.classList.add('hide');
      el.addEventListener('animationend', ()=>{
        el.remove();
        if(host.childElementCount===0){ host.classList.remove('bottom','right','left'); }
      }, { once:true });
    }

    // Pause timer when hovered/focused for accessibility
    el.addEventListener('mouseenter', clearTimer);
    el.addEventListener('mouseleave', startTimer);
    el.addEventListener('focusin', clearTimer);
    el.addEventListener('focusout', startTimer);

    startTimer();

    return { hide };
  }

  // Public helpers
  window.notify = notify;
  window.notifySuccess = (msg, opts={})=> notify({ message: msg, type: 'success', ...opts });
  window.notifyError   = (msg, opts={})=> notify({ message: msg, type: 'error', ...opts });
  window.notifyInfo    = (msg, opts={})=> notify({ message: msg, type: 'info', ...opts });
  window.notifyWarn    = (msg, opts={})=> notify({ message: msg, type: 'warning', ...opts });

  // Optional: replace native alert with a toast-style notification
  window.enableNotifyAlert = function(){
    const original = window.alert;
    window.alert = function(msg){
      try{ notifyInfo(String(msg), { position: 'top-center', duration: 2600 }); }
      catch(e){ original(msg); }
    };
  }
})();
