---
mode: 'agent'
model: claude-sonnet-4
description: 'Generate PRD'
---
You are an experienced product manager tasked with creating a comprehensive Product Requirements Document (PRD) based on the descriptions below:

<project_description>
[INITIAL.md](../../ai/INITIAL.md)
</project_description>

<project_details>
[INITIAL.md](../../ai/planning.md)
</project_details>

Follow these steps to create a complete and well-structured document:

Divide the PRD into the following sections:
a. Project Overview
b. User Problem
c. Functional Requirements
d. Project Boundaries
e. User Stories
f. Success Metrics

In each section, provide detailed and relevant information based on the project description and answers to clarifying questions. Make sure to:

Use clear and concise language

Provide specific details and data where needed

Maintain consistency throughout the document

Address all points listed in each section

When creating user stories and acceptance criteria:

List ALL necessary user stories, including primary, alternative, and edge-case scenarios.

Assign a unique requirement ID (e.g., US-001) to each user story for direct traceability.

Include at least one user story specifically for secure access or authentication if the application requires user identification or access restrictions.

Ensure that no potential user interaction is omitted.

Ensure that each user story is testable.

Use the following structure for each user story:

ID

Title

Description

Acceptance Criteria

Once the PRD is complete, review it against this checklist:

Is every user story testable?

Are the acceptance criteria clear and specific?

Do we have enough user stories to build a fully functional application?

Have we included authentication and authorization requirements (if applicable)?

PRD formatting:

Keep formatting and numbering consistent.

Do not use bold formatting in markdown (**).

List ALL user stories.

Format the PRD in correct markdown.

Prepare the PRD with the following structure:


# Product Requirements Document (PRD) - {{app-name}}
## 1. Product Overview
## 2. User Problem
## 3. Functional Requirements
## 4. Product Boundaries
## 5. User Stories
## 6. Success Metrics
Make sure each section contains detailed, relevant information based on the project description and our clarifying questions. Ensure the PRD is thorough, clear, and includes all critical information needed for further product development.

The final output should consist only of the PRD in the specified markdown format, saved in the .ai/prd.md file.

