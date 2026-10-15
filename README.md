# Forge Hello World

This project contains a Forge app written in Javascript that displays `Hello World!` in a Confluence space page.

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Install top-level dependencies:

```
npm install
```

- Install dependencies inside of the `static/knowledgeflow` directory:

```
npm install
```

- Modify your app by editing the files in `static/knowledgeflow/src/`.

- Build your app (inside of the `static/knowledgeflow` directory):

```
npm run build
```

- Deploy your app by running:

```
forge deploy
```

- Install your app in an Atlassian site by running:

```
forge install
```

### Notes

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Incomplete Features and Limitations

### Expert Notifications

Automatic notifications to experts when relevant questions are created or assigned have not been implemented.

**Reason:** A scalable notification system should use background processing rather than depend entirely on the request-response lifecycle. Background jobs would allow notification delivery to be processed asynchronously, with better handling of retries, failures, and larger volumes of questions and recipients.

I prioritized the core question-and-answer workflow and database structure rather than implementing a notification mechanism that would need further architectural work to scale reliably.

### Potential Future Improvements

- Implement a scalable background notification mechanism.
- Add retry handling and failure monitoring for notifications.
- Improve automated test coverage and end-to-end testing.
- Add further operational monitoring and performance improvements as needed.

## Development Time Breakdown

The project was developed using Atlassian Forge, which was new to me. A significant portion of the development effort went into understanding the platform and establishing a maintainable full-stack architecture.

| Deliverable                                                                                  | Approximate time |
| -------------------------------------------------------------------------------------------- | ---------------: |
| Understanding Forge fundamentals, including Forge SQL, resolvers, REST APIs, and permissions |       [20 hours] |
| Project structure, architecture, and frontend/backend integration                            |       [10 hours] |
| Database schema and data access implementation                                               |        [1 hours] |
| Topic and expert management                                                                  |        [6 hours] |
| Question creation, topic association, and expert routing                                     |        [8 hours] |
| Answer submission and acceptance workflow                                                    |        [2 hours] |
| FAQ publishing to Confluence                                                                 |        [1 hours] |
| Frontend implementation and API integration                                                  |       [10 hours] |

The time spent learning Forge was an important part of the work because it is a full-stack platform with its own APIs, permissions model, database integration, and deployment workflow. I also spent time designing the project structure and separating frontend, resolver, service, and repository responsibilities to keep the code maintainable.

The time spent are not accruate, I make assumption when filling the slots.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
