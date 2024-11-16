# Deploying a Microservice Architecture on Azure with Secure ELK Logging
Implement a scalable microservices architecture with secure frontend-backend integration via API Management, centralized logging with ELK for effective monitoring, CosmosDB for data storage and automated infrastructure provisioning and deployment using Bicep and CI/CD pipelines.

<img width="850" alt="Cloud Architecture Diagram" src="https://github.com/user-attachments/assets/98874ae7-f3d7-477f-ab6f-51d15ed17a60">

## Key Components of the Architecture
- **Bicep** : An Azure-native infrastructure-as-code language, simplifies infrastructure provisioning and allows easy tracking, updating, and deployment of services.
- **Azure DevOps**: Utilized as the CI/CD tool for automating the development and deployment processes.
- **Azure App Service:** Hosted the React frontend on App Service deployed via Docker images.
- **Azure Container Registry:** Used store the docker images.
- **Azure Function App:** Deployed Node.js microservices as Azure functions, each handling a specific service independently.
- **Azure Cosmos DB:** Utilized Cosmos DB as database providing a managed, scalable NoSQL database solution for storing app data.
- **Azure API Gateway:** Secures and manages API access to the backend services.
- **Logging and Monitoring:** Used Elastic Search and Kibana for monitoring. Collects and visualizes backend logs, enabling real-time monitoring and troubleshooting. Deployed on **Azure VM** via docker-compose and utilized certificates for secure connection.

## Application Overview
SimpleNote is a note-taking microservice application with the following features:
- User authentication and authorization
- CRUD operations for notes

<img width="850" alt="SimpleNote Application Architecture Diagram" src="https://github.com/user-attachments/assets/c1e24514-e74c-448d-b450-25eb13511dae">

**Backend Microservices:**
- User Service : performs authentication
- Notes Service : performs CRUD operation on notes

**Tech Stack** : 
- Frontend : React
- Backend : Node.js, Express.js
- Database : MongoDB

## Implementation Steps

### Step 1: Provision Infrastructure Using Bicep Templates
Using Bicep templates, streamline the creation of Azure resources. 

1. **Define Infrastructure Resources**: Use Bicep to define all the required resources .
2. **Deploy with CI/CD Pipeline**: Set up a pipeline in Azure DevOps to automate infrastructure provisioning, ensuring consistency and repeatability.
--- 

### Step 2: Deploying the Frontend to Azure App Service
The frontend application, developed in React, is containerized with Docker for easy deployment and scaling. Deployed it on Azure App Service through CI/CD:
1. **Create a Docker Image**: Build the Docker image for the React app.
2. **Push to ACR**: Push the Docker image to Azure Container Registry.
3. **Deploy to App Service**: Deploy the image from ACR to Azure App Service.
---

### Step 3: Deploying Backend Microservices on Azure Functions
Each Node.js microservice is deployed as a standalone Azure Function, offering scalability and independence for each service.

1. **Organize Microservices**:
    - Place each service in a separate repository/directory for flexible, independent deployment pipelines.
    - Configure each service as an Azure Function.
2. **Set Up CI/CD Pipelines**:
    - Create an Azure DevOps pipeline for each microservice to build and deploy the code to Azure Functions.
---

### Step 4: Securing API Traffic with Azure API Management (APIM)
Using APIM, secure backend microservices, preventing direct access from the front end. APIM offers a unified endpoint for all services, manages security, and enables load control.

 - **Define API Routes and Security Policies**: Set up API routes in APIM and enforce security policies to control access and manage API traffic securely.

---
### Step 5: Cosmos DB integration
Integrate database with backend services by passing the Cosmos connection string.
---

### Step 6: Implementing Secure ELK Logging on Azure VM
Deploy ELK (Elasticsearch and Kibana) to centralize logging on an Azure VM using Docker Compose. Enabling SSL/TLS security on ELK ensures encrypted data transmission to and from the logging system. As logs are sent directly to Elasticsearch, Logstash is not required in this setup. Docker and Docker Compose are pre-installed on the VM via bicep.

1. **Deploy Elasticsearch and Kibana on the VM**:
- Follow the [Elasticsearch documentation](https://www.elastic.co/blog/getting-started-with-the-elastic-stack-and-docker-compose) for deployment. This involves creating a docker-compose.yml file and a .env file (to store required environment variables). And use 3 containers: one for creating certificates (for security), one for Elasticsearch, and one for Kibana.
2. **Pushing Logs from Backend Microservices to Elasticsearch**:
- To connect securely from the application to Elasticsearch, we generated an SSL/TLS certificate (`ca.crt`) and a Certificate Authority (CA) fingerprint.
- To obtain the CA fingerprint, use the following command (as per the [ELK documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html#authentication)):

    ```bash
        # Generate CA certificate
        docker cp elasticsearch:/usr/share/elasticsearch/config/certs/http_ca.crt .

        # Generate CA fingerprint
        openssl x509 -fingerprint -sha256 -noout -in /path/to/http_ca.crt
    ```
- The generated certificate and CA fingerprint are then passed to the backend microservices, enabling them to securely push logs to Elasticsearch.


---
### Architecture Features & Security

| **Key Features** | **Security Measures** |
|----------|-----------|
|  Scalable Microservices | SSL/TLS Encryption | 
| Secure API Gateway | API Authentication |
| Automated Deployments | Network Security Groups |
| Centralized Monitoring |
| Cloud-native Storage | 

## References
- [Azure DevOps for Bicep deployment](https://learn.microsoft.com/en-us/training/modules/build-first-bicep-deployment-pipeline-using-azure-pipelines/4-deploy-bicep-files-pipeline)
- [Azure DevOps to deploy Azure Node.js Function App](https://www.mickpatterson.com.au/blog/use-azure-devops-to-deploy-a-nodejs-function-app)
- [Elasticsearch documentation](https://www.elastic.co/blog/getting-started-with-the-elastic-stack-and-docker-compose)
- [ELK documentation (certificate fingerprint)](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html#authentication)


