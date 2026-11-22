---
title: 'Fintech Platform'
summary: 'Full stack development for a fintech company, building microservices and cloud infrastructure.'
stack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'AWS', 'Terraform', 'Docker', 'GitHub Actions']
role: 'Full Stack Developer'
problem: 'The company needed scalable microservices architecture with robust CI/CD pipelines and cloud infrastructure to handle financial transactions securely.'
decisions:
  - title: 'Microservices with NestJS'
    description: 'Chose NestJS for its modular architecture and TypeScript-first approach, enabling clear service boundaries and type safety across the backend.'
  - title: 'AWS Infrastructure with Terraform'
    description: 'Defined all infrastructure as code using Terraform — VPC, EC2, S3, EventBridge, IAM — ensuring reproducible deployments and audit trails.'
  - title: 'Event-driven communication'
    description: 'Used AWS EventBridge for asynchronous inter-service communication, reducing coupling and improving resilience.'
outcome: 'Delivered a production-ready platform with automated deployments, comprehensive monitoring, and infrastructure that scales with business needs.'
kpis:
  - label: Microservices in production
    value: '2–3'
  - label: Platform uptime
    value: '>99%'
  - label: Automated CI/CD pipelines
    value: '1–2'
  - label: Engineering team
    value: '3–5'
codeAvailability: 'Private'
featured: true
order: 1
lang: 'en'
---

## Context

Worked as a full stack developer at a fintech company, contributing to the core platform that processes financial operations for clients across Latin America.

## Architecture

The system follows a microservices pattern with NestJS services communicating through AWS EventBridge. Each service owns its database schema in PostgreSQL, deployed via Docker containers on EC2 instances within a private VPC.

## Key contributions

- Designed and implemented RESTful APIs with NestJS, following clean architecture principles
- Built and maintained Terraform modules for AWS infrastructure (VPC, EC2, S3, Route 53, EventBridge, IAM)
- Set up CI/CD pipelines with GitHub Actions, including automated testing, linting, and deployment
- Implemented database migrations and query optimization for PostgreSQL
- Participated in code reviews and maintained SonarQube quality gates
