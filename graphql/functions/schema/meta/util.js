const { gql } = require("apollo-server-cloud-functions");

exports.typeDefs = gql`
    type LocalizedString {
        jp: String
        en: String
    }
`;

exports.resolvers = {
    LocalizedString: {
        jp: (parent) => parent.jp,
        en: (parent) => parent.en,
    },
};
