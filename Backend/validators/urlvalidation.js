import {z} from 'zod';

const projectschema=z.object({
    projecturl:z
    .string()
    .trim()
    .url("Enter a valid URL")
    .regex(/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/,
      "Enter a valid GitHub repository URL")
});

export default projectschema;