---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Implement a frontend view based on the provided implementation plan and rules'
---
Your task is to implement a frontend view based on a given implementation plan and implementation rules. Your goal is to create a detailed and accurate implementation that is consistent with the provided plan, correctly represents the component structure, integrates with the API, and handles all specified user interactions.

First, review the implementation plan:

<implementation_plan>
refer to provided implementation plan
</implementation_plan>

Now, review the implementation rules:

Review the defined types:

<types>
backend/schemas.py
</types>

Implement the plan according to the following approach:

<implementation_approach>
Implement a maximum of 3 steps from the implementation plan, briefly summarize what you have done, and describe the plan for the next 3 actions - stop work at this point and wait for my feedback.
</implementation_approach>

Carefully analyze the implementation plan and rules. Pay special attention to the component structure, API integration requirements, and user interactions described in the plan.

Initialize React app acording to UI plan. Create a relevant folder structure. add all nessesary dependencies. All files should be stored in folder 'frontend'

Follow these steps to implement the frontend view:

Component Structure:
   - Identify all components listed in the implementation plan.
   - Create a hierarchical structure of these components.
   - Ensure that the responsibilities and relationships of each component are clearly defined.

API Integration:
   - Identify all API endpoints listed in the plan.
   - Implement the necessary API calls for each endpoint.
   - Handle API responses and update the component state accordingly.

User Interactions:
   - List all user interactions specified in the implementation plan.
   - Implement event handlers for each interaction.
   - Ensure that each interaction triggers the appropriate action or state change.

State Management:
   - Identify the required state for each component.
   - Implement state management using an appropriate method (local state, custom hook, shared state).
   - Ensure that state changes trigger the necessary re-rendering.

Styling and Layout:
   - Apply the specified styling and layout as mentioned in the implementation plan.
   - Ensure responsiveness if required by the plan.

Error Handling and Edge Cases:
   - Implement error handling for API calls and user interactions.
   - Consider and handle potential edge cases listed in the plan.

Performance Optimization:
   - Implement any performance optimizations specified in the plan or rules.
   - Ensure efficient rendering and a minimum number of unnecessary re-renders.

Testing:
   - If specified in the plan, implement unit tests for components and functions.
   - Thoroughly test all user interactions and API integrations.

Throughout the entire implementation process, you must strictly adhere to the provided implementation rules. These rules take precedence over any general best practices that may conflict with them.

Ensure that your implementation accurately reflects the provided implementation plan and complies with all specified rules. Pay special attention to the component structure, API integration, and handling of user interactions.