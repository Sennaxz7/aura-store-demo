'use strict';
window.AuraWhatsApp = (()=>{
  function contact(value=AURA_CONFIG.WHATSAPP_NUMBER){
    if(typeof value!=='string'&&typeof value!=='number')return {status:'invalid',number:'',help:'Confira WHATSAPP_NUMBER em js/config.js: informe país, DDD e número.'};
    const raw=String(value).trim();
    if(!/^\+?[\d\s().-]+$/.test(raw)||raw.length>80)return {status:'invalid',number:'',help:'Número inválido em js/config.js. Use país, DDD e número; não use texto ou um link.'};
    const number=raw.replace(/\D/g,'').replace(/^00/,'');
    if(number==='5500000000000')return {status:'demo',number,help:'Contato em demonstração. Substitua WHATSAPP_NUMBER no arquivo js/config.js desta versão do site. Se já alterou o arquivo, salve e recarregue com Ctrl+F5.'};
    if(!/^[1-9]\d{9,14}$/.test(number))return {status:'invalid',number:'',help:'Número inválido em js/config.js. Informe o número internacional completo com código do país e DDD.'};
    return {status:'ready',number,help:'Confira as peças e clique em “Continuar no WhatsApp”. Você confirma o envio dentro do WhatsApp.'};
  }
  function link(text,value=AURA_CONFIG.WHATSAPP_NUMBER){const c=contact(value);return c.status==='ready'?'https://wa.me/'+c.number+'?text='+encodeURIComponent(text):null;}
  function message(items){let total=0;const lines=['Olá, '+AURA_CONFIG.name+'! Tenho interesse nas seguintes peças:',''];items.forEach(({product:p,color,size,qty})=>{const sub=p.price*qty;total+=sub;const url=new URL('produto.html',location.href);url.searchParams.set('id',p.id);lines.push(p.name+' · Código '+p.code,'Cor: '+color+' | Tamanho: '+size+' | Quantidade: '+qty,'Preço unitário: '+Aura.money(p.price)+' | Subtotal estimado: '+Aura.money(sub),url.href,'');});lines.push('Total estimado: '+Aura.money(total),'','Pode confirmar a disponibilidade, os preços e as condições de entrega ou retirada? Obrigado!');return lines.join('\n');}
  function open(items){if(!items.length)return;const text=message(items),configured=contact(),href=link(text);const box=Aura.el('div',{},Aura.el('p',{class:href?'':'warning',text:configured.help}),Aura.el('p',{class:'muted',text:'Preços, disponibilidade, entrega e conclusão da compra serão confirmados pelo vendedor.'}));const area=Aura.el('textarea',{class:'message-preview',readonly:true,'aria-label':'Mensagem preparada',rows:14});area.value=text;box.append(area);if(href)box.append(Aura.el('p',{class:'fine-print',text:'Contato da loja: +'+configured.number}),Aura.el('a',{class:'btn dark full',href,target:'_self',text:'Continuar no WhatsApp ↗'}));box.append(Aura.el('button',{class:'btn',text:'Copiar mensagem',onclick:async()=>{try{await navigator.clipboard.writeText(text);Aura.toast('Mensagem copiada.');}catch{area.focus();area.select();Aura.toast('Selecione a mensagem e copie com Ctrl+C.');}}}));Aura.dialog('Sua seleção, sua conversa',box);}
  return {message,open,contact,link};
})();
