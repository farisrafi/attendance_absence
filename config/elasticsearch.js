import { Client } from "@elastic/elasticsearch";

const clientElasticSearch = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || "elastic",
    password: process.env.ELASTICSEARCH_PASSWORD || "changeme",
  },
});

export default clientElasticSearch;
