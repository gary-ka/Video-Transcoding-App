import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const parameter_name = "/n11253916/url";
const client = new SSMClient({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
  },
});

export const getBaseUrl = async () => {
  try {
    const response = await client.send(
      new GetParameterCommand({
        Name: parameter_name,
      })
    );

    console.log(response.Parameter.Value);
    return response.Parameter.Value;
  } catch (error) {
    console.log(error);
  }
};
