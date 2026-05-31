# GitPulse API

GitPulse API is a backend application built using Node.js, Express.js, MySQL, and the GitHub REST API.

The application analyzes GitHub profiles, calculates developer insights, stores profile snapshots in a MySQL database, and exposes REST API endpoints for retrieving profile analytics and leaderboard data.

## Project Overview

GitPulse was developed to explore backend development concepts such as API integration, database persistence, analytics generation and production deployment.

The application fetches public GitHub profile data, processes repository statistics, calculates custom metrics and stores the analyzed results for future retrieval.

## Features

- Analyze public GitHub profiles using a username

- Fetch profile information from the GitHub REST API

- Store analyzed profile data in a MySQL database

- Store repository-level information for analytics processing

- Calculate total stars and total forks across repositories

- Identify the top repository based on stars

- Generate a custom developer score

- Retrieve all analyzed profiles

- View a leaderboard of analyzed developers

## Additional Design Decisions

- Repository data is stored in a separate repositories table to support analytics calculations and future extensibility.

- Repository records are refreshed whenever a profile is re-analyzed to ensure analytics remain up-to-date.

- A one-to-many relational database architecture was implemented, allowing each user to maintain multiple repository records while preserving data integrity through foreign key constraints and cascading deletes.

## Tech Stack

### Backend
- `Node.js` - Runtime environment used to execute JavaScript on the server.

- `Express.js` - Web framework used to create REST API endpoints and manage request-response flow.

### Database
- `MySQL` - Relational database used to persist analyzed profile and repository data.

- `mysql2` - Driver used to connect the application with MySQL and execute parameterized queries. 

### External API
- `GitHub REST API` - Used to fetch public GitHub profile information and repository data.

### Deployment
- `Railway` - Used to deploy both the backend and MySQL database in a production environment.

### Testing
- `Postman` - Used to test API endpoints in both local and production environments.

- `Custom Test Files` - Used during development to verify application logic and service functionality.

## Development Concepts Applied

- REST API Design

- Controller-Service Architecture

- Relational Database Design

- One-to-many Relationships

- Foreign Key Constraints

- Database Connection Pooling

- Environment Variable Management

- Production Deployment

- API Testing and Validation


## Project Structure

```text
GitPulse - Github Developer Analytics API
├── src
│   ├── app.js
│   ├── controllers
│   ├── database
│   ├── routes
│   ├── services
│   └── tests
│
├── postman-collections
│
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── .gitignore
└── server.js
```

### Structure Overview

#### server.js

Application entry point responsible for starting the Express server and listening for incoming requests.

#### src/app.js

Configure the Express application, middleware and API routes.

#### src/routes

Defines API endpoints and maps incoming request to controller functions.

#### src/controllers

Handles HTTP requests and responses. Controllers coordinate communication between routes, services and the database layer.

#### src/services

Contains resuable buisness logic including Github API integration and analytics calculations.

#### src/database

Responsible for MySQL connection management and database configuration.

#### src/tests

Contains test files used to verify application functionality during development.

#### postman-collections

Stores exported Postman coollections for local and production API testing.

## Request Flow

The application follows a Controller-Service architecture to separate responsibilities and maintain clean code organization.

```text
Client Request
      │
      ▼
Routes
      │
      ▼
Controllers
      │
      ├── Github Service
      │       │
      │       ▼
      │   Github REST API
      │
      └── Analytics Service
              │
              ▼
         Calculations
              │
              ▼
        MySQL Database
              │
              ▼
        JSON Response
```

### Flow Explanation

1. The client sends a request to an API endpoint.

2. Express routes map the request to the appropriate controller.

3. The controller coordinates the application workflow.

4. Github profile and repository data are fetched through the Github Service.

5. Analytics Service processes repository data and calculates developer insights.

6. Processed data is stored in MySQL using parameterized queries.

7. The controller returns a structured JSON response to the client.

```text
This separation of concerns improves maintainability, readability, and scalability of the application.
```

## Database Schema

The application uses a relational MySQL database consisting of two tables.

### users

Stores analyzed GitHub profile information and calculated developer metrics.

Fields:

- id (Primary Key)
- github_id
- username
- name
- bio
- company
- location
- followers
- following
- public_repos
- developer_score
- created_at

### repositories

Stores repository-level information associated with analyzed users.

Fields:

- id (Primary Key)
- user_id (Foreign Key)
- repo_name
- language
- stars
- forks
- created_at
- updated_at

### Relationship

The database follows a one-to-many relationship model where a single user can have multiple repositories.

Foreign key constraints and cascading deletes are used to maintain referential integrity.

## API Endpoints

### Analyze GitHub Profile

```http
POST /api/analyze/:username
```

Analyzes a GitHub profile, calculates analytics, and stores the results in MySQL.

### Get All Profiles

```http
GET /api/profiles
```

Returns all analyzed profiles.

### Get Single Profile

```http
GET /api/profiles/:username
```

Returns information for a specific analyzed profile.

### Get Profile Analytics

```http
GET /api/profiles/:username/analytics
```

Returns analytics data for a specific profile.

### Get Leaderboard

```http
GET /api/leaderboard
```

Returns the top analyzed developers ranked by developer score.

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GitPulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory and add the required configuration values.

```env
PORT=5000

DB_HOST=localhost
DB_PORT = 3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gitpulse

GITHUB_TOKEN=your_github_token
```

> Note:
> Production environment variables were configured through Railway's environment settings and are not included in this repository.

### 4. Create the Database

Create a MySQL database:

```sql
CREATE DATABASE gitpulse;
```

### 5. Execute the Schema

Run the contents of:

