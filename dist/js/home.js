'use strict';
document.addEventListener('DOMContentLoaded',()=>{
  [['home-new',p=>p.new],['home-featured',p=>p.featured],['home-sale',p=>p.oldPrice]].forEach(([id,filter])=>{const root=document.getElementById(id);if(root)Aura.products.filter(filter).slice(0,4).forEach(p=>root.append(Aura.card(p)));});
  const look=document.getElementById('home-look');if(look)['camisa-brisa','calca-linha'].forEach(id=>{const p=Aura.products.find(p=>p.id===id);if(p)look.append(Aura.card(p));});
  const categories=document.getElementById('home-categories');if(categories)Aura.categories.forEach(c=>categories.append(Aura.el('a',{href:'catalogo.html?categoria='+encodeURIComponent(c),text:c})));
});
