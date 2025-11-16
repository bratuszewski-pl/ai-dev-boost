---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles', 'runCommands']
description: 'generate ui-plan based on prd, api plan and ui planning session summary'
---
You are a skilled frontend architect tasked with creating a comprehensive user interface architecture based on a Product Requirements Document (PRD), an API plan, and notes from a planning session. Your goal is to design a UI structure that effectively meets product requirements, aligns with API capabilities, and incorporates insights from the planning session.

First, you will meticulously review the following documents:

Product Requirements Document (PRD):
<prd>
ai\prd.md
</prd>

API Plan:
<api_plan>
ai\api-plan.md
</api_plan>
</api_plan>

Session Notes:
<session_notes>
ai\ui-planning-summary.md
</session_notes>

Your task is to produce a detailed user interface architecture that includes the necessary views, user journey mapping, navigation structure, and key elements for each view. The design should account for user experience, accessibility, and security.

Follow these steps to complete the task:

Thoroughly analyze the PRD, API plan, and session notes.

Extract and list the key requirements from the PRD.

Identify and list the main API endpoints and their purposes.

Create a list of all necessary views based on the PRD, API plan, and session notes.

Determine the main purpose and key information for each view.

Plan the user journey between views, including a step-by-step breakdown for the main use case.

Design the navigation structure.

Propose key UI elements for each view, considering UX, accessibility, and security.

Consider potential edge cases or error states.

Ensure the UI architecture is consistent with the API plan.

Review and map all user stories from the PRD to the UI architecture.

Clearly map requirements to UI elements.

Consider potential user pain points and how the UI solves them.

For each major step, work inside <ui_architecture_planning> tags within a thinking block to break down your thought process before moving to the next step. It's okay for this section to be quite long.

Present the final UI architecture in the following Markdown format:

Markdown

# UI Architecture for [Product Name]

## 1. UI Structure Overview

[Provide a high-level overview of the UI structure]

## 2. Views List

[For each view, provide:
- View Name
- View Path
- Main Purpose
- Key Information to Display
- Key View Components
- UX, Accessibility, and Security Considerations]

## 3. User Journey Map

[Describe the flow between views and key user interactions]

## 4. Navigation Layout and Structure

[Explain how users will navigate between views]

## 5. Key Components

[List and briefly describe key components that will be used across multiple views].
Focus exclusively on the UI architecture, user journey, navigation, and key elements for each view. Do not include implementation details, specific visual design, or code examples unless they are crucial for understanding the architecture.

The final output should consist solely of the UI architecture in the specified Markdown format in Polish, which you will save to a file named .ai/ui-plan.md. Do not duplicate or repeat any work done in the thinking block.