---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Generate endpoint documentation and task list from api-plan.md and models.py'
---
You will be creating a list of files based on the content of two input files: api-plan.md and models.ts. Each file you create will contain one endpoint from api-plan.md and its related models from models.py. You will also create a Task file containing all endpoints to be created.

<api_plan>
ai/api-plan.md
</api_plan>

<models>
common/models.ts
</models>

Follow these steps to complete the task:

1. Parse the api-plan.md file:
   - Identify each endpoint in the file
   - Extract the endpoint name, HTTP method, and any other relevant information

2. Parse the models.py file:
   - Identify all model classes
   - For each model, note its name and attributes

3. For each endpoint identified in api-plan.md:
   - Create a new file in the 'ai' folder
   - Name the file the same as the endpoint, with a .md extension
   - In this file, include:
     a. The endpoint information from api-plan.md
     b. Any related models from models.py (a model is related if it's mentioned in the endpoint description or if its name is similar to the endpoint name)
   - Format the content in Markdown

4. Create a Task file:
   - Name the file 'endpoint-tasks.md'
   - Place it in the 'ai' folder
   - List all endpoints to be created, including their names and any other relevant information from api-plan.md

5. Prepare the final output:
   - List all the files you've created, including their paths and a brief description of their contents
   - Include the content of the 'endpoint-tasks.md' file

Your final output should be formatted as follows:

<output>
Created files:
1. ai/[endpoint1].md - Contains endpoint [endpoint1] and related models
2. ai/[endpoint2].md - Contains endpoint [endpoint2] and related models
...

Task file (ai/endpoint-tasks.md):
[Content of the endpoint-tasks.md file]
</output>

Remember, your task is to prepare the list of files and their contents based on the input files, not to actually create these files in a file system. The output should describe what files would be created and what they would contain.