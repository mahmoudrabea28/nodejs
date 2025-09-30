import express, { Response, RequestHandler, Request } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import crudService from './service';
import validateModel from './validator';
import extractAuthToken, { AuthenticatedRequest } from './authtoken';

/**
 * Initialze the Express server.
 */
const app = express();

/**
 * Middleware configuration.
 */
/*app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);*/

app.use(cors({
  origin: ['https://admin.testbranch.com'],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

app.use(express.json()); // parse JSON bodies
app.use(morgan('dev'));

/**
 * Middleware for all routes except login.
 */
app.use((req, res, next) => {
    if (req.path.startsWith('/auth')) {
        // Skip `extractAuthToken` for authentication routes.
        return next();
    }
    // Extract and validate auth token for other routes.
    extractAuthToken(req as AuthenticatedRequest, res, next);
});

/**
 * Authentication (Login).
 * Path: /auth/:model
 * Method: POST
 */

// رسالة صحّة واضحة JSON
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    name: 'testbranch-server-ts',
    env: process.env.VERCEL ? 'vercel' : 'local',
    time: new Date().toISOString(),
  });
});

// رسالة نصية على الجذر /
app.get('/', (_req, res) => {
  res.type('text/plain').status(200)
     .send('✅ Project deployed successfully on Vercel (Express + TS)');
});


app.post('/auth/:model', async (req, res) => {
    try {
        // Authenticate the user and return data.
        const data = await crudService.login(req.params.model, req.body);
        res.json(data);
    } catch (error: any) {
        // Handle errors and respond with a 500 status.
        res.status(500).json({ message: error.message });
    }
});

/**
 * Get all records for a model.
 * Path: /api/:model
 * Method: GET
 */
app.get('/api/:model', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Fetch all records for the given model.
        const data = await crudService.getAll(req.params.model, req.authToken || '');
        res.json(data);
    } catch (error: any) {
        // Handle errors and respond with a 500 status.
        res.status(500).json({ message: error.message });
    }
});

/**
 * Get current active user.
 * Path: /api/:fmodel/:smodel
 * Method: GET
 */
app.get('/api/:fmodel/:smodel', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Fetch the current active user.
        const data = await crudService.getCurrentUser(req.params.fmodel, req.params.smodel, req.authToken || '');
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Get a record by ID.
 * Path: /api/:model/:id
 * Method: GET
 */
app.get('/api/:model/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Fetch a record by it's ID.
        const data = await crudService.getById(req.params.model, req.params.id, req.authToken || '');
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Get members by group ID.
 * Path: /api/:fmodel/:smodel/:id
 * Method: GET
 */
app.get('/api/:fmodel/:smodel/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Fetch members of a specific group by ID.
        const data = await crudService.getMember(req.params.fmodel, req.params.smodel, req.params.id, req.authToken || '');
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Create a new record for a model.
 * Path: /api/:model
 * Method: POST
 */
app.post(
    '/api/:model',
    (req, res, next) => {
        // The create handlers have validation.
        // The validation is used with all of the create models.
        validateModel; // validate model schema
        next();
    },
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            // Create a new record for the given model.
            const data = await crudService.create(req.params.model, req.body, req.authToken || '');
            res.json(data);
        } catch (error: any) {
            console.error('Error in createHandler:', error.message || error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
);

/**
 * Update a record for a model by ID.
 * Path: /api/:model/:id
 * Method: PUT
 */
app.put('/api/:model/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Update the record for the given model and ID.
        const data = await crudService.update(req.params.model, req.params.id, req.body, req.authToken || '');
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});
 
/**
 * Update account data.
 * Path: /api/:fmodel
 * Method: PUT
 */
app.put('/api/:fmodel', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Update account data for the given model.
        const data = await crudService.updateAccount(req.params.fmodel, req.params.smodel, req.body, req.authToken || '');
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Delete a record by ID.
 * Path: /api/:model/:id
 * Method: DELETE
 */
app.delete('/api/:model/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Delete the record for the given model and ID.
        const data = await crudService.remove(req.params.model, req.params.id, req.authToken || '');
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});
// في الآخر
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4444;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}
export default app;




