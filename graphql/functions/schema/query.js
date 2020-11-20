const { gql } = require("apollo-server-cloud-functions");

exports.typeDefs = gql`
    type Query {
        card(id: String, no: Int): Card
        cards: [Card]
    }
`;

exports.resolvers = {
    Query: {
        card: async (parent, args, context) => {
            const cardData = await context.dataSources.data.getObject("cards");
            if (args.id) {
                return cardData[args.id];
            } else if (args.no) {
                return Object.values(cardData).find((c) => c.no == args.no);
            }
            return null;
        },
        cards: async (parent, args, context) => {
            const cardData = await context.dataSources.data.getObject("cards");
            return Object.values(cardData);
        },
    },
};
