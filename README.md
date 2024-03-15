# BackTS - The TypeScript Backoffice Framework

⚠️ **Note: This project is currently under development and not ready for production use.**


[![License](https://img.shields.io/badge/license-ISC-blue.svg)](ISC)

## Introduction

This project is an opinionated framework aimed at simplifying the development of backoffices in TypeScript. By leveraging a modern, serverless architecture and Google Cloud's robust tools, it offers a comprehensive solution for quickly building scalable, efficient backoffice applications.


## Key technologies

This framework strongly relies in Google Cloud. Basically because:
- It provides one of the best developer experiences.
- It has unique components like BigQuery and Firestore, which allows great scalability with pay-as-you-go pricing.

The following is a list of the key technologies we plan to use:

- **Authentication**: Firebase Authentication
- **Database**: Firestore (Real-time, scalable, serverless). Also in the plan is to suport relational databases like Cloud SQL as we understand that not all applications can be built with NoSQL databases.
- **Analytics**: BigQuery
- **Serverless Functions**: Cloud Run
- **Scheduling**: Cloud Scheduler
- **Secrets Management**: Secret Manager
- **Server Environment**: Focused on Node.js to ensure compatibility with Google SDKs, despite an interest in exploring modern solutions like Deno or Bun when they become more mature.

## Roadmap

Our framework is designed to include a comprehensive set of features necessary for any backoffice application, which are currently under development:

### Prio 1

- **Monorepo**: Use a monorepo structure to manage the entire project. This allows code sharing at the same time that is imposes strict boundaries between different parts of the application.
- **RPC**: Implement a robust RPC mechanism for serverless functions, strongly typed and easy to use.
- **Secure Frontend**: Ensure the frontend is private and not hosted on public CDNs.
- **Data Validation**: Implement robust validation using tools such as Zod, Yup, or Joi.
- **Domain Modeling**: Define entities and schemas clearly.
- **Intuitive UI**: Design an easy-to-navigate menu and user interface.
- **Search**: Implement powerful search capabilities to easily navigate data.

### Prio 2

- **Task Scheduling**: Incorporate scheduling capabilities for recurring tasks.
- **Data Flow Management**: Establish clear data flow and dependencies.
- **Real-Time Notifications**: Provide immediate feedback and notifications.
- **Efficient Data Loading**: Optimize data loading mechanisms.
- **Monitoring and Analytics**: Integrate monitoring and analytics for insight into operations.

### Prio 3

- **AI/Assistants**: Leverage AI to enhance user interaction and data management.

### Prio 4
- **VSCode Extension**: Develop an extension for VSCode to streamline the development process further.
