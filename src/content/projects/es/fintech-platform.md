---
title: 'Plataforma Fintech'
summary: 'Desarrollo full stack para una empresa fintech, construyendo microservicios e infraestructura cloud.'
stack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'AWS', 'Terraform', 'Docker', 'GitHub Actions']
role: 'Desarrollador Full Stack'
problem: 'La empresa necesitaba una arquitectura de microservicios escalable con pipelines CI/CD robustos e infraestructura cloud para manejar transacciones financieras de forma segura.'
decisions:
  - title: 'Microservicios con NestJS'
    description: 'Elegimos NestJS por su arquitectura modular y enfoque TypeScript-first, permitiendo límites claros entre servicios y type safety en todo el backend.'
  - title: 'Infraestructura AWS con Terraform'
    description: 'Definimos toda la infraestructura como código usando Terraform — VPC, EC2, S3, EventBridge, IAM — asegurando despliegues reproducibles y trazabilidad.'
  - title: 'Comunicación event-driven'
    description: 'Usamos AWS EventBridge para comunicación asíncrona entre servicios, reduciendo el acoplamiento y mejorando la resiliencia.'
outcome: 'Entregamos una plataforma lista para producción con despliegues automatizados, monitoreo integral e infraestructura que escala con las necesidades del negocio.'
codeAvailability: 'Private'
featured: true
order: 1
lang: 'es'
---

## Contexto

Trabajé como desarrollador full stack en una empresa fintech, contribuyendo a la plataforma principal que procesa operaciones financieras para clientes en América Latina.

## Arquitectura

El sistema sigue un patrón de microservicios con servicios NestJS comunicándose a través de AWS EventBridge. Cada servicio es dueño de su esquema de base de datos en PostgreSQL, desplegado mediante contenedores Docker en instancias EC2 dentro de una VPC privada.

## Contribuciones clave

- Diseñé e implementé APIs RESTful con NestJS, siguiendo principios de arquitectura limpia
- Construí y mantuve módulos Terraform para infraestructura AWS (VPC, EC2, S3, Route 53, EventBridge, IAM)
- Configuré pipelines CI/CD con GitHub Actions, incluyendo testing automatizado, linting y despliegue
- Implementé migraciones de base de datos y optimización de consultas para PostgreSQL
- Participé en code reviews y mantuve quality gates de SonarQube