```text
src/database/schema.sql
```

to create the required tables.

### 6. Start the Application

```bash
npm start
```

or

```bash
node server.js
```

### 7. Verify the Server

The API should now be available at:

```text
http://localhost:5000
```

## Testing

The API was tested in both local and production environments to verify endpoint functionality, database persistence, and analytics generation.

### Testing Tools

- Postman was used to test all API endpoints.
- Custom test files were created during development to validate service and controller functionality.
- Railway HTTP logs were used to verify production requests and responses.

### Test Scenarios

#### Profile Analysis

```http
POST /api/analyze/:username
```

Tested with multiple GitHub profiles including:

- octocat
- torvalds
- qwerty12-ai

Verified:

- GitHub API integration
- Database insertion
- Repository synchronization
- Analytics generation
- Developer score calculation

#### Profile Retrieval

```http
GET /api/profiles
```

Verified retrieval of all analyzed profiles stored in the database.

#### Single Profile Retrieval

```http
GET /api/profiles/:username
```

Verified retrieval of a specific analyzed profile.

#### Analytics Retrieval

```http
GET /api/profiles/:username/analytics
```

Verified developer analytics generation and response formatting.

#### Leaderboard

```http
GET /api/leaderboard
```

Verified ranking of analyzed developers based on calculated developer scores.

### Postman Collections

The repository includes separate Postman collections for:

- Local environment testing
- Production environment testing

These collections can be imported directly into Postman to reproduce API testing workflows.

## Deployment

The application was deployed using Railway for both backend hosting and MySQL database management.

### Production Infrastructure

- Backend API deployed on Railway.
- MySQL database hosted on Railway.
- Environment variables managed through Railway project settings.
- Database schema executed on the production database using Railway tooling.
- Production API endpoints verified through Postman, PowerShell, and Railway HTTP logs.

### Deployment Workflow

1. Push code changes to GitHub.
2. Railway automatically triggers a new deployment.
3. Environment variables are loaded into the application.
4. The application establishes a connection with the Railway MySQL database.
5. API endpoints become available through the Railway deployment URL.
6. Endpoint functionality is verified using Postman and production logs.

### Production Verification

The following endpoints were successfully verified in the production environment:

```http
POST /api/analyze/:username
GET /api/profiles
GET /api/profiles/:username
GET /api/profiles/:username/analytics
GET /api/leaderboard
```

### Deployment URL

```text
https://gitpulse-production-2582.up.railway.app/
```

The deployed API and database were tested to ensure consistent behavior between local and production environments.

## Challenges Faced

During development, several technical challenges were encountered while building, testing, and deploying the application.

### Transition from MongoDB to MySQL

Most of my previous projects used MongoDB. Building GitPulse required adapting to relational database concepts such as:

- Table design
- Foreign key constraints
- One-to-many relationships
- SQL joins and data modeling
- Schema management

This project helped strengthen my understanding of relational database architecture and MySQL workflows.

### Designing the Data Model

One challenge was determining how to store GitHub profile data and repository data efficiently.

To address this, the database was separated into two tables:

- users
- repositories

A one-to-many relationship was implemented where a single user can own multiple repositories. This improved database organization and supported future scalability.

### Repository Synchronization

When a profile is analyzed multiple times, repository information may change.

To keep analytics accurate:

- Existing repository records are removed before inserting fresh repository data.
- Repository snapshots are recreated during each analysis cycle.
- Analytics are always calculated using the latest available repository data.

### Production Deployment

Deploying the application to Railway introduced several challenges:

- Environment variable configuration
- Database connectivity
- Production debugging
- Route verification
- Local versus production behavior differences

Additional debugging was required to verify that API endpoints were functioning correctly after deployment.

### Production Testing and Debugging

During deployment, some endpoints behaved differently than expected in production.

To diagnose issues, multiple debugging approaches were used:

- Postman testing
- Railway HTTP Logs
- Railway deployment logs
- PowerShell HTTP requests

This process improved my understanding of backend debugging and production troubleshooting.

### Key Lessons Learned

This project provided hands-on experience with:

- REST API development
- Third-party API integration
- Relational database design
- MySQL connection pooling
- Environment variable management
- Production deployment workflows
- Backend testing and debugging

## Future Improvements

Potential enhancements that could be added in future versions include:

- Caching GitHub API responses to reduce repeated API requests.

- Scheduled profile refresh jobs using cron-based background tasks.

- Advanced developer analytics such as language distribution, repository activity trends, and contribution insights.

- Pagination and filtering support for profile and leaderboard endpoints.

- Repository-specific analytics endpoints.

- API rate limiting to improve service reliability.

- Docker containerization for simplified deployment and environment consistency.

- Migration to TypeScript for improved type safety and maintainability.

- CI/CD automation using GitHub Actions for automated testing and deployment pipelines.

- Expanded testing coverage with automated integration and unit tests.

## Author

**Mohd Abdul Sabeeh**

- GitHub: [qwerty12-ai](https://github.com/qwerty12-ai/)
- LinkedIn: [Mohd Abdul Sabeeh](https://www.linkedin.com/in/mohd-abdul-sabeeh-38429a2ba)
- Email: sabeehmohd79@gmail.com
- Alternate Email: sabeeh.abdul@outlook.com

## License

This project is licensed under the MIT License.

See the [LICENSE](http://github.com/qwerty12-ai/GitPulse/blob/main/LICENSE) file for more information.

## Acknowledgements

- GitHub REST API
- Railway
- MySQL
- Node.js
- Express.js
- Postman

Special thanks to the open-source ecosystem for providing the tools and documentation that supported the development and deployment of this project.