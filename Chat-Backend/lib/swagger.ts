export const getSwaggerSpec = () => {
  const serverUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  
  return {
    openapi: '3.0.0',
    info: {
      title: 'Chatio API',
      version: '2.0.0',
      description: 'Next.js backend API with Supabase integration - Chat application backend',
    },
    servers: [
      {
        url: serverUrl,
        description: 'API Server',
      },
    ],
    paths: {
      '/api/health': {
        get: {
          summary: 'Health Check',
          description: 'Check if the backend server is running',
          tags: ['Health'],
          responses: {
            '200': {
              description: 'Server is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      message: { type: 'string', example: 'Backend is running' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/test': {
        get: {
          summary: 'Test Supabase Connection',
          description: 'Test the connection to Supabase database',
          tags: ['Supabase'],
          responses: {
            '200': {
              description: 'Connection test result',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { type: 'array', items: { type: 'object' } },
                      connectionStatus: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/users': {
        get: {
          summary: 'Get Users',
          description: 'Get all users or filter by id, username, or email',
          tags: ['Users'],
          parameters: [
            { name: 'id', in: 'query', schema: { type: 'string' }, description: 'Filter by user ID' },
            { name: 'username', in: 'query', schema: { type: 'string' }, description: 'Filter by username' },
            { name: 'email', in: 'query', schema: { type: 'string' }, description: 'Filter by email' },
          ],
          responses: {
            '200': {
              description: 'Users retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                      count: { type: 'number' },
                    },
                  },
                },
              },
            },
            '404': { $ref: '#/components/responses/NotFound' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        post: {
          summary: 'Create User',
          description: 'Create a new user. ID is auto-generated as UUID',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUserDto' },
              },
            },
          },
          responses: {
            '201': {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        put: {
          summary: 'Update User',
          description: 'Update an existing user. Requires id in request body',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/UpdateUserDto' },
                    { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
                  ],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'User updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '404': { $ref: '#/components/responses/NotFound' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        delete: {
          summary: 'Delete User',
          description: 'Delete a user by ID. Query param: ?id=xxx',
          tags: ['Users'],
          parameters: [
            { name: 'id', in: 'query', required: true, schema: { type: 'string' }, description: 'User ID to delete' },
          ],
          responses: {
            '200': {
              description: 'User deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
      },
      '/api/conversations': {
        get: {
          summary: 'Get Conversations',
          description: 'Get all conversations or filter by id or type',
          tags: ['Conversations'],
          parameters: [
            { name: 'id', in: 'query', schema: { type: 'string' }, description: 'Filter by conversation ID' },
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['channel', 'person'] }, description: 'Filter by type' },
          ],
          responses: {
            '200': {
              description: 'Conversations retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/Conversation' } },
                      count: { type: 'number' },
                    },
                  },
                },
              },
            },
            '404': { $ref: '#/components/responses/NotFound' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        post: {
          summary: 'Create Conversation',
          description: 'Create a new conversation. ID is auto-generated as UUID',
          tags: ['Conversations'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateConversationDto' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Conversation created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Conversation' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        put: {
          summary: 'Update Conversation',
          description: 'Update an existing conversation. Requires id in request body',
          tags: ['Conversations'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/UpdateConversationDto' },
                    { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
                  ],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Conversation updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Conversation' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '404': { $ref: '#/components/responses/NotFound' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        delete: {
          summary: 'Delete Conversation',
          description: 'Delete a conversation by ID. Query param: ?id=xxx',
          tags: ['Conversations'],
          parameters: [
            { name: 'id', in: 'query', required: true, schema: { type: 'string' }, description: 'Conversation ID to delete' },
          ],
          responses: {
            '200': {
              description: 'Conversation deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
      },
      '/api/messages': {
        get: {
          summary: 'Get Messages',
          description: 'Get all messages or filter by id, conversation_id, or author_id',
          tags: ['Messages'],
          parameters: [
            { name: 'id', in: 'query', schema: { type: 'string' }, description: 'Filter by message ID' },
            { name: 'conversation_id', in: 'query', schema: { type: 'string' }, description: 'Filter by conversation ID' },
            { name: 'author_id', in: 'query', schema: { type: 'string' }, description: 'Filter by author ID' },
          ],
          responses: {
            '200': {
              description: 'Messages retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/Message' } },
                      count: { type: 'number' },
                    },
                  },
                },
              },
            },
            '404': { $ref: '#/components/responses/NotFound' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        post: {
          summary: 'Create Message',
          description: 'Create a new message. ID is auto-generated as UUID',
          tags: ['Messages'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateMessageDto' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Message created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Message' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        put: {
          summary: 'Update Message',
          description: 'Update an existing message. Requires id in request body',
          tags: ['Messages'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/UpdateMessageDto' },
                    { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
                  ],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Message updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Message' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '404': { $ref: '#/components/responses/NotFound' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        delete: {
          summary: 'Delete Message',
          description: 'Delete a message by ID. Query param: ?id=xxx',
          tags: ['Messages'],
          parameters: [
            { name: 'id', in: 'query', required: true, schema: { type: 'string' }, description: 'Message ID to delete' },
          ],
          responses: {
            '200': {
              description: 'Message deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
      },
      '/api/search': {
        post: {
          summary: 'Semantic Search',
          description: 'Search messages using semantic similarity (vector search). How it works: 1) Converts the search query text into a vector embedding using AI, 2) Compares the query embedding with message embeddings using cosine similarity, 3) Returns messages with similarity scores above the threshold, 4) Optionally enhances results with AI-generated summary. Features: Uses pgvector for efficient vector similarity search (if available), falls back to in-memory cosine similarity calculation if RPC function is unavailable, AI-enhanced summaries provide context about search results, handles edge cases (no results, threshold too high, etc.). Note: Messages must have embeddings to be searchable. Use /api/messages/backfill to add embeddings to existing messages.',
          tags: ['Search'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SearchRequest' },
                example: {
                  query: 'What was decided about payment limits?',
                  limit: 10,
                  threshold: 0.4
                }
              },
            },
          },
          responses: {
            '200': {
              description: 'Search completed successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SearchResponse' },
                  example: {
                    query: 'What was decided about payment limits?',
                    results: [
                      {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        conversation_id: '550e8400-e29b-41d4-a716-446655440001',
                        author_id: '550e8400-e29b-41d4-a716-446655440002',
                        content: 'For standard accounts, I\'d suggest a $10,000 daily limit.',
                        created_at: '2024-01-15T10:30:00Z',
                        similarity: 0.8542
                      }
                    ],
                    count: 5,
                    summary: 'These messages discuss payment validation requirements and transaction limits for different account types.'
                  }
                },
              },
            },
            '400': { 
              description: 'Bad request - query is missing or invalid',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Search query is required and must be a non-empty string' }
                    }
                  }
                }
              }
            },
            '500': { 
              description: 'Server error - embedding generation failed or database error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Failed to generate embedding for search query' },
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
          },
        },
      },
      '/api/messages/backfill': {
        get: {
          summary: 'Get Backfill Statistics',
          description: 'Get statistics about messages that need embeddings. Returns counts of messages with and without embeddings.',
          tags: ['Messages'],
          responses: {
            '200': {
              description: 'Statistics retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/BackfillStats' },
                },
              },
            },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        post: {
          summary: 'Backfill Embeddings',
          description: 'Add embeddings to existing messages that don\'t have them. Processes messages in batches to avoid rate limiting.',
          tags: ['Messages'],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BackfillRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Backfill completed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/BackfillResponse' },
                },
              },
            },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
      },
      '/api/tasks': {
        get: {
          summary: 'Get Tasks',
          description: 'Get all tasks or filter by id, status, proposed_by, or message_id',
          tags: ['Tasks'],
          parameters: [
            { name: 'id', in: 'query', schema: { type: 'string' }, description: 'Filter by task ID' },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'confirmed', 'rejected'] }, description: 'Filter by status' },
            { name: 'proposed_by', in: 'query', schema: { type: 'string' }, description: 'Filter by user ID who proposed the task' },
            { name: 'message_id', in: 'query', schema: { type: 'string' }, description: 'Filter by message ID' },
          ],
          responses: {
            '200': {
              description: 'Tasks retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                      count: { type: 'number' },
                    },
                  },
                },
              },
            },
            '404': { $ref: '#/components/responses/NotFound' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        post: {
          summary: 'Create Task',
          description: 'Create a new task. ID is auto-generated as UUID',
          tags: ['Tasks'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateTaskDto' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Task created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Task' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        put: {
          summary: 'Update Task',
          description: 'Update an existing task. Requires id in request body',
          tags: ['Tasks'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/UpdateTaskDto' },
                    { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
                  ],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Task updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Task' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '404': { $ref: '#/components/responses/NotFound' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
        delete: {
          summary: 'Delete Task',
          description: 'Delete a task by ID. Query param: ?id=xxx',
          tags: ['Tasks'],
          parameters: [
            { name: 'id', in: 'query', required: true, schema: { type: 'string' }, description: 'Task ID to delete' },
          ],
          responses: {
            '200': {
              description: 'Task deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/ServerError' },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            display_name: { type: 'string', example: 'John Doe' },
            avatar_url: { type: 'string', nullable: true, example: 'https://example.com/avatar.jpg' },
            created_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'username', 'email', 'display_name'],
        },
        CreateUserDto: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            display_name: { type: 'string', example: 'John Doe' },
            avatar_url: { type: 'string', nullable: true, example: 'https://example.com/avatar.jpg' },
          },
          required: ['username', 'email', 'display_name'],
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            display_name: { type: 'string', example: 'John Doe' },
            avatar_url: { type: 'string', nullable: true },
          },
        },
        Conversation: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            name: { type: 'string', example: 'General Chat' },
            type: { type: 'string', enum: ['channel', 'person'], example: 'channel' },
            avatar_url: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'type'],
        },
        CreateConversationDto: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'General Chat' },
            type: { type: 'string', enum: ['channel', 'person'], example: 'channel' },
            avatar_url: { type: 'string', nullable: true },
          },
          required: ['name', 'type'],
        },
        UpdateConversationDto: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'General Chat' },
            type: { type: 'string', enum: ['channel', 'person'] },
            avatar_url: { type: 'string', nullable: true },
          },
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            conversation_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
            author_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
            content: { type: 'string', example: 'Hello, this is a message' },
            is_ai: { type: 'boolean', example: false },
            task_proposal: { type: 'object', nullable: true, description: 'JSONB field' },
            search_result: { type: 'object', nullable: true, description: 'JSONB field' },
            embedding: { type: 'array', items: { type: 'number' }, nullable: true, description: '768-dimensional vector embedding for semantic search' },
            created_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'conversation_id', 'author_id', 'content', 'is_ai'],
        },
        CreateMessageDto: {
          type: 'object',
          properties: {
            conversation_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
            author_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
            content: { type: 'string', example: 'Hello, this is a message' },
            is_ai: { type: 'boolean', example: false },
            task_proposal: { type: 'object', nullable: true },
            search_result: { type: 'object', nullable: true },
          },
          required: ['conversation_id', 'author_id', 'content'],
          description: 'Note: Embedding is automatically generated when message is created. If embedding generation fails, the message is still created without embedding.',
        },
        UpdateMessageDto: {
          type: 'object',
          properties: {
            conversation_id: { type: 'string' },
            author_id: { type: 'string' },
            content: { type: 'string' },
            is_ai: { type: 'boolean' },
            task_proposal: { type: 'object', nullable: true },
            search_result: { type: 'object', nullable: true },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            message_id: { type: 'string', nullable: true },
            task_id: { type: 'string', nullable: true },
            action: { type: 'string', enum: ['create', 'update', 'comment'], example: 'create' },
            summary: { type: 'string', example: 'Implement user authentication' },
            details: { type: 'string', nullable: true, example: 'Add login and signup functionality' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'rejected'], example: 'pending' },
            proposed_by: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
            created_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'action', 'summary', 'status', 'proposed_by'],
        },
        CreateTaskDto: {
          type: 'object',
          properties: {
            message_id: { type: 'string', nullable: true },
            task_id: { type: 'string', nullable: true },
            action: { type: 'string', enum: ['create', 'update', 'comment'], example: 'create' },
            summary: { type: 'string', example: 'Implement user authentication' },
            details: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['pending', 'confirmed', 'rejected'], example: 'pending' },
            proposed_by: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
          },
          required: ['action', 'summary', 'proposed_by'],
        },
        UpdateTaskDto: {
          type: 'object',
          properties: {
            message_id: { type: 'string', nullable: true },
            task_id: { type: 'string', nullable: true },
            action: { type: 'string', enum: ['create', 'update', 'comment'] },
            summary: { type: 'string' },
            details: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['pending', 'confirmed', 'rejected'] },
            proposed_by: { type: 'string' },
          },
        },
        SearchRequest: {
          type: 'object',
          properties: {
            query: { 
              type: 'string', 
              example: 'What was decided about payment limits?', 
              description: 'Search query text. Will be converted to an embedding for semantic search. Supports natural language queries.',
              minLength: 1
            },
            limit: { 
              type: 'number', 
              example: 10, 
              default: 10, 
              description: 'Maximum number of results to return. Default: 10',
              minimum: 1,
              maximum: 100
            },
            threshold: { 
              type: 'number', 
              example: 0.4, 
              default: 0.4, 
              description: 'Minimum cosine similarity score (0-1) for results. Higher values return more relevant but fewer results. If no results match threshold, top results are returned anyway. Default: 0.4',
              minimum: 0,
              maximum: 1
            },
          },
          required: ['query'],
        },
        SearchResult: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            conversation_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
            author_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
            content: { type: 'string', example: 'For standard accounts, I\'d suggest a $10,000 daily limit.' },
            created_at: { type: 'string', format: 'date-time' },
            similarity: { type: 'number', example: 0.85, description: 'Cosine similarity score (0-1)' },
          },
          required: ['id', 'conversation_id', 'author_id', 'content', 'similarity'],
        },
        SearchResponse: {
          type: 'object',
          properties: {
            query: { 
              type: 'string', 
              example: 'What was decided about payment limits?',
              description: 'The original search query'
            },
            results: { 
              type: 'array', 
              items: { $ref: '#/components/schemas/SearchResult' },
              description: 'Array of matching messages sorted by similarity (highest first)'
            },
            count: { 
              type: 'number', 
              example: 5, 
              description: 'Number of results returned'
            },
            summary: { 
              type: 'string', 
              example: 'These messages discuss payment validation requirements and transaction limits for different account types.', 
              description: 'AI-generated summary of the search results. Generated using Google AI to provide context about the matched messages. Optional - may not be present if AI enhancement fails or is unavailable.',
              nullable: true
            },
            warning: { 
              type: 'string', 
              description: 'Warning message if results were adjusted (e.g., when no results match the threshold, top results are returned anyway). Optional.',
              nullable: true,
              example: 'No results found with similarity >= 0.4. Showing top results.'
            },
          },
          required: ['query', 'results', 'count'],
        },
        BackfillRequest: {
          type: 'object',
          properties: {
            batchSize: { type: 'number', example: 10, default: 10, description: 'Number of messages to process in each batch' },
            limit: { type: 'number', example: 100, description: 'Maximum number of messages to process (optional)' },
          },
        },
        BackfillResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Backfill completed' },
            processed: { type: 'number', example: 95, description: 'Number of messages successfully processed' },
            errors: { type: 'number', example: 5, description: 'Number of messages that failed to process' },
            total: { type: 'number', example: 100, description: 'Total number of messages processed' },
            errorDetails: { type: 'array', items: { type: 'string' }, description: 'Detailed error messages (if any)' },
          },
          required: ['message', 'processed', 'errors', 'total'],
        },
        BackfillStats: {
          type: 'object',
          properties: {
            withoutEmbeddings: { type: 'number', example: 50, description: 'Number of messages without embeddings' },
            total: { type: 'number', example: 200, description: 'Total number of messages' },
            withEmbeddings: { type: 'number', example: 150, description: 'Number of messages with embeddings' },
          },
          required: ['withoutEmbeddings', 'total', 'withEmbeddings'],
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  error: { type: 'string' },
                },
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        ServerError: {
          description: 'Server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  error: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }
}

// Default export for backward compatibility
export const swaggerSpec = getSwaggerSpec()
