'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const root=document.getElementById('contact-root');if(!root)return;
 const configured=AuraWhatsApp.contact();
 const text='Olá, '+AURA_CONFIG.name+'! Gostaria de conversar sobre as peças, os tamanhos e as condições de entrega ou retirada.';
 const href=AuraWhatsApp.link(text);
 if(href)root.append(Aura.el('a',{class:'btn dark',href,target:'_self',text:'Conversar pelo WhatsApp ↗'}));
 else root.append(Aura.el('button',{class:'btn dark',text:configured.status==='demo'?'Visualizar contato demonstrativo ↗':'Verificar contato da loja ↗',onclick:()=>{const message=Aura.el('textarea',{readonly:true,'aria-label':'Mensagem de contato',text});Aura.dialog(configured.status==='demo'?'Contato em demonstração':'Contato precisa de ajuste',Aura.el('div',{},Aura.el('p',{class:'warning',text:configured.help}),message,Aura.el('button',{class:'btn',text:'Copiar mensagem',onclick:async()=>{try{await navigator.clipboard.writeText(text);Aura.toast('Mensagem copiada.');}catch{message.focus();message.select();Aura.toast('Selecione e copie o texto usando o comando de copiar do seu dispositivo.');}}})));}}));
 if(AURA_CONFIG.email)root.append(Aura.el('a',{class:'btn',href:'mailto:'+AURA_CONFIG.email,text:'Enviar e-mail ↗'}));
 if(AURA_CONFIG.address)root.append(Aura.el('p',{text:'Endereço informado pela loja: '+AURA_CONFIG.address}));
});
