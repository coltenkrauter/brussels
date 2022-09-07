[![Development](https://github.com/coltenkrauter/brussels/actions/workflows/branch.yaml/badge.svg?branch=development)](https://github.com/coltenkrauter/brussels/actions/workflows/branch.yaml)

[![Main](https://github.com/coltenkrauter/brussels/actions/workflows/branch.yaml/badge.svg?branch=main)](https://github.com/coltenkrauter/brussels/actions/workflows/branch.yaml)

[![Release](https://github.com/coltenkrauter/brussels/actions/workflows/release.yaml/badge.svg)](https://github.com/coltenkrauter/brussels/actions/workflows/release.yaml)


---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting started with development

```bash
# Install deps
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx/jsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts/js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deployments

### CICD platform

This project uses [GitHub Actions](https://docs.github.com/actions), a CICD platform that will run our [workflows](.github/workflows) based on certain [triggers](https://docs.github.com/actions/using-workflows/triggering-a-workflow) that are defined in the workflows.

## Initial setup

```bash
npm run bootstrap
```

## Destination

This project is deployed to AWS.

## Infrastructure as Code

We use [aws-cdk-lib (Cloud Development Kit)](https://www.npmjs.com/package/aws-cdk-lib) to deploy the infrastructure and application code. Checkout the entrypoint, [cdk/bin.ts](cdk/bin.ts) to see what is happening. 

The main way that this application is deployed is thanks to [@sls-next/cdk-construct](https://www.npmjs.com/package/@sls-next/cdk-construct) as it really simplifies things.

## Maintaining things

### Updating npm packages

Keep things fresh with this command,

```bash
rm -rf node_modules/  package-lock.json
npx npm-check-updates -u
npm i
```

### Emails

- https://nodemailer.com/transports/ses/
