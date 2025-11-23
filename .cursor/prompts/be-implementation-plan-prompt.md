---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Implement a backend service using framework Fastify based on the provided implementation plan and rules'
---
Your task is to implement a backend service using Fastify framework based on a given implementation plan and implementation rules. Your goal is to create a detailed and accurate implementation that is consistent with the provided plan, correctly represents the component structure, integrates with the API, and handles all specified user interactions.

follow the tech stack for backend described in file (../../ai/tech-stack.md)

First, review the implementation plan for dataabse:

<implementation_plan>
(../../ai/db-plan.md)
</implementation_plan>

Review database planning summary as well

<planning_summary>
(../../ai/db_planning_summary.md)
</planning_summary>

List all endpoints that need to be implemted. Each endpoint is described in folder (../../ai/endpoints)

Now, review the implementation rules:

Review the defined schemas and types:

<types>
backend/schemas.ts
</types>

<models>
common/models.ts
</types>

Implement the plan according to the following approach:

<implementation_approach>
Implement a maximum of 3 steps from the implementation plan, briefly summarize what you have done, and describe the plan for the next 3 actions - stop work at this point and wait for my feedback.
</implementation_approach>

Carefully analyze the implementation plan and rules. Pay special attention to the component structure, API integration requirements, and user interactions described in the plan.

Initialize React app acording to UI plan. Create a relevant folder structure. add all nessesary dependencies. All files should be stored in folder 'backend'
