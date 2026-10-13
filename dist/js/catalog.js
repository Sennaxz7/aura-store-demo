'use strict';
window.AuraCatalog = (()=>{
  const keys=['q','publico','categoria','colecao','tamanho','cor','min','max','disponibilidade','ordenar','destaque'];
  function filter(products,s){return products.filter(p=>{
    if(s.q&&!Aura.norm(p.name+' '+p.category).includes(Aura.norm(s.q)))return false;
    if(s.publico&&p.audience!==s.publico)return false;
    if(s.categoria&&p.category!==s.categoria)return false;
    if(s.colecao&&p.collection!==s.colecao)return false;
    if(s.min&&p.price<Number(s.min)||s.max&&p.price>Number(s.max))return false;
    if(s.destaque==='novos'&&!p.new||s.destaque==='promocoes'&&!p.oldPrice||s.destaque==='procurados'&&!p.featured)return false;
    return p.variants.some(v=>(!s.cor||v.color===s.cor)&&(!s.tamanho||v.size===s.tamanho)&&(!s.disponibilidade||(s.disponibilidade==='disponivel'?v.stock>0:v.stock===0)));
  }).sort((a,b)=>s.ordenar==='menor'?a.price-b.price:s.ordenar==='maior'?b.price-a.price:b.date.localeCompare(a.date));}
  function init(){const root=document.getElementById('catalog-root');if(!root)return;let state=Object.fromEntries(new URLSearchParams(location.search));let activeDialog=null;
    const title=document.getElementById('catalog-title');const form=Aura.el('form',{class:'filter-form'});const input=(name,label,type='text')=>{const id='filter-'+name,n=Aura.el('input',{id,name,type,value:state[name]||'',min:type==='number'?0:null,step:type==='number'?'0.01':null});form.append(Aura.el('label',{for:id,text:label}),n);return n;};
    input('q','Buscar por nome ou categoria','search');
    function select(name,label,options){const id='filter-'+name,n=Aura.el('select',{id,name},Aura.el('option',{value:'',text:'Todos'}),options.map(v=>Array.isArray(v)?Aura.el('option',{value:v[0],text:v[1]}):Aura.el('option',{value:v,text:v})));n.value=state[name]||'';form.append(Aura.el('label',{for:id,text:label}),n);return n;}
    select('publico','Público',Aura.audiences);select('categoria','Categoria',Aura.categories);select('colecao','Coleção',Aura.collections);select('tamanho','Tamanho',[...new Set(Aura.products.flatMap(p=>p.sizes))]);select('cor','Cor',[...new Set(Aura.products.flatMap(p=>p.colors.map(c=>c.name)))]);input('min','Preço mínimo (R$)','number');input('max','Preço máximo (R$)','number');select('disponibilidade','Disponibilidade',[['disponivel','Disponível'],['esgotado','Variações esgotadas']]);select('destaque','Seleção',[['novos','Novidades'],['promocoes','Promoções'],['procurados','Mais procuradas']]);
    form.append(Aura.el('button',{class:'btn full',type:'button',text:'Limpar filtros',onclick:clear}),Aura.el('button',{class:'btn dark full mobile-only',type:'button',text:'Ver resultados',onclick:()=>activeDialog?.close()}));
    const sidebar=Aura.el('aside',{class:'filters','aria-label':'Filtros do catálogo'},Aura.el('h2',{text:'Refine sua seleção'}),form);
    const sort=Aura.el('select',{id:'sort','aria-label':'Ordenar resultados'},[['novos','Novidades'],['menor','Menor preço'],['maior','Maior preço']].map(([value,text])=>Aura.el('option',{value,text})));sort.value=state.ordenar||'novos';sort.addEventListener('change',()=>{state.ordenar=sort.value;update(true);});
    const count=Aura.el('span',{role:'status','aria-live':'polite'}),chips=Aura.el('div',{class:'active-filters'}),grid=Aura.el('div',{class:'product-grid catalog-grid'});
    const mobile=Aura.el('button',{class:'btn filter-toggle',text:'Filtros +',onclick:()=>{activeDialog=Aura.dialog('Filtros',form);activeDialog.addEventListener('close',()=>{sidebar.append(form);activeDialog=null;});}});
    root.append(sidebar,Aura.el('div',{class:'catalog-results'},Aura.el('div',{class:'catalog-toolbar'},count,mobile,sort),chips,grid));
    form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',()=>{state={...state,...Object.fromEntries(new FormData(form))};update(false);});form.addEventListener('change',()=>{state={...state,...Object.fromEntries(new FormData(form))};update(true);});
    function clear(){state={};form.querySelectorAll('[name]').forEach(n=>n.value='');sort.value='novos';update(true);}
    function update(push){const params=new URLSearchParams();keys.forEach(k=>{if(state[k])params.set(k,state[k]);});const url='catalogo.html'+(params.size?'?'+params:'');history[push?'pushState':'replaceState']({},'',url);title.textContent=state.publico||state.colecao||state.categoria||'Todas as peças';const results=filter(Aura.products,state);count.textContent=results.length+' peça'+(results.length===1?'':'s');chips.replaceChildren();keys.filter(k=>state[k]&&k!=='ordenar').forEach(k=>chips.append(Aura.el('button',{class:'chip',text:({min:'A partir de R$ ',max:'Até R$ ',q:'Busca: ',disponibilidade:'Disponibilidade: ',destaque:'Seleção: '}[k]||'')+state[k]+' ×','aria-label':'Remover filtro '+state[k],onclick:()=>{delete state[k];if(form.elements[k])form.elements[k].value='';update(true);}})));grid.replaceChildren();if(results.length)results.forEach(p=>grid.append(Aura.card(p,url)));else grid.append(Aura.el('div',{class:'empty'},Aura.el('h2',{text:'Vamos tentar outra combinação?'}),Aura.el('p',{text:'Nenhuma peça corresponde à sua seleção. Altere a busca ou os filtros.'}),Aura.el('button',{class:'btn',text:'Limpar filtros',onclick:clear})));}
    window.addEventListener('popstate',()=>{state=Object.fromEntries(new URLSearchParams(location.search));form.querySelectorAll('[name]').forEach(n=>n.value=state[n.name]||'');sort.value=state.ordenar||'novos';update(false);});update(false);
  }
  document.addEventListener('DOMContentLoaded',init);return {filter};
})();
