---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Generate PRD'
---
<db-plan>
ai/mongo_planning_summary.md
</db-plan>

<prd>
ai/prd.md
</prd>

<tech-stack>
ai/tech-stack.md
</tech-stack>

You are an experienced API architect tasked with creating a comprehensive REST API plan. Your plan will be based on the provided database schema, product requirements document (PRD), and tech stack given above. Carefully review the inputs and perform the following steps:

1. Analyze the database schema:
   - Identify the primary entities (tables)
   - Note the relationships between the entities
   - Consider any indexes that might impact the API design
   - Pay attention to any validation conditions specified in the schema.

2. Analyze the PRD:
   - Identify the key features and functionalities
   - Note the specific requirements for data operations (retrieving, creating, updating, deleting)
   - Identify business logic requirements that go beyond CRUD operations

3. Consider the tech stack:
   - Ensure the API plan is compatible with the specified technologies.
   - Consider how these technologies might influence the API design

4. Create a comprehensive REST API plan:
   - Define the main resources based on the database entities and PRD requirements
   - Design CRUD endpoints for each resource
   - Design endpoints for the business logic described in the PRD
   - Include pagination, filtering, and sorting for list endpoints.
   - Plan for the appropriate use of HTTP methods
   - Define the request and response payload structures
   - Include authentication and authorization mechanisms if mentioned in the PRD
   - Consider rate limiting and other security measures

Before delivering the final plan, work inside the <api_analysis> tags in your thought block to break down your thought process and ensure you have considered all necessary aspects. In this section:

1. List the main entities from the database schema. Number each entity and quote the relevant part of the schema.
2. List the key business logic features from the PRD. Number each feature and quote the relevant part of the PRD.
3. Map the features from the PRD to potential API endpoints. For each feature, consider at least two possible endpoint designs and explain which one you chose and why.
4. Consider and list any security and performance requirements. For each requirement, quote the part of the input documents that supports it.
5. Clearly map the business logic from the PRD to API endpoints.
6. Incorporate the validation conditions from the database schema into the API plan.

This section can be quite long.

The final API plan should be formatted in markdown and include the following sections:

```markdown
# REST API Plan

## 1. Resources
- List each main resource and its corresponding database table

## 2. Endpoints
For each resource, provide:
- HTTP Method
- URL Path
- Brief Description
- Query Parameters (if applicable)
- JSON Request Payload Structure (if applicable)
- JSON Response Payload Structure
- Success Codes and Messages
- Error Codes and Messages

## 3. Authentication and Authorization
- Describe the chosen authentication mechanism and implementation details

## 4. Validation and Business Logic
- List validation conditions for each resource
- Describe how business logic is implemented in the API

Ensure your plan is comprehensive, well-structured, and addresses all aspects of the input materials. If you must make any assumptions due to unclear input, state them explicitly in your analysis.

The final output should consist solely of the API plan in markdown format in english, wich you save in ai/api-plan.md and it should not include or repeate any work done in the thought block.