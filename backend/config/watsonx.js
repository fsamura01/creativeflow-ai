"use strict";

const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const useMock = process.env.USE_MOCK !== "false";
const modelId = process.env.MODEL_ID || 'ibm/granite-4-h-small';
const projectId = process.env.WATSONX_PROJECT_ID || "";

let client = null;

if (!useMock) {
  client = new WatsonXAI({
    version: "2024-05-31",
    serviceUrl: process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com",
    authenticator: new IamAuthenticator({
      apikey: process.env.WATSONX_API_KEY,
    }),
  });
}

module.exports = { client, useMock, modelId, projectId };
