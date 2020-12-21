const { ApolloServer } = require("apollo-server-cloud-functions");
const { JSONDataSource } = require("./util/datahandler");

const schemaFiles = [
    "./schema/card/card",
    "./schema/meta/attributes",
    "./schema/meta/members",
    "./schema/meta/util",
    "./schema/skills/skills",
    "./schema/query",
];

var typeDefs = [];
var resolvers = {};

for (var schema of schemaFiles) {
    const { typeDefs: typeDef, resolvers: resolver } = require(schema);
    typeDefs.push(typeDef);
    Object.assign(resolvers, resolver);
}

const data = new JSONDataSource();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        data,
    }),
    cacheControl: {
        defaultMaxAge: 1000,
    },
    introspection: true,
    playground: true,
});

exports.handler = server.createHandler({
    cors: {
        origin: "*",
    },
});
