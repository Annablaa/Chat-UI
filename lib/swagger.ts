export const getSwaggerSpec = () => {
  const serverUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  
  return {
    openapi: '3.0.0',
    info: {
      title: 'Chatio API',
      version: '1.0.0',
      description: 'Next.js backend API with Supabase integration',
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
                    status: {
                      type: 'string',
                      example: 'ok',
                    },
                    message: {
                      type: 'string',
                      example: 'Backend is running',
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      example: '2025-12-13T15:12:02.858Z',
                    },
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
        description: 'Test the connection to Supabase database. Requires Supabase credentials in .env.local',
        tags: ['Supabase'],
        responses: {
          '200': {
            description: 'Connection test result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Supabase connection successful!',
                    },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                      },
                    },
                    error: {
                      type: 'string',
                      example: 'Connection test - table may not exist',
                    },
                    note: {
                      type: 'string',
                      example: 'This is normal if you haven\'t created tables yet',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Error connecting to Supabase',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Error connecting to Supabase',
                    },
                    error: {
                      type: 'string',
                    },
                    check: {
                      type: 'string',
                      example: 'Make sure your .env.local file has the correct Supabase credentials',
                    },
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
        description: 'Get all users or filter by id or role. Query params: ?id=xxx or ?role=xxx',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'query',
            description: 'Filter by user ID',
            schema: { type: 'string' },
          },
          {
            name: 'role',
            in: 'query',
            description: 'Filter by role',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Users retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
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
        description: 'Create a new user',
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
          {
            name: 'id',
            in: 'query',
            required: true,
            description: 'User ID to delete',
            schema: { type: 'string' },
          },
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
    '/api/messages': {
      get: {
        summary: 'Get Messages',
        description: 'Get all messages or filter by id_message, id_chatnumb, or id_user. Query params: ?id_message=xxx or ?id_chatnumb=xxx or ?id_user=xxx',
        tags: ['Messages'],
        parameters: [
          {
            name: 'id_message',
            in: 'query',
            description: 'Filter by message ID',
            schema: { type: 'string' },
          },
          {
            name: 'id_chatnumb',
            in: 'query',
            description: 'Filter by chat number',
            schema: { type: 'string' },
          },
          {
            name: 'id_user',
            in: 'query',
            description: 'Filter by user ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Messages retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Message' },
                    },
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
        description: 'Create a new message',
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
        description: 'Update an existing message. Requires id_message in request body',
        tags: ['Messages'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/UpdateMessageDto' },
                  { type: 'object', required: ['id_message'], properties: { id_message: { type: 'string' } } },
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
        description: 'Delete a message by ID. Query param: ?id_message=xxx',
        tags: ['Messages'],
        parameters: [
          {
            name: 'id_message',
            in: 'query',
            required: true,
            description: 'Message ID to delete',
            schema: { type: 'string' },
          },
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
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          error: {
            type: 'string',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'John Doe' },
          role: { type: 'string', example: 'user' },
          description: { type: 'string', nullable: true, example: 'User description' },
        },
        required: ['id', 'name', 'role'],
      },
      CreateUserDto: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Doe' },
          role: { type: 'string', example: 'user' },
          description: { type: 'string', nullable: true, example: 'User description' },
        },
        required: ['name', 'role'],
      },
      UpdateUserDto: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Doe' },
          role: { type: 'string', example: 'user' },
          description: { type: 'string', nullable: true, example: 'User description' },
        },
      },
      Message: {
        type: 'object',
        properties: {
          id_message: { type: 'string' },
          id_chatnumb: { type: 'string', example: 'chat123' },
          id_user: { type: 'string', example: 'user123' },
          message_date: { type: 'string', format: 'date-time', example: '2025-12-13T15:12:02.858Z' },
          content: { type: 'string', example: 'Hello, this is a message' },
          is_edited: { type: 'boolean', example: false },
        },
        required: ['id_message', 'id_chatnumb', 'id_user', 'message_date', 'content', 'is_edited'],
      },
      CreateMessageDto: {
        type: 'object',
        properties: {
          id_chatnumb: { type: 'string', example: 'chat123' },
          id_user: { type: 'string', example: 'user123' },
          content: { type: 'string', example: 'Hello, this is a message' },
          message_date: { type: 'string', format: 'date-time', example: '2025-12-13T15:12:02.858Z' },
          is_edited: { type: 'boolean', example: false },
        },
        required: ['id_chatnumb', 'id_user', 'content'],
      },
      UpdateMessageDto: {
        type: 'object',
        properties: {
          id_chatnumb: { type: 'string', example: 'chat123' },
          id_user: { type: 'string', example: 'user123' },
          content: { type: 'string', example: 'Updated message content' },
          message_date: { type: 'string', format: 'date-time', example: '2025-12-13T15:12:02.858Z' },
          is_edited: { type: 'boolean', example: true },
        },
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

// Default export for backward compatibility (uses default server)
export const swaggerSpec = getSwaggerSpec()


