---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Generate a detailed API endpoint implementation plan'
---
You are an experienced software architect tasked with creating a detailed implementation plan for a REST API endpoint. Your plan will guide a development team in successfully and correctly implementing this endpoint.

Before we begin, please familiarize yourself with the following information:

API route specification & related_db_resources:
<route_api_specification & related_db_resources>
for this data please refer to provided task number and task list
</route_api_specification & related_db_resources>



Type definitions:
<type_definitions>
backend/schemas.py
</type_definitions>

Tech stack:
<tech_stack>
ai/tech-stack.md
</tech_stack>

Your task is to create a comprehensive implementation plan for a REST API endpoint. Before delivering the final plan, use <analysis> tags to analyze the information and outline your approach. In this analysis, ensure you:

Summarize the key points of the API specification.

List the required and optional parameters from the API specification.

List the necessary DTOs and Command Models.

Consider how to extract logic to a service (an existing one or a new one if it doesn't exist).

Plan the input data validation according to the API endpoint specification, database resources, and implementation rules.

Determine how to log errors in the error table (if applicable).

Identify potential security threats based on the API specification and tech stack.

Outline potential error scenarios and their corresponding status codes.

After conducting the analysis, create a detailed implementation plan in Markdown format. The plan should include the following sections:

Endpoint Overview

Request Details

Response Details

Data Flow

Security Considerations

Error Handling

Performance

Implementation Steps

Throughout the plan, ensure that you:

Use correct API status codes:

200 for a successful read

201 for a successful creation

400 for invalid input

401 for unauthorized access

404 for resources not found

500 for server-side errors

Adhere to the provided tech stack

Follow the given implementation rules

The final output should be a well-organized implementation plan in Markdown format and should not duplicate or repeat any work done in the analysis section.

Here is an example of what the output should look like:

# API Endpoint Implementation Plan: [Endpoint Name]

## 1. Endpoint Overview
[A brief description of the endpoint's purpose and functionality]

## 2. Request Details
-   HTTP Method: [GET/POST/PUT/DELETE]
-   URL Structure: https://www.merriam-webster.com/dictionary/pattern
-   Parameters:
    -   Required: [List of required parameters]
    -   Optional: [List of optional parameters]
-   Request Body: [Structure of the request body, if applicable]

## 3. Types Used
[DTOs and Command Models necessary for implementation]

## 3. Response Details
[Expected response structure and status codes]

## 4. Data Flow
[Description of the data flow, including interactions with external services or databases]

## 5. Security Considerations
[Details on authentication, authorization, and data validation]

## 6. Error Handling
[List of potential errors and how to handle them]

## 7. Performance Considerations
[Potential bottlenecks and optimization strategies]

## 8. Implementation Steps
1.  [Step 1]
2.  [Step 2]
3.  [Step 3]
...
The final output should consist solely of the implementation plan in Markdown format and should not duplicate or repeat any work done in the analysis section.

Remember to save your implementation plan as .ai/endpoints/[Endpoint Name]-implementation-plan.md. Ensure the plan is detailed, clear, and provides comprehensive guidance for the development team.