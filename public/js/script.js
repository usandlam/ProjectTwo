document.addEventListener(
  "DOMContentLoaded",
  () => {
    setCurrentPg();
  },
  false
);

function setCurrentPg(){
  let ele = 'navbar-brand'; //placeholder
  const onPage = window.location.pathname;
  if(onPage.includes('boards')){
      // document.getElementById('nav-boards').classList.toggle('active');
      ele = 'nav-boards';
  }else if(onPage.includes('main')){
      ele = 'nav-main';
  }else if(onPage.includes('profile')){
    ele = 'nav-profile';
  }else{
      ele = 'nav-home';
  }
  document.getElementById(ele).classList.toggle('active');
  document.getElementById(ele).innerHTML += `<span class="sr-only">(current)</span>`;
  return true;
}