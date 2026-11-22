---
title: 'Integración API de Meta'
summary: 'Integración CRM en tiempo real con APIs de Meta (WhatsApp/Instagram) usando WebSockets.'
stack: ['Node.js', 'WebSockets', 'Meta API', 'Integración CRM']
role: 'Desarrollador Backend (Freelance)'
problem: 'Un negocio necesitaba que su sistema CRM recibiera y respondiera mensajes de plataformas Meta (WhatsApp, Instagram) en tiempo real, sin cambiar manualmente entre sistemas.'
decisions:
  - title: 'Arquitectura WebSocket'
    description: 'Implementamos conexiones WebSocket para entrega de mensajes en tiempo real entre webhooks de Meta y el CRM, eliminando retrasos de polling.'
  - title: 'Pipeline de procesamiento de webhooks'
    description: 'Construimos un manejador robusto de webhooks que valida, transforma y enruta eventos entrantes de la API de Meta a los canales apropiados del CRM.'
outcome: 'Habilitamos comunicación con clientes en tiempo real a través de una interfaz CRM unificada, reduciendo tiempos de respuesta y mejorando la satisfacción del cliente.'
codeAvailability: 'Private'
featured: true
order: 3
lang: 'es'
---

## Contexto

Proyecto freelance integrando APIs de la plataforma Meta (WhatsApp Business, Instagram) con el sistema CRM de un cliente usando conexiones WebSocket en tiempo real.

## Arquitectura

Los mensajes entrantes de webhooks de Meta se procesan, validan y reenvían vía WebSockets al frontend del CRM. Los mensajes salientes siguen el camino inverso a través de la API de Meta.

## Contribuciones clave

- Construí manejadores de webhooks para eventos de la API de Meta (mensajes, actualizaciones de estado, media)
- Implementé servidor WebSocket para actualizaciones del CRM en tiempo real
- Diseñé capa de transformación de mensajes entre formato Meta y esquema del CRM
- Manejé carga de media y adjuntos entre plataformas
