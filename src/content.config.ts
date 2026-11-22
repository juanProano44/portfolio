import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const codeAvailability = z.enum(['Public', 'Private', 'On request']);

const projectKpi = z.object({
  label: z.string(),
  value: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    stack: z.array(z.string()),
    role: z.string(),
    problem: z.string(),
    decisions: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
    outcome: z.string(),
    kpis: z.array(projectKpi).default([]),
    codeAvailability: codeAvailability,
    featured: z.boolean().default(false),
    order: z.number().default(0),
    lang: z.enum(['en', 'es']),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    period: z.string(),
    description: z.string(),
    highlights: z.array(z.string()),
    order: z.number().default(0),
    lang: z.enum(['en', 'es']),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/education' }),
  schema: z.object({
    institution: z.string(),
    degree: z.string(),
    period: z.string(),
    description: z.string().optional(),
    lang: z.enum(['en', 'es']),
  }),
});

const leadership = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leadership' }),
  schema: z.object({
    organization: z.string(),
    role: z.string(),
    period: z.string(),
    description: z.string(),
    lang: z.enum(['en', 'es']),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/skills' }),
  schema: z.object({
    categories: z.array(
      z.object({
        name: z.string(),
        items: z.array(z.string()),
      }),
    ),
    lang: z.enum(['en', 'es']),
  }),
});

export const collections = {
  projects,
  experience,
  education,
  leadership,
  skills,
};
