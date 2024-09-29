# Ecommerce Management with AI

## Table of Contents

- [Introduction](#introduction)
- [Setting Up the LLM Environment](#setting-up-the-llm-environment)
- [Application Configuration](#application-configuration)
- [Installing External Packages](#installing-external-packages)
- [Database Configuration](#database-configuration)
- [Sample User Credentials](#sample-user-credentials)
- [API Endpoints](#api-endpoints)
- [JWT Implementation](#jwt-implementation)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Ecommerce Management with AI is a powerful tool designed to facilitate ecommerce operations through advanced AI functionalities. This project includes features for product management, order processing, and user interactions, all while utilizing state-of-the-art language models.

## Setting Up the LLM Environment

1. Install Ollama on your local machine.
2. Pull an LLM model such as Llama 3.2 or Phi 3.5 for integration:
   ```bash
   ollama pull llama3.2
   ```
   or
   ```bash
   ollama pull phi3.5
   ```

## Application Configuration

1. Create a file named `.env`.
2. Set all configuration values in that file according to the provided `.env.sample`.

## Installing External Packages

Run the following command to install third-party packages and dependencies:

```bash
npm install
```

## Database Configuration

1. Create an empty database and set the `database_name` in the `.env` file.
2. Run the following command to migrate the database structure:
   ```bash
   npm run sync:database
   ```
3. Insert initial data into the database with:
   ```bash
   npm run init:data
   ```

## Sample User Credentials

### Admin User

- **Username:** `admin`
- **Password:** `admin_password`
- **Role:** `admin`
- **Permissions:**
  - create_product
  - update_product
  - delete_product
  - get_all_products
  - create_order
  - cancel_order
  - get_user_wise_orders
  - get_ranked_users
  - get_products_sale_by_category
  - get_llm_question_answer

### General User

- **Username:** `johndoe2496`
- **Password:** `1234`
- **Role:** `user`
- **Permissions:**
  - get_all_products
  - create_order
  - cancel_order

## API Endpoints

| Title                                                         | Endpoint                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| User Sign Up                                                  | `{{url}}:{{app_port}}/user/sign-up`                          |
| User Login                                                    | `{{url}}:{{app_port}}/user/login`                            |
| Create New Product                                            | `{{url}}:{{app_port}}/product/create`                        |
| Update Existing Product                                       | `{{url}}:{{app_port}}/product/update/:productId`             |
| Delete Existing Product                                       | `{{url}}:{{app_port}}/product/delete/:productId`             |
| Get All Products With Pagination                              | `{{url}}:{{app_port}}/product/product-list?page=1&limit=10`  |
| Get Total Sales Per Category                                  | `{{url}}:{{app_port}}/product/total-sales-per-category`      |
| Place New Order                                               | `{{url}}:{{app_port}}/order/create`                          |
| Cancel Existing Order                                         | `{{url}}:{{app_port}}/order/cancel/:orderId`                 |
| Get Users with Their Orders                                   | `{{url}}:{{app_port}}/order/user-order-list?page=1&limit=10` |
| Get Top Ranking Users by Highest Orders Count                 | `{{url}}:{{app_port}}/order/ranked-user-list?limit=5`        |
| Ask a Question to Get Answers Related to Ecommerce Data by AI | `{{url}}:{{app_port}}/llm/ask-question`                      |

## JWT Implementation

1. **Step 1:** Install the `jsonwebtoken` package from npm.
2. **Step 2:** Create a secret key.
3. **Step 3:** Generate a JWT using the `jwt.sign` function.
4. **Step 4:** Verify a JWT using the `jwt.verify` function.
5. **Step 5:** Add the middleware to all APIs.
