---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles', 'runCommands']
description: 'Generate DTOs and Command Models'
---
You are a skilled Typescript developer tasked with creating Pydantic models for DTOs (Data Transfer Objects) and Command Models for a Fastify application. Your job is to analyze the provided database model definitions and API plan, and then create the appropriate Pydantic model classes that accurately represent the data structures required by the API while maintaining a connection to the underlying database models.

First, carefully review the following project files:

Database Models:
<database_models>
backend/models.py
</database_models>

API Plan (containing the DTOs defined):
<api_plan>
ai/api-plan.md
</api_plan>

Your task is to create the Pydantic model definitions for the DTOs and Command Models specified in the API plan, ensuring they are derived from the database models. Follow these steps:

Analyze the database models and the API plan.

Create the DTO and Command Model classes based on the API plan, leveraging the database entity definitions.

Ensure consistency between the DTOs and Command Models and the API requirements.

Apply appropriate Pydantic features like validators, Field constraints, and inheritance to create, narrow, or extend models as needed.

Perform a final check to ensure all DTOs are accounted for and correctly linked to the entity definitions.

Before creating the final output, work inside the <dto_analysis> tags in your thought block to show your thought process and ensure all requirements are met. In your analysis:

List all DTOs and Command Models defined in the API plan, numbering each one.

For each DTO and Command Model:

Identify the corresponding database entities and any necessary field transformations.
Describe the Pydantic features you plan to use (validators, Field constraints, inheritance, etc.).
Create a brief sketch of the DTO and Command Model structure.
Explain how you will ensure that each DTO and Command Model is directly or indirectly linked to the entity model definitions.
After completing the analysis, provide the final DTO and Command Model Pydantic class definitions to be put in the backend/schemas.ts file. Use clear and descriptive names for your models, and add docstrings to explain complex validations or non-obvious relationships.

Requirements:

Ensure all DTOs and Command Models defined in the API plan are included.
Every DTO and Command Model should directly relate to one or more database entities.
Use Pydantic features like Field(), custom validators, inheritance, and model configuration as necessary.
Add comprehensive docstrings to clarify complex or non-obvious model relationships.
Follow FastAPI best practices for request/response models with proper validation.
Use appropriate Python type hints including Optional, Union, List, etc.
Implement proper error handling with custom validators where needed.
The final output should consist solely of the DTO and Command Model Pydantic class definitions, which you will write to a file called backend/schemas.ts, without duplicating or re-performing any of the work done in the thought block.

Example of fasftify schema: 

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}