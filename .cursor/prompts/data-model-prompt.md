---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Implement MongoDB model and initialization'
---
You are tasked with creating a MongoDB implementation based on the plan prepared in the ai/mongo-plan.md file, while considering the information in ai/tech-stack.md and ai/prd.md. Your focus should be on creating the model and Redis initialization, not on implementing the rest of the logic.

First, review the Mongo plan:
<mongo_plan>
{{MONGO_PLAN}}
</mongo_plan>

Next, consider the tech stack:
<tech_stack>
{{TECH_STACK}}
</tech_stack>

Finally, keep in mind the product requirements:
<prd>
{{PRD}}
</prd>

Based on these inputs, your task is to create the MongoDB implementation. Focus specifically on:

1. Creating the data model for MongoDB
2. Implementing the MongoDB initialization process

When creating the implementation:
- Use the programming language and frameworks specified in the tech stack
- Ensure your model aligns with the requirements outlined in the PRD
- Follow the structure and guidelines provided in the MongoDB plan
- Do not implement any logic beyond the model and initialization at this stage

Your output should include:
1. The data model for MongoDB
2. The MongoDB initialization code

Make sure to include any necessary imports and configurations required for the MongoDB model and initialization.

Remember, focus only on the model and initialization. Do not implement other MongoDB operations or application logic at this point.