![Chaalk Logo](https://imgur.com/a/3ieTh1p)

### Chaalk Application

#### Tech. and Services used

- **Nextjs** (Serverless + UI Framework)
- **SQLite** (Database)
- **Prisma** (ORM)
- **Next-Auth** (Authentication)
- **Core Engine (Maintained on a separate branch)** (Core Features)
- **SocketIO** (Collaboration)
- **Cloudinary** (CDN for asset hosting)

#### Get started _locally_

**Make sure to have yarn installed**

**Make sure to have nodejs latest LTS installed (v16.17.0 as of now)**

cd into the project's root directory,

```
cd /path/to/project/folder
```

Install the packages,

```
yarn
```

Let's make the database and run migrations,

```
npx prisma migrate dev
```

Rename the **_.env-template_** to **_.env_**, open it and fill out the necessary details

Now start the development server,

```
yarn dev
```
